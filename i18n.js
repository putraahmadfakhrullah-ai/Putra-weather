/* ============================================================
   PUTRA WEATHER - INTERNATIONALIZATION (EN / MS)
   ============================================================ */

const TRANSLATIONS = {
    en: {
        // Nav
        dashboard: "Dashboard",
        analytics: "Analytics",
        malaysia: "Malaysia",
        world: "World",
        map: "Map",
        about: "About",
        forecast: "Forecast",
        location: "Location",

        // Dashboard
        pageTitle: "Live Weather & Air Quality",
        currentWeather: "Current Weather",
        airPollutantIndex: "Air Pollutant Index (IPU)",
        station: "Station",
        status: "Status",
        mainPollutant: "Main pollutant",
        temperature: "Temperature",
        humidity: "Humidity",
        wind: "Wind",
        condition: "Condition",
        lastUpdated: "Last updated",
        dataSource: "Data source: JAS Malaysia (via AQICN)",
        hour24Trend: "24-Hour Air Quality Trend",
        pm25Forecast: "PM2.5 Forecast (Next 7 Days)",
        liveMap: "Live Weather & Air Quality Map",
        date: "Date",
        avg: "Avg PM2.5",
        min: "Min",
        max: "Max",

        // Categories
        good: "Good",
        moderate: "Moderate",
        unhealthy: "Unhealthy",
        veryUnhealthy: "Very Unhealthy",
        hazardous: "Hazardous",
        extremeHazardous: "Extreme Hazardous",

        // Malaysia page
        malaysiaTitle: "Malaysia Air Quality — Live",
        nationalSummary: "National Summary",
        averageIPU: "Average IPU",
        worstAir: "Worst Air Quality",
        bestAir: "Best Air Quality",
        stationsReporting: "Stations Reporting",
        of12: "of 12",
        allStates: "All States",
        sortedByWorst: "Sorted by worst air quality first",
        dataUnavailable: "Data unavailable",

        // Analytics page
        analyticsTitle: "Analytics",
        currentStation: "Current Station",
        currentIPU: "Current IPU",
        pm25Trend: "PM2.5 — 7-Day Forecast Trend",
        pollutantBreakdown: "Pollutant Breakdown",
        hourlySnapshot: "Hourly Snapshot",

        // World Map page
        worldTitle: "World Air Quality Map",
        worldSubtitle: "Real-time air quality stations from around the world. Pan and zoom to explore.",
        stationsVisible: "Stations Visible",
        avgVisible: "Average IPU",
        worstVisible: "Worst Visible",
        bestVisible: "Best Visible",

        // About page
        aboutTitle: "About Putra Weather",
        aboutSubtitle: "Real-time air quality and weather information for Malaysia",
        whatIs: "What is Putra Weather?",
        whatIsDesc: "Putra Weather is a personal air quality and weather dashboard that provides real-time Air Pollutant Index (IPU) readings, PM2.5 concentrations, and current weather conditions for Malaysia and cities around the world. It uses official data from the Malaysian Department of Environment (JAS) via AQICN, and weather data from Open-Meteo.",
        dataSources: "Data Sources",
        sourceJAS: "JAS Malaysia (Department of Environment)",
        sourceJASDesc: "Official Air Pollutant Index (IPU) readings from Malaysian monitoring stations.",
        sourceAQICN: "AQICN (World Air Quality Index)",
        sourceAQICNDesc: "Global air quality data aggregator that provides access to JAS Malaysia's data.",
        sourceOpenMeteo: "Open-Meteo",
        sourceOpenMeteoDesc: "Free weather forecast and air quality forecast API used for current weather and 7-day PM2.5 predictions.",
        ipuCategories: "IPU Categories",
        ipuExplain: "The Air Pollutant Index (IPU) uses the following categories:",
        disclaimer: "Disclaimer",
        disclaimerDesc: "Putra Weather is a personal project and is NOT an official government tool. While we strive to display accurate real-time data from JAS Malaysia, this dashboard should not be used as the sole source for critical decisions. For official readings and health advisories, please refer to the Malaysian Department of Environment (JAS) website.",
        credits: "Credits",
        creditsDesc: "Built with care using vanilla JavaScript, Leaflet Maps, and Chart.js. Data provided by JAS Malaysia, AQICN, and Open-Meteo.",
        contact: "Contact",

        // Weather conditions
        clearSky: "Clear sky",
        partlyCloudy: "Partly cloudy",
        fog: "Fog",
        drizzleRain: "Drizzle / Rain",
        snow: "Snow",
        rainShowers: "Rain showers",
        thunderstorm: "Thunderstorm",
        overcast: "Overcast",
        clear: "Clear",

        // Buttons
        enableNotifications: "Enable notifications",
        toggleTheme: "Toggle dark/light mode"
    },

    ms: {
        // Nav
        dashboard: "Papan Pemuka",
        analytics: "Analitik",
        malaysia: "Malaysia",
        world: "Dunia",
        map: "Peta",
        about: "Tentang",
        forecast: "Ramalan",
        location: "Lokasi",

        // Dashboard
        pageTitle: "Cuaca & Kualiti Udara Langsung",
        currentWeather: "Cuaca Semasa",
        airPollutantIndex: "Indeks Pencemaran Udara (IPU)",
        station: "Stesen",
        status: "Status",
        mainPollutant: "Pencemar utama",
        temperature: "Suhu",
        humidity: "Kelembapan",
        wind: "Angin",
        condition: "Keadaan",
        lastUpdated: "Dikemas kini",
        dataSource: "Sumber data: JAS Malaysia (melalui AQICN)",
        hour24Trend: "Trend Kualiti Udara 24 Jam",
        pm25Forecast: "Ramalan PM2.5 (7 Hari Akan Datang)",
        liveMap: "Peta Cuaca & Kualiti Udara Langsung",
        date: "Tarikh",
        avg: "Purata PM2.5",
        min: "Min",
        max: "Maks",

        // Categories
        good: "Baik",
        moderate: "Sederhana",
        unhealthy: "Tidak Sihat",
        veryUnhealthy: "Sangat Tidak Sihat",
        hazardous: "Berbahaya",
        extremeHazardous: "Sangat Berbahaya",

        // Malaysia page
        malaysiaTitle: "Kualiti Udara Malaysia — Langsung",
        nationalSummary: "Ringkasan Kebangsaan",
        averageIPU: "Purata IPU",
        worstAir: "Kualiti Udara Terburuk",
        bestAir: "Kualiti Udara Terbaik",
        stationsReporting: "Stesen Melapor",
        of12: "daripada 12",
        allStates: "Semua Negeri",
        sortedByWorst: "Disusun mengikut kualiti udara terburuk",
        dataUnavailable: "Data tidak tersedia",

        // Analytics page
        analyticsTitle: "Analitik",
        currentStation: "Stesen Semasa",
        currentIPU: "IPU Semasa",
        pm25Trend: "PM2.5 — Trend Ramalan 7 Hari",
        pollutantBreakdown: "Pecahan Pencemar",
        hourlySnapshot: "Gambaran Setiap Jam",

        // World Map page
        worldTitle: "Peta Kualiti Udara Dunia",
        worldSubtitle: "Stesen kualiti udara masa nyata dari seluruh dunia. Geser dan zum untuk meneroka.",
        stationsVisible: "Stesen Dilihat",
        avgVisible: "Purata IPU",
        worstVisible: "Terburuk Dilihat",
        bestVisible: "Terbaik Dilihat",

        // About page
        aboutTitle: "Tentang Putra Weather",
        aboutSubtitle: "Maklumat kualiti udara dan cuaca masa nyata untuk Malaysia",
        whatIs: "Apakah Putra Weather?",
        whatIsDesc: "Putra Weather ialah papan pemuka kualiti udara dan cuaca peribadi yang menyediakan bacaan Indeks Pencemaran Udara (IPU) masa nyata, kepekatan PM2.5, dan keadaan cuaca semasa untuk Malaysia dan bandar-bandar di seluruh dunia. Ia menggunakan data rasmi daripada Jabatan Alam Sekitar Malaysia (JAS) melalui AQICN, dan data cuaca daripada Open-Meteo.",
        dataSources: "Sumber Data",
        sourceJAS: "JAS Malaysia (Jabatan Alam Sekitar)",
        sourceJASDesc: "Bacaan Indeks Pencemaran Udara (IPU) rasmi daripada stesen pemantauan Malaysia.",
        sourceAQICN: "AQICN (Indeks Kualiti Udara Dunia)",
        sourceAQICNDesc: "Agregator data kualiti udara global yang menyediakan akses kepada data JAS Malaysia.",
        sourceOpenMeteo: "Open-Meteo",
        sourceOpenMeteoDesc: "API ramalan cuaca dan kualiti udara percuma yang digunakan untuk cuaca semasa dan ramalan PM2.5 7 hari.",
        ipuCategories: "Kategori IPU",
        ipuExplain: "Indeks Pencemaran Udara (IPU) menggunakan kategori berikut:",
        disclaimer: "Penafian",
        disclaimerDesc: "Putra Weather adalah projek peribadi dan BUKAN alat kerajaan rasmi. Walaupun kami berusaha memaparkan data masa nyata yang tepat daripada JAS Malaysia, papan pemuka ini tidak boleh digunakan sebagai satu-satunya sumber untuk keputusan kritikal. Untuk bacaan rasmi dan nasihat kesihatan, sila rujuk laman web Jabatan Alam Sekitar Malaysia (JAS).",
        credits: "Kredit",
        creditsDesc: "Dibina dengan teliti menggunakan JavaScript asas, Leaflet Maps, dan Chart.js. Data disediakan oleh JAS Malaysia, AQICN, dan Open-Meteo.",
        contact: "Hubungi",

        // Weather conditions
        clearSky: "Langit cerah",
        partlyCloudy: "Sebahagian berawan",
        fog: "Kabus",
        drizzleRain: "Gerimis / Hujan",
        snow: "Salji",
        rainShowers: "Hujan renyai",
        thunderstorm: "Ribut petir",
        overcast: "Mendung",
        clear: "Cerah",

        // Buttons
        enableNotifications: "Aktifkan pemberitahuan",
        toggleTheme: "Tukar mod gelap/cerah"
    }
};

function getCurrentLang() {
    return localStorage.getItem('lang') || 'en';
}

function setLanguage(lang) {
    localStorage.setItem('lang', lang);
    applyTranslations();
}

function t(key) {
    const lang = getCurrentLang();
    return TRANSLATIONS[lang][key] || TRANSLATIONS.en[key] || key;
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        el.textContent = t(key);
    });

    const pageTitleKey = document.body.getAttribute('data-page-title');
    if (pageTitleKey) {
        document.title = t(pageTitleKey) + " — Putra Weather";
    }

    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        const lang = getCurrentLang();
        langBtn.textContent = lang === 'en' ? 'BM' : 'EN';
        langBtn.title = lang === 'en' ? 'Tukar ke Bahasa Malaysia' : 'Switch to English';
    }
}

function toggleLanguage() {
    const current = getCurrentLang();
    const next = current === 'en' ? 'ms' : 'en';
    setLanguage(next);

    if (typeof window.refreshAllContent === 'function') {
        window.refreshAllContent();
    }
}

window.addEventListener('DOMContentLoaded', () => {
    applyTranslations();

    const langBtn = document.getElementById('lang-toggle');
    if (langBtn) {
        langBtn.addEventListener('click', toggleLanguage);
    }
});

window.t = t;
window.getCurrentLang = getCurrentLang;
window.toggleLanguage = toggleLanguage;
window.applyTranslations = applyTranslations;