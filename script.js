const weightSlider = document.getElementById("weightSlider");
const weightInput = document.getElementById("weight");

weightSlider.addEventListener("input", () => {
  weightInput.value = weightSlider.value;
});
weightInput.addEventListener("input", () => {
  weightSlider.value = weightInput.value;
});

let chartInstance;

function calculateBMI() {
  const gender = document.getElementById("gender").value;
  const age = parseFloat(document.getElementById("age").value);
  const height = parseFloat(document.getElementById("height").value);
  let weight = parseFloat(document.getElementById("weight").value);
  const weightUnit = document.getElementById("weightUnit").value;

  if (!gender || isNaN(age) || isNaN(height) || isNaN(weight)) return;

  if (weightUnit === "lb") weight *= 0.453592;
  const heightM = height / 100;
  const bmi = weight / (heightM * heightM);
  const rounded = bmi.toFixed(2);

  let category = "";
  if (bmi < 18.5) category = "Underweight";
  else if (bmi < 25) category = "Normal";
  else if (bmi < 30) category = "Overweight";
  else category = "Obese";

  document.getElementById("bmiValue").textContent = `BMI = ${rounded} kg/m² (${category})`;
  document.getElementById("bmiCategory").textContent = `Category: ${category}`;
  document.getElementById("bmiDetails").innerHTML = `
    <strong>Healthy BMI range:</strong> 18.5 – 25 kg/m²<br>
    <strong>Healthy weight for your height:</strong> ${(18.5 * heightM * heightM).toFixed(1)} – ${(25 * heightM * heightM).toFixed(1)} kg<br>
    <strong>BMI Prime:</strong> ${(bmi / 25).toFixed(2)}<br>
    <strong>Ponderal Index:</strong> ${(bmi / Math.pow(heightM, 3)).toFixed(1)} kg/m³
  `;

  drawBMIPieGauge();
}

function drawBMIPieGauge() {
  const ctx = document.getElementById("bmiChart").getContext("2d");
  if (chartInstance) chartInstance.destroy();

  const labels = [
    { label: "Underweight", range: "10–18.5", value: 8.5 },
    { label: "Normal", range: "18.5–25", value: 6.5 },
    { label: "Overweight", range: "25–30", value: 5 },
    { label: "Obese", range: "30–40", value: 10 }
  ];

  const totalRange = 30;

  chartInstance = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels.map(l => l.label),
      datasets: [{
        data: labels.map(l => l.value),
        backgroundColor: ["#81d4fa", "#aed581", "#fff176", "#ef9a9a"],
        borderWidth: 1
      }]
    },
    options: {
      rotation: -0.5 * Math.PI,
      cutout: "70%",
      plugins: {
        tooltip: { enabled: false },
        legend: { display: false }
      }
    },
    plugins: [{
      id: "labelInside",
      afterDatasetDraw(chart) {
        const { ctx, chartArea: { width, height, top } } = chart;
        const cx = width / 2;
        const cy = top + height / 2;
        const radius = height / 2 - 80;
        let startAngle = -0.5 * Math.PI;

        labels.forEach((slice) => {
          const [start, end] = slice.range.split("–").map(Number);
          const rangeSpan = end - start;
          const sliceAngle = (rangeSpan / totalRange) * 2 * Math.PI;
          const midAngle = startAngle + sliceAngle / 2;

          const x = cx + radius * Math.cos(midAngle);
          const y = cy + radius * Math.sin(midAngle);

          ctx.fillStyle = "#1a2f57";
          ctx.font = "13px Segoe UI";
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";
          ctx.fillText(slice.range, x, y - 10);
          ctx.fillText(slice.label, x, y + 10);

          startAngle += sliceAngle;
        });
      }
    }]
  });
}
