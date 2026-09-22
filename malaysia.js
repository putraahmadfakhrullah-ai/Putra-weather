/* ============================================================
   PUTRA WEATHER - MALAYSIA OVERVIEW (i18n, no emojis)
   ============================================================ */

const MALAYSIA_STATIONS = [
    { id: '@002626', name: 'Kuala Lumpur',   lat: 3.106, lon: 101.718 },
    { id: '@002620', name: 'Petaling Jaya',  lat: 3.133, lon: 101.608 },
    { id: '@002621', name: 'Shah Alam',      lat: 3.105, lon: 101.556 },
    { id: '@010485', name: 'Putrajaya',      lat: 2.915, lon: 101.690 },
    { id: '@002619', name: 'Klang',          lat: 3.015, lon: 101.413 },
    { id: '@002578', name: 'Johor Bahru',    lat: 1.495, lon: 103.736 },
    { id: '@002586', name: 'Melaka',         lat: 2.191, lon: 102.257 },
    { id: '@002594', name: 'Ipoh',           lat: 4.629, lon: 101.117 },
    { id: '@002600', name: 'Perai (Penang)', lat: 5.329, lon: 100.443 },
    { id: '@002592', name: 'Kuantan',        lat: 3.819, lon: 103.297 },
    { id: '@002610', name: 'Kuching',        lat: 1.562, lon: 110.389 },
    { id: '@002604', name: 'Kota Kinabalu',  lat: 5.894, lon: 116.043 }
];

function getIPUCategory(ipu) {
    if (ipu <= 50)  return t('good');
    if (ipu <= 100) return t('moderate');
    if (ipu <= 200) return t('unhealthy');
    if (ipu <= 300) return t('veryUnhealthy');
    if (ipu <= 500) return t('hazardous');
    return t('extremeHazardous');
}

function getIPUColor(ipu) {
    if (ipu <= 50)  return "#00e400";
    if (ipu <= 100) return "#f5c500";
    if (ipu <= 200) return "#ff7e00";
    if (ipu <= 300) return "#ef4444";
    if (ipu <= 500) return "#a855f7";
    return "#7e0023";
}

function getWeatherConditionText(code) {
    if (code === 0) return t('clear');
    if (code >= 1 && code <= 3) return t('partlyCloudy');
    if (code >= 45 && code <= 48) return t('fog');
    if (code >= 51 && code <= 67) return t('drizzleRain');
    if (code >= 80 && code <= 82) return t('rainShowers');
    if (code >= 95 && code <= 99) return t('thunderstorm');
    return t('overcast');
}

async function fetchStationData(station) {
    try {
        const ipuRes = await fetch(`http://localhost:3000/api/apims?station=${station.id}`);
        const ipuData = await ipuRes.json();

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${station.lat}&longitude=${station.lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;
        const weatherRes = await fetch(weatherUrl);
        const weatherData = await weatherRes.json();

        if (ipuData.status !== "ok") throw new Error("IPU fetch failed");

        return {
            name: station.name,
            aqi: ipuData.data.aqi,
            pm25: ipuData.data.pm25,
            stationName: ipuData.data.station,
            temp: weatherData.current.temperature_2m,
            humidity: weatherData.current.relative_humidity_2m,
            wind: weatherData.current.wind_speed_10m,
            weatherCode: weatherData.current.weather_code,
            success: true
        };
    } catch (error) {
        console.error(`Failed to fetch ${station.name}:`, error);
        return { name: station.name, success: false };
    }
}

function renderStateCard(data) {
    if (!data.success) {
        return `
            <div class="state-card" style="background: #334155; border-color: #475569;">
                <div class="state-card-header" style="background: #475569; color: white;">
                    <div class="state-name">${data.name}</div>
                </div>
                <div class="state-card-body">
                    <p style="color: #94a3b8; padding: 1rem 0;">${t('dataUnavailable')}</p>
                </div>
            </div>
        `;
    }

    const color = getIPUColor(data.aqi);
    const category = getIPUCategory(data.aqi);
    const isLightText = !(data.aqi > 50 && data.aqi <= 100);
    const textColor = isLightText ? '#ffffff' : '#1a1a1a';

    return `
        <div class="state-card" style="border-color: ${color};">
            <div class="state-card-header" style="background: linear-gradient(135deg, ${color} 0%, ${shadeColor(color, -20)} 100%); color: ${textColor};">
                <div class="state-name">${data.name}</div>
                <div class="state-ipu-row">
                    <div class="state-ipu">${data.aqi}</div>
                    <div class="state-category">${category}</div>
                </div>
            </div>
            <div class="state-card-body">
                <div class="state-row">
                    <span class="state-label">PM2.5</span>
                    <span class="state-value">${data.pm25} µg/m³</span>
                </div>
                <div class="state-row">
                    <span class="state-label">${t('temperature')}</span>
                    <span class="state-value">${data.temp}°C</span>
                </div>
                <div class="state-row">
                    <span class="state-label">${t('humidity')}</span>
                    <span class="state-value">${data.humidity}%</span>
                </div>
                <div class="state-row">
                    <span class="state-label">${t('wind')}</span>
                    <span class="state-value">${data.wind} km/h</span>
                </div>
                <div class="state-row">
                    <span class="state-label">${t('condition')}</span>
                    <span class="state-value">${getWeatherConditionText(data.weatherCode)}</span>
                </div>
            </div>
        </div>
    `;
}

function shadeColor(hex, percent) {
    const num = parseInt(hex.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, Math.min(255, (num >> 16) + amt));
    const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amt));
    const B = Math.max(0, Math.min(255, (num & 0x0000FF) + amt));
    return "#" + (0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1);
}

function renderSummary(allData) {
    const valid = allData.filter(d => d.success);
    if (valid.length === 0) return;

    const avg = Math.round(valid.reduce((sum, d) => sum + d.aqi, 0) / valid.length);
    document.getElementById('avg-ipu').innerText = avg;
    document.getElementById('avg-category').innerText = getIPUCategory(avg);

    const sorted = [...valid].sort((a, b) => b.aqi - a.aqi);
    const worst = sorted[0];
    const best = sorted[sorted.length - 1];

    document.getElementById('worst-state').innerText = worst.name;
    document.getElementById('worst-ipu').innerText = `IPU ${worst.aqi} (${getIPUCategory(worst.aqi)})`;

    document.getElementById('best-state').innerText = best.name;
    document.getElementById('best-ipu').innerText = `IPU ${best.aqi} (${getIPUCategory(best.aqi)})`;

    document.getElementById('station-count').innerText = valid.length;

    const now = new Date();
    const timeStr = now.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' });
    const dateStr = now.toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' });
    document.getElementById('malaysia-updated').innerText = 
        `${t('lastUpdated')}: ${timeStr}, ${dateStr} · ${t('dataSource')}`;
}

async function loadAllStations() {
    console.log("Fetching all 12 Malaysian stations...");

    const container = document.getElementById('state-cards');
    container.innerHTML = `<p style="opacity: 0.7;">Loading all 12 stations...</p>`;

    const promises = MALAYSIA_STATIONS.map(s => fetchStationData(s));
    const results = await Promise.all(promises);

    results.sort((a, b) => {
        if (!a.success && !b.success) return 0;
        if (!a.success) return 1;
        if (!b.success) return -1;
        return b.aqi - a.aqi;
    });

    container.innerHTML = results.map(renderStateCard).join('');
    renderSummary(results);

    console.log(`Loaded ${results.filter(r => r.success).length} of ${MALAYSIA_STATIONS.length} stations`);
}

window.addEventListener("DOMContentLoaded", () => {
    loadAllStations();
    setInterval(loadAllStations, 600000);
});

// Refresh content when language changes
window.refreshAllContent = function() {
    loadAllStations();
};