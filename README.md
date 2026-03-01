# 🍃 QueryMind — Natural Language MongoDB Interface

> **Hack-N-Go with MongoDB 2026** | AI-Powered Database Querying for Everyone

Ask your database questions in plain English. No SQL, no MongoDB syntax needed.

---

## ⚡ QUICK START (follow in order)

### STEP 1 — Get Your Free API Keys

#### A) MongoDB Atlas (Free Forever)
1. Go to https://mongodb.com/atlas → Sign up free
2. Create a FREE cluster (M0 tier)
3. In **Database Access** → Add user → username: `admin` password: `admin123`
4. In **Network Access** → Add IP → Allow Access from Anywhere (0.0.0.0/0)
5. Click **Connect** → **Drivers** → Copy connection string
   - Looks like: `mongodb+srv://admin:admin123@cluster0.xxxxx.mongodb.net/`

#### B) Groq API Key (100% Free, No Credit Card)
1. Go to https://console.groq.com → Sign up free
2. Go to **API Keys** → Create new key
3. Copy the key (starts with `gsk_...`)

---

### STEP 2 — Setup Backend

```bash
cd backend
npm install
```

Create a file called `.env` (copy from `.env.example`):
```
MONGODB_URI=mongodb+srv://admin:admin123@cluster0.xxxxx.mongodb.net/ecommerce
GROQ_API_KEY=gsk_your_groq_key_here
PORT=5000
```

Seed the database with sample data:
```bash
node seedData.js
```
You should see: `✅ Seeded: 20 customers, 20 products, 120 orders`

Start the backend:
```bash
node server.js
```
You should see:
```
✅ Connected to MongoDB Atlas
🚀 Server running on http://localhost:5000
```

---

### STEP 3 — Setup Frontend

Open a **NEW terminal window**:

```bash
cd frontend
npm install
npm start
```

Your browser opens at **http://localhost:3000** 🎉

---

## 🎯 DEMO QUERIES FOR JUDGES

Copy-paste these to impress judges:

**Simple Finds:**
- `Show me all customers from India`
- `Find all Platinum membership customers`
- `Which products cost more than $500?`
- `Show delivered orders`

**Analytics (These generate Aggregation Pipelines!):**
- `Total revenue by country`
- `Average order value by category`
- `How many orders are in each status?`
- `Top 5 most expensive products`

**Business Intelligence:**
- `Show customers who spent more than $20000`
- `Products with rating above 4.7`
- `Orders placed using PayPal`

---

## 🏗️ Project Structure

```
nl-mongodb/
├── backend/
│   ├── server.js       ← Express API + Groq AI integration
│   ├── seedData.js     ← 160 sample records (20+20+120)
│   └── .env            ← Your API keys (create this!)
└── frontend/
    └── src/
        ├── App.js               ← Main app with dark mode
        ├── components/
        │   ├── SearchBar.js     ← Natural language input
        │   ├── ResultsTable.js  ← Results + CSV/PDF export
        │   ├── Charts.js        ← Auto bar/pie/line charts
        │   ├── QueryDisplay.js  ← Shows generated MongoDB query
        │   ├── Dashboard.js     ← Live stats overview
        │   └── History.js       ← Query history panel
        └── App.css              ← Full dark mode + responsive
```

## 🚀 Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Recharts, jsPDF |
| Backend | Node.js, Express |
| Database | MongoDB Atlas |
| AI | Groq (Llama 3.3 70B) — FREE |
| Styling | Custom CSS with dark mode |

---

## 🔧 Common Issues

| Problem | Fix |
|---------|-----|
| `Cannot connect to server` | Make sure `node server.js` is running |
| MongoDB connection failed | Check your `.env` MONGODB_URI is correct |
| Groq API error | Check your `.env` GROQ_API_KEY is correct |
| `npm install` fails | Run as administrator / check internet |
| Port 3000 in use | React will ask to use another port — press Y |
| AI gives wrong query | Rephrase the question more clearly |

---

## 🏆 Judging Criteria Coverage

| Criteria | How This Project Scores |
|----------|------------------------|
| Innovation | NLP → MongoDB, context-aware, educational query display |
| Technical | MERN + Groq AI + Aggregation Pipelines + Atlas |
| Feasibility | Fully working demo, 160 real records |
| Impact | Democratizes data access, reduces DBA dependency |
| Presentation | Dark mode, charts, export, live dashboard |

---

Built with ❤️ for Hack-N-Go with MongoDB 2026
