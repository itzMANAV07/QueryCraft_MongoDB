# 🍃 QueryMind — Natural Language MongoDB Interface

> **Team QueryCraft** | Hack-N-Go with MongoDB 2026 | SmartBridge

![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)
![React](https://img.shields.io/badge/React-Frontend-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Backend-green?style=for-the-badge&logo=node.js)
![Groq](https://img.shields.io/badge/Groq-AI-orange?style=for-the-badge)

---

## 🚀 What is QueryMind?

QueryMind is a web application that lets **anyone query a MongoDB database using plain English** — no MongoDB syntax, no coding required.

You type a question → AI converts it to a MongoDB query → results shown instantly with charts.

---

## ✨ Features

- 🤖 **Natural Language to MongoDB** — Powered by Groq AI (LLaMA 3.3 70B)
- 📊 **Interactive Charts** — Bar, Pie, and Line charts using Recharts
- 📋 **Live Dashboard** — Real-time stats from MongoDB Atlas
- 💻 **Query Display** — See the exact MongoDB query AI generated
- 📄 **Export Results** — Download as CSV or PDF
- 🕐 **Query History** — Last 20 queries saved locally
- 🌙 **Dark Mode** — Toggle between light and dark theme
- 📱 **Responsive** — Works on all screen sizes

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js, Recharts, Axios |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Cloud) |
| AI | Groq API — LLaMA 3.3 70B |
| ODM | Mongoose |
| PDF Export | jsPDF + AutoTable |

---

## 🍃 MongoDB Features Used

- ✅ **MongoDB Atlas** — Cloud hosted database
- ✅ **Aggregation Pipeline** — Multi-stage data processing (`$group`, `$sort`, `$sum`, `$limit`)
- ✅ **Mongoose ODM** — Schema modeling and queries
- ✅ **find() queries** — Filter documents with dynamic conditions
- ✅ **countDocuments()** — Real-time collection statistics
- ✅ **3 Collections** — `customers`, `products`, `orders`

---

## 📁 Project Structure

```
nl-mongodb/
├── backend/
│   ├── server.js        # Express server + MongoDB connection + API routes
│   ├── seedData.js      # Seeds 20 customers, 20 products, 120 orders
│   ├── package.json
│   └── .env             # API keys (not committed)
├── frontend/
│   ├── src/
│   │   ├── App.js
│   │   ├── App.css
│   │   └── components/
│   │       ├── Dashboard.js     # Live stats cards
│   │       ├── SearchBar.js     # Natural language input
│   │       ├── ResultsTable.js  # Data table with CSV/PDF export
│   │       ├── Charts.js        # Bar, Pie, Line charts
│   │       ├── QueryDisplay.js  # MongoDB query viewer
│   │       └── History.js       # Query history panel
│   └── package.json
└── README.md
```

---

## ⚙️ Setup Instructions

### Prerequisites
- Node.js installed
- MongoDB Atlas account (free)
- Groq API key (free)

### 1. Clone the repository
```bash
git clone https://github.com/itzMANAV07/QueryCraft_MongoDB.git
cd QueryCraft_MongoDB
```

### 2. Setup Backend
```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:
```
MONGODB_URI=mongodb+srv://admin:yourpassword@yourcluster.mongodb.net/mongodb
GROQ_API_KEY=gsk_your_groq_api_key
PORT=5000
```

### 3. Seed the Database
```bash
node seedData.js
```
You should see: `✅ Seeded: 20 customers, 20 products, 120 orders`

### 4. Start the Backend
```bash
node server.js
```
You should see: `✅ Connected to MongoDB Atlas`

### 5. Setup & Start Frontend
```bash
cd ../frontend
npm install
npm start
```

Open your browser at **http://localhost:3000** 🎉

---

## 💡 Sample Queries to Try

| Query | Type |
|-------|------|
| Show me all customers from India | find() |
| Find all Gold tier customers | find() |
| Which products cost more than $500? | find() |
| Total revenue by country | Aggregation Pipeline |
| Top 5 most expensive products | Aggregation + sort |
| How many orders are pending? | Aggregation + count |
| Average order value by category | Aggregation + avg |
| Show delivered orders from USA | find() with filter |

---

## 👥 Team QueryCraft

<table>
  <tr>
    <td align="center">
      <strong>Manav</strong><br/>
      <a href="https://github.com/itzMANAV07">
        <img src="https://img.shields.io/badge/GitHub-itzMANAV07-black?style=flat&logo=github"/>
      </a>
      <br/>
      <a href="https://www.linkedin.com/in/manav-476733385/">
        <img src="https://img.shields.io/badge/LinkedIn-Manav-blue?style=flat&logo=linkedin"/>
      </a>
      <br/>
      <a href="mailto:myself.manav24@gmail.com">
        <img src="https://img.shields.io/badge/Gmail-myself.manav24@gmail.com-red?style=flat&logo=gmail"/>
      </a>
    </td>
  </tr>
</table>

---

## 📄 License

This project was built for the **Hack-N-Go with MongoDB 2026** hackathon organized by SmartBridge.
