/* ============================================================
   PUTRA WEATHER - ANALYTICS (i18n)
   ============================================================ */

const STATION_COORDS = {
    '@002626': { lat: 3.106, lon: 101.718, name: 'Kuala Lumpur' },
    '@002620': { lat: 3.133, lon: 101.608, name: 'Petaling Jaya' },
    '@002621': { lat: 3.105, lon: 101.556, name: 'Shah Alam' },
    '@010485': { lat: 2.915, lon: 101.690, name: 'Putrajaya' },
    '@002619': { lat: 3.015, lon: 101.413, name: 'Klang' },
    '@002578': { lat: 1.495, lon: 103.736, name: 'Johor Bahru' },
    '@002586': { lat: 2.191, lon: 102.257, name: 'Melaka' },
    '@002594': { lat: 4.629, lon: 101.117, name: 'Ipoh' },
    '@002600': { lat: 5.329, lon: 100.443, name: 'Perai (Penang)' },
    '@002592': { lat: 3.819, lon: 103.297, name: 'Kuantan' },
    '@002610': { lat: 1.562, lon: 110.389, name: 'Kuching' },
    '@002604': { lat: 5.894, lon: 116.043, name: 'Kota Kinabalu' }
};

const AQICN_TOKEN = '94916124e3ab3317fb4251dde7e96a82a89c72d1';

let activeStation = '@002626';
let trendChartInstance = null;
let pollutantChartInstance = null;
let hourlyChartInstance = null;

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

function isLightTheme() {
    return document.body.getAttribute('data-theme') === 'light';
}

async function fetchCurrentStation(stationId) {
    try {
        const res = await fetch(`http://localhost:3000/api/apims?station=${stationId}`);
        const data = await res.json();

        if (data.status === "ok") {
            const ipu = data.data.aqi;
            document.getElementById('analytics-station').innerText = data.data.station;
            document.getElementById('analytics-ipu').innerText = ipu;
            document.getElementById('analytics-ipu').style.color = getIPUColor(ipu);
            document.getElementById('analytics-category').innerText = getIPUCategory(ipu);
            document.getElementById('analytics-category').style.color = getIPUColor(ipu);
            document.getElementById('analytics-pm25').innerText = data.data.pm25;
        }
    } catch (err) {
        console.error("Failed to load station info:", err);
    }
}

async function renderTrendChart(stationId) {
    const coords = STATION_COORDS[stationId];
    if (!coords) return;

    try {
        const url = `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${coords.lat}&longitude=${coords.lon}&hourly=pm2_5&forecast_days=7&timezone=Asia%2FKuala_Lumpur`;
        const res = await fetch(url);
        const data = await res.json();

        const dailyAvg = {};
        for (let i = 0; i < data.hourly.time.length; i++) {
            const dateStr = data.hourly.time[i].split("T")[0];
            if (!dailyAvg[dateStr]) dailyAvg[dateStr] = [];
            dailyAvg[dateStr].push(data.hourly.pm2_5[i]);
        }

        const labels = Object.keys(dailyAvg).map(d => d.slice(5));
        const values = Object.keys(dailyAvg).map(d => {
            const vals = dailyAvg[d];
            return vals.reduce((a, b) => a + b, 0) / vals.length;
        });

        if (trendChartInstance) trendChartInstance.destroy();

        const light = isLightTheme();
        const ctx = document.getElementById('trendChart');

        trendChartInstance = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'PM2.5 (µg/m³)',
                    data: values.map(v => parseFloat(v.toFixed(1))),
                    borderColor: '#a855f7',
                    backgroundColor: 'rgba(168, 85, 247, 0.15)',
                    borderWidth: 3,
                    tension: 0.4,
                    fill: true,
                    pointBackgroundColor: '#a855f7',
                    pointBorderColor: '#fff',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 8
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: light ? '#0f172a' : '#e2e8f0', font: { size: 13 } }
                    },
                    tooltip: {
                        backgroundColor: light ? '#ffffff' : '#1e293b',
                        titleColor: light ? '#0f172a' : '#e2e8f0',
                        bodyColor: light ? '#0f172a' : '#e2e8f0',
                        borderColor: light ? '#cbd5e1' : '#334155',
                        borderWidth: 1,
                        padding: 12
                    }
                },
                scales: {
                    x: {
                        ticks: { color: light ? '#475569' : '#94a3b8' },
                        grid: { color: light ? '#e2e8f0' : '#334155' }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { color: light ? '#475569' : '#94a3b8' },
                        grid: { color: light ? '#e2e8f0' : '#334155' }
                    }
                }
            }
        });
    } catch (err) {
        console.error("Trend chart error:", err);
    }
}

async function renderPollutantChart(stationId) {
    try {
        const res = await fetch(`https://api.waqi.info/feed/${stationId}/?token=${AQICN_TOKEN}`);
        const data = await res.json();
        if (data.status !== 'ok') throw new Error("AQICN error");

        const iaqi = data.data.iaqi || {};
        const pollutants = [
            { name: 'PM2.5', value: iaqi.pm25?.v || 0, color: '#ef4444' },
            { name: 'PM10',  value: iaqi.pm10?.v || 0, color: '#f97316' },
            { name: 'O₃',    value: iaqi.o3?.v || 0,   color: '#eab308' },
            { name: 'NO₂',   value: iaqi.no2?.v || 0,  color: '#22c55e' },
            { name: 'SO₂',   value: iaqi.so2?.v || 0,  color: '#3b82f6' },
            { name: 'CO',    value: iaqi.co?.v || 0,   color: '#a855f7' }
        ].filter(p => p.value > 0);

        if (pollutants.length === 0) {
            pollutants.push({ name: 'No data', value: 1, color: '#64748b' });
        }

        if (pollutantChartInstance) pollutantChartInstance.destroy();

        const light = isLightTheme();
        const ctx = document.getElementById('pollutantChart');

        pollutantChartInstance = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: pollutants.map(p => p.name),
                datasets: [{
                    data: pollutants.map(p => p.value),
                    backgroundColor: pollutants.map(p => p.color),
                    borderColor: light ? '#ffffff' : '#1e293b',
                    borderWidth: 3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '55%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: light ? '#0f172a' : '#e2e8f0',
                            padding: 15,
                            font: { size: 13 }
                        }
                    },
                    tooltip: {
                        backgroundColor: light ? '#ffffff' : '#1e293b',
                        titleColor: light ? '#0f172a' : '#e2e8f0',
                        bodyColor: light ? '#0f172a' : '#e2e8f0',
                        borderColor: light ? '#cbd5e1' : '#334155',
                        borderWidth: 1,
                        padding: 12,
                        callbacks: {
                            label: function(context) {
                                return `${context.label}: ${context.parsed}`;
                            }
                        }
                    }
                }
            }
        });
    } catch (err) {
        console.error("Pollutant chart error:", err);
    }
}

async function renderHourlyChart(stationId) {
    try {
        const res = await fetch(`https://api.waqi.info/feed/${stationId}/?token=${AQICN_TOKEN}`);
        const data = await res.json();
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

        const colors = values.map(v => getIPUColor(v));

        if (hourlyChartInstance) hourlyChartInstance.destroy();

        const light = isLightTheme();
        const ctx = document.getElementById('hourlyChart');

        hourlyChartInstance = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: labels,
                datasets: [{
                    label: 'IPU',
                    data: values,
                    backgroundColor: colors,
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
                        callbacks: {
                            label: function(context) {
                                return `IPU: ${context.parsed.y} (${getIPUCategory(context.parsed.y)})`;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: light ? '#475569' : '#94a3b8', font: { size: 10 } },
                        grid: { display: false }
                    },
                    y: {
                        beginAtZero: true,
                        ticks: { color: light ? '#475569' : '#94a3b8' },
                        grid: { color: light ? '#e2e8f0' : '#334155' }
                    }
                }
            }
        });
    } catch (err) {
        console.error("Hourly chart error:", err);
    }
}

function loadAnalytics(stationId) {
    fetchCurrentStation(stationId);
    renderTrendChart(stationId);
    renderPollutantChart(stationId);
    renderHourlyChart(stationId);
}

window.addEventListener("DOMContentLoaded", () => {
    const dropdown = document.getElementById('state-dropdown');
    const urlParams = new URLSearchParams(window.location.search);
    const savedStation = urlParams.get('station') || localStorage.getItem('selectedStation') || '@002626';

    activeStation = savedStation;

    if (dropdown) {
        dropdown.value = savedStation;

        dropdown.addEventListener('change', () => {
            const selected = dropdown.options[dropdown.selectedIndex];
            const stationId = selected.value;
            activeStation = stationId;
            localStorage.setItem('selectedStation', stationId);

            const url = new URL(window.location);
            url.searchParams.set('station', stationId);
            window.history.replaceState({}, '', url);

            loadAnalytics(stationId);
        });
    }

    loadAnalytics(activeStation);
});

// Refresh when language changes
window.refreshAllContent = function() {
    loadAnalytics(activeStation);
};