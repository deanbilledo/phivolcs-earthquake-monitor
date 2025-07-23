# 🌍 PHIVOLCS Earthquake Monitor Web App

A full-stack web application that **scrapes live earthquake data** from the [PHIVOLCS official site](https://www.phivolcs.dost.gov.ph/index.php/earthquake/earthquake-information3) and visualizes it through an **interactive dashboard** with maps, charts, filters, and a modern UI.

> Built with **React.js**, **Node.js**, **Cheerio**, **Tailwind CSS**, **Chart.js**, and **Leaflet.js**.

---

## 📸 Preview

later heh

---

## ⚙️ Features

✅ Live Web Scraping from PHIVOLCS 
✅ Refresh Button to get latest earthquakes 
✅ Sortable & Searchable Earthquake Table 
✅ Interactive Earthquake Map (Leaflet) 
✅ Beautiful Charts (Magnitude, Depth, Frequency) 
✅ Latest Earthquake Highlight Panel 
✅ Export to CSV or JSON 
✅ Mobile Responsive & Dark/Light Mode 
✅ Modern UI with TailwindCSS 
✅ Built 100% using JavaScript (Node + React)

---

## 📦 Tech Stack

| Layer | Tools & Libraries |
|---|---|
| Frontend | React.js, Tailwind CSS, Axios, Chart.js, Leaflet |
| Backend | Node.js, Express.js, Cheerio, Axios |
| Hosting | Vercel (Frontend) + Render/Railway (Backend) |

---

## 🛠️ Installation

### 1. Clone the Repository

```bash
git clone [https://github.com/deanbilledo/phivolcs-earthquake-monitor.git](https://github.com/deanbilledo/phivolcs-earthquake-monitor.git)
cd phivolcs-earthquake-monitor
2. Setup Backend (Node.js + Express)
Bash

cd server
npm install
node index.js
By default, backend runs on http://localhost:3001

3. Setup Frontend (React)
Bash

cd ../client
npm install
npm run dev
React app runs on http://localhost:5173 (if using Vite)

🌐 API Endpoint
Route	Description
/api/earthquakes	Returns latest earthquake data in JSON scraped from PHIVOLCS

Export to Sheets
🖼️ Project Structure
Bash

phivolcs-earthquake-monitor/
├── client/           # React frontend
│   ├── src/components/   # Reusable UI components
│   ├── src/pages/        # Main page layouts
│   └── src/App.jsx       # Root app logic
├── server/           # Node.js backend
│   └── index.js          # Scraper API
├── data/             # Cached earthquake data (optional)
├── README.md
└── package.json
📊 Sample Data Format
JSON

[
  {
    "date": "2025-07-23",
    "time": "10:32:00",
    "latitude": 14.345,
    "longitude": 121.123,
    "depth": "10 km",
    "magnitude": 4.8,
    "location": "Batangas",
    "origin": "Tectonic",
    "intensity": "IV"
  }
]
📥 Export Options
Download CSV — Get current table as .csv

Download JSON — Save full data dump

💡 Future Ideas
Push Notifications for major earthquakes
Historical trends charting
Magnitude heatmap overlays
Offline-first PWA mode

🤝 Contributing
Contributions are welcome! Feel free to fork the project, open issues, or submit pull requests.

🛡️ License
MIT License © 2025 Dean Billedo

🙏 Acknowledgements
PHIVOLCS for providing public earthquake data
Leaflet.js for interactive mapping
Chart.js for beautiful chart visualizations
