const API_BASE = "http://127.0.0.1:5000";

let map, routeLayer;
let heatLayer;

document.addEventListener("DOMContentLoaded", () => {
  loadLocations();
  initMap();
});

/* ---------- LOAD LOCATIONS ---------- */
async function loadLocations() {
  const start = document.getElementById("start");
  const end = document.getElementById("end");

  const res = await fetch(`${API_BASE}/locations`);
  const locations = await res.json();

  locations.forEach(loc => {
    start.add(new Option(loc.name, loc.id));
    end.add(new Option(loc.name, loc.id));
  });
}

/* ---------- MAP ---------- */
function initMap() {
  map = L.map("map").setView([28.6139, 77.2090], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap"
  }).addTo(map);

  routeLayer = L.layerGroup().addTo(map);

  addCrimeHeatmap();
}

/* ---------- CRIME HEATMAP ---------- */
function addCrimeHeatmap() {
  const crimeHeatData = [
    [28.6315, 77.2167, 0.6],
    [28.6328, 77.2197, 0.5],
    [28.6506, 77.2303, 0.9],
    [28.6430, 77.2147, 0.85],
    [28.6517, 77.1900, 0.6],
    [28.5677, 77.2433, 0.4],
    [28.5494, 77.2001, 0.3],
    [28.5483, 77.2390, 0.35],
    [28.7148, 77.1917, 0.25],
    [28.6304, 77.2773, 0.55],
    [28.6091, 77.2957, 0.45]
  ];

  heatLayer = L.heatLayer(crimeHeatData, {
    radius: 30,
    blur: 25,
    maxZoom: 14,
    gradient: {
      0.2: "#22c55e",
      0.5: "#facc15",
      0.8: "#ef4444"
    }
  }).addTo(map);
}

/* ---------- FIND ROUTE ---------- */
async function findRoute() {
  const start = document.getElementById("start").value;
  const end = document.getElementById("end").value;
  const time = document.getElementById("time").value;
  const resultDiv = document.getElementById("result");

  resultDiv.classList.remove("hidden");

  if (!start || !end || start === end) {
    resultDiv.innerHTML = `
      <h3>⚠️ Invalid Selection</h3>
      <p>Select two different locations.</p>
    `;
    return;
  }

  const res = await fetch(`${API_BASE}/get_route`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ start: Number(start), end: Number(end) })
  });

  const data = await res.json();
  const risk = data.total_risk;

  let safety, color, explanation, reasons, confidence, headingClass, heading;

  if (risk < 4800) {
    safety = "Safe";
    color = "#22c55e";
    confidence = 85;
    headingClass = "safe";
    heading = "✅ Recommended Safe Route";
    explanation = "This route is highly safe and passes through low-risk zones.";
    reasons = [
      "Low crime exposure",
      "Good lighting conditions",
      "Stable pedestrian activity"
    ];
  } else if (risk < 6000) {
    safety = "Moderately Safe";
    color = "#facc15";
    confidence = 60;
    headingClass = "moderately";
    heading = "⚠️ Caution Advised";
    explanation = "The route avoids major risk zones but still requires awareness.";
    reasons = [
      "Moderate crime exposure",
      "Mixed lighting conditions",
      "Variable crowd density"
    ];
  } else {
    safety = "High Risk";
    color = "#ef4444";
    confidence = 30;
    headingClass = "high";
    heading = "❌ Unsafe Route Warning";
    explanation = "This route contains multiple high-risk segments.";
    reasons = [
      "High crime exposure",
      "Poor lighting in several areas",
      "Unpredictable crowd patterns"
    ];
  }

  resultDiv.innerHTML = `
    <div class="status-header ${headingClass}">
      <h3>${heading}</h3>
      <p>${explanation}</p>
    </div>

    <div class="info-grid">
      <div class="info-box"><strong>Safety Level</strong><br>${safety}</div>
      <div class="info-box"><strong>Confidence</strong><br>${confidence}%</div>
      <div class="info-box"><strong>Time</strong><br>${time}</div>
    </div>

    <div class="confidence-bar">
      <div class="confidence-fill"
     style="--confidence-width:${confidence}%; background:${color}">
      </div>
    </div>

    <h4>Why this route?</h4>
    <ul class="reason-list">
      ${reasons.map(r => `<li>✔️ ${r}</li>`).join("")}
    </ul>

    <p><strong>Total Risk Score:</strong> ${risk}</p>
  `;

  document.querySelector(".map-card").scrollIntoView({ behavior: "smooth" });

  drawOSRMRoute(
    data.route_coords,
    color,
    data.route_names[0],
    data.route_names[data.route_names.length - 1]
  );
}

/* ---------- OSRM REAL DRIVING ROUTE ---------- */
async function drawOSRMRoute(routeCoords, color, startName, endName) {
  routeLayer.clearLayers();

  if (!routeCoords || routeCoords.length < 2) return;

  const start = routeCoords[0];
  const end = routeCoords[routeCoords.length - 1];

  const osrmURL =
    `https://router.project-osrm.org/route/v1/driving/` +
    `${start[1]},${start[0]};${end[1]},${end[0]}` +
    `?overview=full&geometries=geojson`;

  const response = await fetch(osrmURL);
  const osrmData = await response.json();

  if (!osrmData.routes || osrmData.routes.length === 0) return;

  const route = osrmData.routes[0].geometry.coordinates.map(c => [c[1], c[0]]);

  const polyline = L.polyline(route, {
    color: color,
    weight: 6,
    opacity: 0.9
  }).addTo(routeLayer);

  L.marker(route[0])
    .addTo(routeLayer)
    .bindPopup(`Start: ${startName}`);

  L.marker(route[route.length - 1])
    .addTo(routeLayer)
    .bindPopup(`End: ${endName}`);

  map.fitBounds(polyline.getBounds(), { padding: [40, 40] });
}

/* ---------- EXPAND MAP ---------- */
function toggleMapSize() {
  const mapDiv = document.getElementById("map");
  mapDiv.classList.toggle("expanded");

  setTimeout(() => {
    map.invalidateSize();
  }, 300);
}
