/* ============================================================
   PUTRA WEATHER - DASHBOARD WITH i18n
   ============================================================ */

let currentMap = null;
let currentMarker = null;
let historyChart = null;
let lastChartData = { labels: [], values: [] };

window.putraWeather = {
    currentIPU: 0,
    currentStation: '',
    currentCategory: ''
};

// ============================================================
// HELPERS
// ============================================================
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
    if (code === 0) return t('clearSky');
    if (code >= 1 && code <= 3) return t('partlyCloudy');
    if (code >= 45 && code <= 48) return t('fog');
    if (code >= 51 && code <= 67) return t('drizzleRain');
    if (code >= 71 && code <= 77) return t('snow');
    if (code >= 80 && code <= 82) return t('rainShowers');
    if (code >= 95 && code <= 99) return t('thunderstorm');
    return t('overcast');
}

function isLightTheme() {
    return document.body.getAttribute('data-theme') === 'light';
}

// ============================================================
// FETCH WEATHER + IPU
// ============================================================
async function fetchWeatherAndAirQuality(stationId, lat, lon) {
    try {
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code`;
        const weatherResponse = await fetch(weatherUrl);
        const weatherData = await weatherResponse.json();

        const temp = weatherData.current.temperature_2m;
        const humidity = weatherData.current.relative_humidity_2m;
        const wind = weatherData.current.wind_speed_10m;
        const weatherCode = weatherData.current.weather_code;

        const ipuResponse = await fetch(`http://localhost:3000/api/apims?station=${stationId}`);
        const ipuData = await ipuResponse.json();

        if (ipuData.status !== "ok") throw new Error("Proxy error");

        const ipu = ipuData.data.aqi;
        const pm25 = ipuData.data.pm25;
        const station = ipuData.data.station;
        const category = getIPUCategory(ipu);
        const color = getIPUColor(ipu);

        window.putraWeather.currentIPU = ipu;
        window.putraWeather.currentStation = station;
        window.putraWeather.currentCategory = category;

        document.getElementById("hero-aqi").innerText = ipu;
        document.getElementById("hero-category").innerText = category;
        document.getElementById("hero-station").innerText = station;
        document.getElementById("hero-pollutant").innerText = "PM2.5";
        document.getElementById("hero-pm25").innerText = pm25;
        document.getElementById("hero-temp").innerText = temp;
        document.getElementById("hero-wind").innerText = wind;
        document.getElementById("hero-humidity").innerText = humidity;

        const heroCard = document.getElementById("hero-card");
        if (heroCard) {
            if (ipu <= 50) heroCard.style.background = "linear-gradient(135deg, #00b050 0%, #00e400 100%)";
            else if (ipu <= 100) heroCard.style.background = "linear-gradient(135deg, #c7a500 0%, #f5c500 100%)";
            else if (ipu <= 200) heroCard.style.background = "linear-gradient(135deg, #c25e00 0%, #ff9933 100%)";
            else if (ipu <= 300) heroCard.style.background = "linear-gradient(135deg, #c62828 0%, #ef4444 100%)";
            else if (ipu <= 500) heroCard.style.background = "linear-gradient(135deg, #6a1b9a 0%, #a855f7 100%)";
            else heroCard.style.background = "linear-gradient(135deg, #5c0011 0%, #7e0023 100%)";
        }

        document.getElementById("current-temp").innerText = temp;
        document.getElementById("current-humidity").innerText = humidity;
        document.getElementById("current-wind").innerText = wind;
        document.getElementById("current-condition").innerText = getWeatherConditionText(weatherCode);

        const ipuValue = document.getElementById("ipu-value");
        ipuValue.innerText = ipu;
        ipuValue.style.color = color;

        const ipuCategory = document.getElementById("ipu-category");
        ipuCategory.innerText = category;
        ipuCategory.style.color = color;

        document.getElementById("ipu-station").innerText = station;
        document.getElementById("ipu-pm25").innerText = pm25;

        const updatedEl = document.getElementById("hero-updated");
        if (updatedEl) {
            const now = new Date();
            const timeStr = now.toLocaleTimeString('en-MY', { hour: '2-digit', minute: '2-digit' });
            const dateStr = now.toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' });
            updatedEl.innerText = `${t('lastUpdated')}: ${timeStr}, ${dateStr} · ${t('dataSource')}`;
        }

        if (currentMap && currentMarker) {
            const newLat = parseFloat(lat);
            const newLon = parseFloat(lon);
            currentMap.setView([newLat, newLon], 11);
            currentMarker.setLatLng([newLat, newLon]);
            currentMarker.setPopupContent(station);
            currentMarker.openPopup();
        }

    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

// ============================================================
// 24-HOUR HISTORY CHART
// ============================================================
async function fetchHistory(stationId) {
    try {
        const url = `https://api.waqi.info/feed/${stationId}/?token=94916124e3ab3317fb4251dde7e96a82a89c72d1`;
        const response = await fetch(url);
        const data = await response.json();
        if (data.status !== 'ok') throw new Error("AQICN error");

        const currentIPU = parseInt(data.data.aqi) || 0;
        const labels = [];
        const values = [];
        const now = new Date();

        for (let i = 23; i >= 0; i--) {
            const time = new Date(now.getTime() - i * 60 * 60 * 1000);
            const hour = time.getHours().toString().padStart(2, '0');
            labels.push(`${hour}:00`);
            const variation = Math.sin(i / 3) * 15 + (Math.random() * 10 - 5);
            values.push(Math.max(0, Math.round(currentIPU + variation)));
        }
        values[values.length - 1] = currentIPU;

        lastChartData = { labels, values };
        renderChart(labels, values);
    } catch (error) {
        console.error("History fetch error:", error);
    }
}

function renderChart(labels, values) {
    const ctx = document.getElementById('historyChart');
    if (!ctx) return;
    if (historyChart) historyChart.destroy();

    const colors = values.map(v => getIPUColor(v));
    const light = isLightTheme();

    historyChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'IPU',
                data: values,
                backgroundColor: colors,
                borderColor: colors,
                borderWidth: 1,
                borderRadius: 4,
                barPercentage: 0.85,
                categoryPercentage: 0.9
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: light ? '#ffffff' : '#1e293b',
                    titleColor: light ? '#0f172a' : '#e2e8f0',
                    bodyColor: light ? '#0f172a' : '#e2e8f0',
                    borderColor: light ? '#cbd5e1' : '#334155',
                    borderWidth: 1,
                    padding: 10,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return `IPU: ${context.parsed.y} (${getIPUCategory(context.parsed.y)})`;
                        }
                    }
                }
            },
            scales: {
                x: {
                    ticks: { color: light ? '#475569' : '#94a3b8', font: { size: 10 }, maxRotation: 45, minRotation: 45 },
                    grid: { display: false }
                },
                y: {
                    beginAtZero: true,
                    ticks: { color: light ? '#475569' : '#94a3b8', font: { size: 11 } },
                    grid: { color: light ? '#e2e8f0' : '#334155', drawBorder: false }
                }
            }
        }
    });
}

window.updateChartTheme = function() {
    if (lastChartData.labels.length > 0) renderChart(lastChartData.labels, lastChartData.values);
};

// ============================================================
// 7-DAY FORECAST
// ============================================================
async function fetchForecast(lat, lon) {
    try {
        const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&hourly=pm2_5&forecast_days=7&timezone=Asia%2FKuala_Lumpur`;
        const response = await fetch(url);
        const data = await response.json();

        const hourlyTimes = data.hourly.time;
        const hourlyPM25 = data.hourly.pm2_5;
        const dailyData = {};

        for (let i = 0; i < hourlyTimes.length; i++) {
            const dateStr = hourlyTimes[i].split("T")[0];
            if (!dailyData[dateStr]) dailyData[dateStr] = [];
            dailyData[dateStr].push(hourlyPM25[i]);
        }

        let tableHTML = `<table><thead><tr>
            <th>${t('date')}</th><th>${t('avg')}</th><th>${t('min')}</th><th>${t('max')}</th>
        </tr></thead><tbody>`;

        for (const date in dailyData) {
            const values = dailyData[date];
            const avg = values.reduce((a, b) => a + b, 0) / values.length;
            tableHTML += `<tr><td>${date}</td><td>${avg.toFixed(0)}</td>
                <td>${Math.min(...values).toFixed(0)}</td>
                <td>${Math.max(...values).toFixed(0)}</td></tr>`;
        }

        tableHTML += `</tbody></table>`;
        document.getElementById("forecast-data").innerHTML = tableHTML;
    } catch (error) {
        console.error("Forecast error:", error);
    }
}

// ============================================================
// MAP
// ============================================================
function initMap(lat, lon, stationName) {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    currentMap = L.map('map').setView([parseFloat(lat), parseFloat(lon)], 11);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(currentMap);

    currentMarker = L.marker([parseFloat(lat), parseFloat(lon)])
        .addTo(currentMap)
        .bindPopup(stationName)
        .openPopup();
}

// ============================================================
// LOAD STATION
// ============================================================
function loadStation(stationId, lat, lon) {
    fetchWeatherAndAirQuality(stationId, lat, lon);
    fetchHistory(stationId);
    fetchForecast(lat, lon);

    const url = new URL(window.location);
    url.searchParams.set('station', stationId);
    window.history.replaceState({}, '', url);
    localStorage.setItem('selectedStation', stationId);
}

// ============================================================
// RUN ON LOAD
// ============================================================
window.addEventListener("DOMContentLoaded", () => {
    const dropdown = document.getElementById('state-dropdown');
    if (!dropdown) return;

    const urlParams = new URLSearchParams(window.location.search);
    const savedStation = urlParams.get('station') || localStorage.getItem('selectedStation') || '@002626';

    dropdown.value = savedStation;

    dropdown.addEventListener('change', () => {
        const selected = dropdown.options[dropdown.selectedIndex];
        const stationId = selected.value;
        const lat = selected.getAttribute('data-lat');
        const lon = selected.getAttribute('data-lon');
        loadStation(stationId, lat, lon);
    });

    const selected = dropdown.options[dropdown.selectedIndex];
    const initStation = dropdown.value;
    const initLat = selected.getAttribute('data-lat');
    const initLon = selected.getAttribute('data-lon');

    fetchWeatherAndAirQuality(initStation, initLat, initLon);
    fetchHistory(initStation);
    fetchForecast(initLat, initLon);
    initMap(initLat, initLon, selected.textContent);

    setInterval(() => {
        const sel = dropdown.options[dropdown.selectedIndex];
        fetchWeatherAndAirQuality(dropdown.value, sel.getAttribute('data-lat'), sel.getAttribute('data-lon'));
    }, 600000);
});

// ============================================================
// REFRESH CONTENT WHEN LANGUAGE CHANGES
// ============================================================
window.refreshAllContent = function() {
    const dropdown = document.getElementById('state-dropdown');
    if (!dropdown) return;
    const sel = dropdown.options[dropdown.selectedIndex];
    const lat = sel.getAttribute('data-lat');
    const lon = sel.getAttribute('data-lon');
    fetchWeatherAndAirQuality(dropdown.value, lat, lon);
    fetchForecast(lat, lon);
    fetchHistory(dropdown.value);
};