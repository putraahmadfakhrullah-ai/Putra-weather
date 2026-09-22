/* ============================================================
   PUTRA WEATHER - WORLD AIR QUALITY MAP
   ============================================================ */

const AQICN_TOKEN = '94916124e3ab3317fb4251dde7e96a82a89c72d1';

let worldMap = null;
let markersLayer = null;
let currentMarkers = [];

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

async function fetchStationsInBounds(bounds) {
    const { _southWest, _northEast } = bounds;
    const latlng = `${_southWest.lat.toFixed(3)},${_southWest.lng.toFixed(3)},${_northEast.lat.toFixed(3)},${_northEast.lng.toFixed(3)}`;

    const url = `https://api.waqi.info/map/bounds/?token=${AQICN_TOKEN}&latlng=${latlng}`;

    try {
        const res = await fetch(url);
        const data = await res.json();
        if (data.status !== 'ok') throw new Error("API error");
        return data.data || [];
    } catch (err) {
        console.error("Failed to fetch stations:", err);
        return [];
    }
}

function createMarker(station) {
    const ipu = parseInt(station.aqi);
    if (isNaN(ipu)) return null;

    const color = getIPUColor(ipu);
    const category = getIPUCategory(ipu);
    const isLight = (ipu > 50 && ipu <= 100);
    const textColor = isLight ? '#1a1a1a' : '#ffffff';

    const iconHtml = `
        <div style="
            background: ${color};
            color: ${textColor};
            border: 2px solid #ffffff;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 11px;
            font-weight: 700;
            box-shadow: 0 2px 8px rgba(0,0,0,0.5);
            cursor: pointer;
            font-family: 'Segoe UI', sans-serif;
        ">${ipu}</div>
    `;

    const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-aqi-marker',
        iconSize: [36, 36],
        iconAnchor: [18, 18]
    });

    const marker = L.marker([station.lat, station.lon], { icon: customIcon });

    const stationName = station.station && station.station.name ? station.station.name : 'Unknown Station';
    const updateTime = station.station && station.station.time ? station.station.time : 'N/A';

    const popupHtml = `
        <div style="min-width: 220px; font-family: 'Segoe UI', sans-serif;">
            <div style="font-weight: 700; font-size: 14px; margin-bottom: 0.5rem; color: #0f172a;">
                ${stationName}
            </div>
            <div style="font-size: 28px; font-weight: 800; color: ${color}; line-height: 1; margin-bottom: 0.25rem;">
                ${ipu}
            </div>
            <div style="font-size: 13px; font-weight: 600; color: ${color}; margin-bottom: 0.75rem;">
                ${category}
            </div>
            <div style="font-size: 11px; color: #64748b;">
                Updated: ${updateTime}
            </div>
        </div>
    `;

    marker.bindPopup(popupHtml);
    return marker;
}

function renderStations(stations) {
    if (!markersLayer) return;

    markersLayer.clearLayers();
    currentMarkers = [];

    let validCount = 0;
    const ipus = [];

    stations.forEach(station => {
        const marker = createMarker(station);
        if (marker) {
            marker.addTo(markersLayer);
            currentMarkers.push(marker);
            validCount++;
            const ipu = parseInt(station.aqi);
            if (!isNaN(ipu)) ipus.push(ipu);
        }
    });

    updateStats(validCount, ipus);
}

function updateStats(count, ipus) {
    document.getElementById('stations-visible').innerText = count;

    if (ipus.length === 0) {
        document.getElementById('avg-visible').innerText = '--';
        document.getElementById('worst-visible').innerText = '--';
        document.getElementById('best-visible').innerText = '--';
        return;
    }

    const avg = Math.round(ipus.reduce((a, b) => a + b, 0) / ipus.length);
    const worst = Math.max(...ipus);
    const best = Math.min(...ipus);

    document.getElementById('avg-visible').innerText = avg;
    document.getElementById('avg-visible').style.color = getIPUColor(avg);

    document.getElementById('worst-visible').innerText = worst;
    document.getElementById('worst-visible').style.color = getIPUColor(worst);

    document.getElementById('best-visible').innerText = best;
    document.getElementById('best-visible').style.color = getIPUColor(best);
}

async function loadVisibleStations() {
    if (!worldMap) return;
    console.log("Loading stations for current view...");
    const bounds = worldMap.getBounds();
    const stations = await fetchStationsInBounds(bounds);
    console.log(`Received ${stations.length} stations`);
    renderStations(stations);
}

function initWorldMap() {
    const mapElement = document.getElementById('worldMap');
    if (!mapElement) return;

    worldMap = L.map('worldMap', {
        worldCopyJump: true,
        minZoom: 2
    }).setView([15, 105], 4);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 18
    }).addTo(worldMap);

    markersLayer = L.layerGroup().addTo(worldMap);

    setTimeout(() => loadVisibleStations(), 500);

    let moveTimer = null;
    worldMap.on('moveend', () => {
        clearTimeout(moveTimer);
        moveTimer = setTimeout(loadVisibleStations, 400);
    });
}

window.addEventListener("DOMContentLoaded", () => {
    initWorldMap();
    setInterval(loadVisibleStations, 300000);
});