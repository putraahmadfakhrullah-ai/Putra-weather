// ============================================================
// PUTRA WEATHER - APIMS PROXY SERVER (MULTI-STATION)
// ============================================================
const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
app.use(cors());

const AQICN_TOKEN = '94916124e3ab3317fb4251dde7e96a82a89c72d1';

// Default station (Kuala Lumpur - Cheras)
const DEFAULT_STATION = '@002626';

app.get('/api/apims', async (req, res) => {
    // Read station from query string (e.g., /api/apims?station=@002620)
    const stationId = req.query.station || DEFAULT_STATION;

    console.log(`Fetching station ${stationId}...`);

    try {
        const url = `https://api.waqi.info/feed/${stationId}/?token=${AQICN_TOKEN}`;
        const response = await fetch(url);
        const data = await response.json();

        if (data.status !== 'ok') {
            throw new Error('AQICN error: ' + JSON.stringify(data.data));
        }

        const aqi = parseInt(data.data.aqi);
        const pm25 = data.data.iaqi && data.data.iaqi.pm25 ? data.data.iaqi.pm25.v : null;
        const station = data.data.city ? data.data.city.name : "Unknown";
        const time = data.data.time ? data.data.time.s : "unknown";
        const geo = data.data.city && data.data.city.geo ? data.data.city.geo : null;

        console.log(`OK: AQI ${aqi} | PM2.5 ${pm25} | ${station}`);

        res.json({
            status: "ok",
            data: { aqi, pm25, station, updated: time, geo }
        });

    } catch (err) {
        console.error("Failed:", err.message);
        res.status(500).json({ error: err.message });
    }
});

app.get('/', (req, res) => {
    res.send('Putra Weather proxy is running.');
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Proxy running at http://localhost:${PORT}`);
});