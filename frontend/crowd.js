const API_BASE = "http://127.0.0.1:5000";

async function analyzeCrowd() {
  const fileInput = document.getElementById("crowdImage");
  const resultDiv = document.getElementById("crowdResult");

  resultDiv.classList.remove("hidden");

  if (!fileInput.files.length) {
    resultDiv.innerHTML = "<p>Please upload an image.</p>";
    return;
  }

  const formData = new FormData();
  formData.append("image", fileInput.files[0]);

  resultDiv.innerHTML = "<p>Analyzing crowd...</p>";

  try {
    const res = await fetch(`${API_BASE}/predict_crowd`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (data.error) {
      resultDiv.innerHTML = `<p>Error: ${data.error}</p>`;
      return;
    }

    let color;

    if (data.risk === "Safe") color = "#22c55e";
    else if (data.risk === "Packed") color = "#facc15";
    else color = "#ef4444";

    resultDiv.innerHTML = `
      <div class="status-header" style="background:${color}20; color:${color}">
        <h3>${data.risk} Crowd Level</h3>
        <p>
          ${
            data.risk === "Safe"
              ? "Area is safe with normal crowd levels."
              : data.risk === "Packed"
              ? "Crowd is getting dense. Stay alert."
              : "High risk of stampede. Avoid area!"
          }
        </p>
      </div>

      <div class="info-grid">
        <div class="info-box">
          <strong>People Count</strong><br>${data.people_count}
        </div>

        <div class="info-box">
          <strong>Density</strong><br>${data.density} /m²
        </div>
      </div>
    `;
  } catch (err) {
    resultDiv.innerHTML = "<p>Server not responding.</p>";
  }
}