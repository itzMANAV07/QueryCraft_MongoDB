const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Groq = require('groq-sdk');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// ─── DATABASE CONNECTION ────────────────────────────────────────────────────

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB Atlas'))
  .catch(err => console.error('❌ MongoDB error:', err));

// ─── SCHEMAS & MODELS ───────────────────────────────────────────────────────

const Customer = mongoose.model('Customer', new mongoose.Schema({
  name: String, email: String, country: String, city: String,
  age: Number, gender: String, membershipTier: String,
  totalSpent: Number, joinedDate: Date, status: String, phone: String
}));

const Product = mongoose.model('Product', new mongoose.Schema({
  name: String, category: String, brand: String, price: Number,
  stock: Number, rating: Number, reviewCount: Number,
  description: String, isActive: Boolean
}));

const Order = mongoose.model('Order', new mongoose.Schema({
  orderId: String, customerName: String, customerEmail: String,
  country: String, product: String, category: String,
  quantity: Number, unitPrice: Number, totalAmount: Number,
  status: String, paymentMethod: String,
  orderDate: Date, deliveryDate: Date
}));

// ─── COLLECTION NAME MAPPING (fixes "Unknown collection" error) ──────────────
const models = {
  // singular
  Customer, Product, Order,
  customer: Customer, product: Product, order: Order,
  // plural
  customers: Customer, products: Product, orders: Order,
  // uppercase plural
  Customers: Customer, Products: Product, Orders: Order,
};

// ─── GROQ AI CLIENT ─────────────────────────────────────────────────────────

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const DB_SCHEMA = `
Collections available:
1. customers - Fields: name, email, country, city, age, gender, membershipTier (Bronze/Silver/Gold/Platinum), totalSpent (Number), joinedDate (Date), status (active/inactive), phone
2. products  - Fields: name, category, brand, price (Number), stock (Number), rating (Number), reviewCount (Number), description, isActive (Boolean)
3. orders    - Fields: orderId, customerName, customerEmail, country, product, category, quantity (Number), unitPrice (Number), totalAmount (Number), status (pending/processing/shipped/delivered/cancelled), paymentMethod, orderDate (Date), deliveryDate (Date)
`;

// ─── QUERY ROUTE ─────────────────────────────────────────────────────────────

app.post('/api/query', async (req, res) => {
  const { question } = req.body;
  if (!question || question.trim() === '') {
    return res.status(400).json({ success: false, error: 'Question is required' });
  }

  try {
    // 1. Ask Groq AI to generate the query
    const aiResponse = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'system',
        content: `You are a MongoDB expert. Convert natural language questions into MongoDB queries.
${DB_SCHEMA}

RULES - follow exactly:
1. Return ONLY a JSON object, nothing else, no markdown, no explanation
2. JSON format: {"collection": "customers|products|orders", "type": "find|aggregate", "pipeline": [...] OR "filter": {...}, "sort": {}, "limit": 50}
3. For simple finds: use "type":"find" with "filter" object
4. For aggregations (group by, average, count, sum): use "type":"aggregate" with "pipeline" array
5. Always include "limit": 50 unless user asks for all
6. For date comparisons, use: {"$gte": {"$date": "2024-01-01"}} format
7. Field names are case-sensitive - use exact names from schema
8. For count queries, use aggregate with $count
9. Common membership tiers: Bronze, Silver, Gold, Platinum (capitalize first letter)`
      }, {
        role: 'user',
        content: `Question: "${question}"\n\nReturn ONLY the JSON object:`
      }],
      temperature: 0.1,
      max_tokens: 500
    });

    const rawAI = aiResponse.choices[0].message.content.trim();

    // 2. Parse the AI response
    let queryPlan;
    try {
      const cleaned = rawAI.replace(/```json|```/g, '').trim();
      queryPlan = JSON.parse(cleaned);
    } catch (parseErr) {
      return res.json({
        success: false,
        error: 'AI could not understand that question. Try rephrasing it.',
        rawAI
      });
    }

    const { collection, type, filter, pipeline, sort, limit } = queryPlan;

    // ── FIX: look up model by any casing/plural form ──
    const Model = models[collection] || models[collection?.toLowerCase()] || models[collection?.charAt(0).toUpperCase() + collection?.slice(1)];

    if (!Model) {
      return res.json({ success: false, error: `Unknown collection: ${collection}` });
    }

    // 3. Execute the query
    let results;
    let mongoQueryString;

    if (type === 'aggregate') {
      results = await Model.aggregate(pipeline);
      mongoQueryString = `db.${collection}.aggregate(${JSON.stringify(pipeline, null, 2)})`;
    } else {
      const parsedFilter = processFilter(filter || {});
      const q = Model.find(parsedFilter);
      if (sort) q.sort(sort);
      q.limit(limit || 50);
      results = await q.lean();
      mongoQueryString = `db.${collection}.find(${JSON.stringify(parsedFilter, null, 2)})${sort ? `.sort(${JSON.stringify(sort)})` : ''}.limit(${limit || 50})`;
    }

    // 4. Generate AI summary
    const summaryRes = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{
        role: 'user',
        content: `Question: "${question}". Results count: ${results.length}. First few: ${JSON.stringify(results.slice(0, 3))}. Write a single friendly sentence summary of these results. Be specific with numbers.`
      }],
      max_tokens: 100
    });

    res.json({
      success: true,
      collection,
      query: mongoQueryString,
      results,
      count: results.length,
      summary: summaryRes.choices[0].message.content.trim()
    });

  } catch (err) {
    console.error('Query error:', err);
    res.json({ success: false, error: err.message });
  }
});

// Helper: process $date objects from AI response
function processFilter(filter) {
  const processed = JSON.parse(JSON.stringify(filter));
  function recurse(obj) {
    for (const key in obj) {
      if (obj[key] && typeof obj[key] === 'object') {
        if (obj[key]['$date']) {
          obj[key] = new Date(obj[key]['$date']);
        } else {
          recurse(obj[key]);
        }
      }
    }
  }
  recurse(processed);
  return processed;
}

// ─── STATS ROUTE (for dashboard) ────────────────────────────────────────────

app.get('/api/stats', async (req, res) => {
  try {
    const [totalCustomers, totalProducts, totalOrders, revenueData, ordersByStatus, topCountries] = await Promise.all([
      Customer.countDocuments(),
      Product.countDocuments(),
      Order.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
      Order.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Order.aggregate([{ $group: { _id: '$country', revenue: { $sum: '$totalAmount' }, orders: { $sum: 1 } } }, { $sort: { revenue: -1 } }, { $limit: 5 }])
    ]);
    res.json({
      totalCustomers,
      totalProducts,
      totalOrders,
      totalRevenue: revenueData[0]?.total || 0,
      ordersByStatus,
      topCountries
    });
  } catch (err) {
    res.json({ success: false, error: err.message });
  }
});

// ─── SUGGESTIONS ROUTE ──────────────────────────────────────────────────────

app.get('/api/suggestions', (req, res) => {
  res.json([
    "Show me all customers from India",
    "Find all Gold tier customers",
    "Which products cost more than $500?",
    "Show delivered orders from USA",
    "Total revenue by country",
    "Top 5 most expensive products",
    "How many orders are pending?",
    "Average order value by category",
    "Show customers who spent more than $20000",
    "Find all Electronics products",
    "Orders placed in 2024",
    "Show all Platinum membership customers",
    "Which customers are inactive?",
    "Products with rating above 4.7",
    "Total sales by product category"
  ]);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));