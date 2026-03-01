const dns = require('dns');
dns.setDefaultResultOrder('ipv4first');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch(err => { console.error('❌ Connection error:', err); process.exit(1); });

// ─── SCHEMAS ───────────────────────────────────────────────────────────────

const customerSchema = new mongoose.Schema({
  name: String, email: String, country: String, city: String,
  age: Number, gender: String, membershipTier: String,
  totalSpent: Number, joinedDate: Date, status: String, phone: String
});

const productSchema = new mongoose.Schema({
  name: String, category: String, brand: String, price: Number,
  stock: Number, rating: Number, reviewCount: Number,
  description: String, isActive: Boolean
});

const orderSchema = new mongoose.Schema({
  orderId: String, customerName: String, customerEmail: String,
  country: String, product: String, category: String,
  quantity: Number, unitPrice: Number, totalAmount: Number,
  status: String, paymentMethod: String,
  orderDate: Date, deliveryDate: Date
});

const Customer = mongoose.model('Customer', customerSchema);
const Product = mongoose.model('Product', productSchema);
const Order = mongoose.model('Order', orderSchema);

// ─── DATA ──────────────────────────────────────────────────────────────────

const customers = [
  { name: "Rahul Sharma", email: "rahul@gmail.com", country: "India", city: "Mumbai", age: 28, gender: "Male", membershipTier: "Gold", totalSpent: 12500, joinedDate: new Date("2022-03-15"), status: "active", phone: "+91-9876543210" },
  { name: "Priya Patel", email: "priya@gmail.com", country: "India", city: "Delhi", age: 32, gender: "Female", membershipTier: "Platinum", totalSpent: 28000, joinedDate: new Date("2021-07-20"), status: "active", phone: "+91-9123456789" },
  { name: "Ankit Verma", email: "ankit@gmail.com", country: "India", city: "Bangalore", age: 25, gender: "Male", membershipTier: "Silver", totalSpent: 5600, joinedDate: new Date("2023-01-10"), status: "active", phone: "+91-9988776655" },
  { name: "Sneha Reddy", email: "sneha@gmail.com", country: "India", city: "Hyderabad", age: 29, gender: "Female", membershipTier: "Gold", totalSpent: 15200, joinedDate: new Date("2022-09-05"), status: "active", phone: "+91-9871234560" },
  { name: "Vikram Singh", email: "vikram@gmail.com", country: "India", city: "Chennai", age: 35, gender: "Male", membershipTier: "Bronze", totalSpent: 2100, joinedDate: new Date("2023-06-12"), status: "inactive", phone: "+91-9765432100" },
  { name: "John Smith", email: "john@gmail.com", country: "USA", city: "New York", age: 42, gender: "Male", membershipTier: "Platinum", totalSpent: 45000, joinedDate: new Date("2020-11-08"), status: "active", phone: "+1-2125550100" },
  { name: "Emily Davis", email: "emily@gmail.com", country: "USA", city: "Los Angeles", age: 27, gender: "Female", membershipTier: "Gold", totalSpent: 18900, joinedDate: new Date("2021-04-22"), status: "active", phone: "+1-3105550199" },
  { name: "Michael Brown", email: "michael@gmail.com", country: "USA", city: "Chicago", age: 38, gender: "Male", membershipTier: "Silver", totalSpent: 7800, joinedDate: new Date("2022-08-14"), status: "active", phone: "+1-3125550177" },
  { name: "Sarah Wilson", email: "sarah@gmail.com", country: "USA", city: "Houston", age: 31, gender: "Female", membershipTier: "Gold", totalSpent: 22300, joinedDate: new Date("2021-12-01"), status: "active", phone: "+1-7135550144" },
  { name: "David Johnson", email: "david@gmail.com", country: "USA", city: "Phoenix", age: 45, gender: "Male", membershipTier: "Bronze", totalSpent: 1200, joinedDate: new Date("2023-09-30"), status: "inactive", phone: "+1-6025550122" },
  { name: "Hans Mueller", email: "hans@gmail.com", country: "Germany", city: "Berlin", age: 36, gender: "Male", membershipTier: "Gold", totalSpent: 16700, joinedDate: new Date("2021-06-18"), status: "active", phone: "+49-3055550111" },
  { name: "Anna Schmidt", email: "anna@gmail.com", country: "Germany", city: "Munich", age: 28, gender: "Female", membershipTier: "Platinum", totalSpent: 31000, joinedDate: new Date("2020-09-25"), status: "active", phone: "+49-8955550133" },
  { name: "Marie Dupont", email: "marie@gmail.com", country: "France", city: "Paris", age: 33, gender: "Female", membershipTier: "Silver", totalSpent: 8900, joinedDate: new Date("2022-05-07"), status: "active", phone: "+33-155550166" },
  { name: "Pierre Martin", email: "pierre@gmail.com", country: "France", city: "Lyon", age: 40, gender: "Male", membershipTier: "Gold", totalSpent: 19500, joinedDate: new Date("2021-03-14"), status: "active", phone: "+33-255550188" },
  { name: "Yuki Tanaka", email: "yuki@gmail.com", country: "Japan", city: "Tokyo", age: 26, gender: "Female", membershipTier: "Gold", totalSpent: 14800, joinedDate: new Date("2022-01-29"), status: "active", phone: "+81-335550177" },
  { name: "Kenji Suzuki", email: "kenji@gmail.com", country: "Japan", city: "Osaka", age: 34, gender: "Male", membershipTier: "Platinum", totalSpent: 38500, joinedDate: new Date("2020-07-11"), status: "active", phone: "+81-665550199" },
  { name: "Carlos Ruiz", email: "carlos@gmail.com", country: "Mexico", city: "Mexico City", age: 30, gender: "Male", membershipTier: "Silver", totalSpent: 6300, joinedDate: new Date("2022-11-19"), status: "active", phone: "+52-5555550111" },
  { name: "Li Wei", email: "liwei@gmail.com", country: "China", city: "Shanghai", age: 29, gender: "Male", membershipTier: "Gold", totalSpent: 17200, joinedDate: new Date("2021-10-03"), status: "active", phone: "+86-2155550144" },
  { name: "Mei Lin", email: "meilin@gmail.com", country: "China", city: "Beijing", age: 27, gender: "Female", membershipTier: "Silver", totalSpent: 9100, joinedDate: new Date("2022-04-16"), status: "active", phone: "+86-1055550166" },
  { name: "Ahmed Hassan", email: "ahmed@gmail.com", country: "UAE", city: "Dubai", age: 37, gender: "Male", membershipTier: "Platinum", totalSpent: 52000, joinedDate: new Date("2020-02-28"), status: "active", phone: "+971-45550188" }
];

const products = [
  { name: "iPhone 15 Pro", category: "Electronics", brand: "Apple", price: 999, stock: 150, rating: 4.8, reviewCount: 2340, description: "Latest Apple flagship smartphone", isActive: true },
  { name: "Samsung Galaxy S24", category: "Electronics", brand: "Samsung", price: 799, stock: 200, rating: 4.6, reviewCount: 1890, description: "Android flagship smartphone", isActive: true },
  { name: "MacBook Air M3", category: "Electronics", brand: "Apple", price: 1299, stock: 75, rating: 4.9, reviewCount: 987, description: "Ultra-thin laptop with M3 chip", isActive: true },
  { name: "Sony WH-1000XM5", category: "Electronics", brand: "Sony", price: 349, stock: 320, rating: 4.7, reviewCount: 3210, description: "Premium noise-cancelling headphones", isActive: true },
  { name: "Nike Air Max 270", category: "Footwear", brand: "Nike", price: 150, stock: 500, rating: 4.5, reviewCount: 4500, description: "Iconic running shoes", isActive: true },
  { name: "Adidas Ultraboost 23", category: "Footwear", brand: "Adidas", price: 180, stock: 380, rating: 4.4, reviewCount: 3890, description: "Premium running shoes", isActive: true },
  { name: "Levi's 501 Jeans", category: "Clothing", brand: "Levi's", price: 89, stock: 750, rating: 4.3, reviewCount: 6700, description: "Classic straight fit jeans", isActive: true },
  { name: "The North Face Jacket", category: "Clothing", brand: "The North Face", price: 220, stock: 180, rating: 4.6, reviewCount: 2100, description: "Waterproof outdoor jacket", isActive: true },
  { name: "Instant Pot Duo", category: "Kitchen", brand: "Instant Pot", price: 79, stock: 600, rating: 4.7, reviewCount: 12000, description: "7-in-1 electric pressure cooker", isActive: true },
  { name: "Dyson V15 Vacuum", category: "Home", brand: "Dyson", price: 599, stock: 120, rating: 4.8, reviewCount: 1560, description: "Cordless stick vacuum", isActive: true },
  { name: "Kindle Paperwhite", category: "Electronics", brand: "Amazon", price: 139, stock: 400, rating: 4.6, reviewCount: 8900, description: "E-reader with 6.8 inch display", isActive: true },
  { name: "iPad Air", category: "Electronics", brand: "Apple", price: 599, stock: 90, rating: 4.7, reviewCount: 3400, description: "Powerful and versatile iPad", isActive: true },
  { name: "Puma RS-X Shoes", category: "Footwear", brand: "Puma", price: 110, stock: 420, rating: 4.2, reviewCount: 2800, description: "Chunky retro-inspired sneakers", isActive: true },
  { name: "H&M Linen Shirt", category: "Clothing", brand: "H&M", price: 35, stock: 1200, rating: 4.0, reviewCount: 5600, description: "Breathable linen casual shirt", isActive: true },
  { name: "IKEA MALM Desk", category: "Furniture", brand: "IKEA", price: 199, stock: 85, rating: 4.3, reviewCount: 2300, description: "Clean-design work desk", isActive: false },
  { name: "PlayStation 5", category: "Electronics", brand: "Sony", price: 499, stock: 45, rating: 4.9, reviewCount: 5600, description: "Next-gen gaming console", isActive: true },
  { name: "Canon EOS R50", category: "Electronics", brand: "Canon", price: 879, stock: 60, rating: 4.5, reviewCount: 890, description: "Mirrorless camera for beginners", isActive: true },
  { name: "Weber Grill", category: "Outdoor", brand: "Weber", price: 399, stock: 70, rating: 4.7, reviewCount: 3400, description: "Compact charcoal grill", isActive: true },
  { name: "Vitamix Blender", category: "Kitchen", brand: "Vitamix", price: 449, stock: 110, rating: 4.8, reviewCount: 4500, description: "Professional-grade blender", isActive: true },
  { name: "Apple Watch Series 9", category: "Electronics", brand: "Apple", price: 399, stock: 175, rating: 4.7, reviewCount: 6700, description: "Advanced smartwatch", isActive: true }
];

const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"];
const paymentMethods = ["Credit Card", "PayPal", "Debit Card", "UPI", "Bank Transfer"];

function randomDate(start, end) {
  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
}

const orders = [];
for (let i = 1; i <= 120; i++) {
  const customer = customers[Math.floor(Math.random() * customers.length)];
  const product = products[Math.floor(Math.random() * products.length)];
  const quantity = Math.floor(Math.random() * 4) + 1;
  const orderDate = randomDate(new Date("2023-01-01"), new Date("2024-12-31"));
  const deliveryDate = new Date(orderDate.getTime() + (Math.floor(Math.random() * 10) + 2) * 86400000);
  orders.push({
    orderId: `ORD-${String(i).padStart(4, '0')}`,
    customerName: customer.name,
    customerEmail: customer.email,
    country: customer.country,
    product: product.name,
    category: product.category,
    quantity,
    unitPrice: product.price,
    totalAmount: quantity * product.price,
    status: statuses[Math.floor(Math.random() * statuses.length)],
    paymentMethod: paymentMethods[Math.floor(Math.random() * paymentMethods.length)],
    orderDate,
    deliveryDate
  });
}

async function seedDatabase() {
  try {
    await Customer.deleteMany({});
    await Product.deleteMany({});
    await Order.deleteMany({});
    await Customer.insertMany(customers);
    await Product.insertMany(products);
    await Order.insertMany(orders);
    console.log(`✅ Seeded: ${customers.length} customers, ${products.length} products, ${orders.length} orders`);
    console.log('🎉 Database ready! You can now start the server.');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err);
    process.exit(1);
  }
}

seedDatabase();
