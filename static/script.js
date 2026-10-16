const form = document.getElementById("prediction-form");
const predictButton = document.getElementById("predict-button");
const emptyResult = document.getElementById("empty-result");
const predictionResult = document.getElementById("prediction-result");
const errorBox = document.getElementById("error-box");
const predictedLabel = document.getElementById("predicted-label");
const resultDescription = document.getElementById("result-description");
const probabilityList = document.getElementById("probability-list");
const topConfidence = document.getElementById("top-confidence");
const resetButton = document.getElementById("reset-button");

function prettyLabel(label) {
  return String(label).replaceAll("_", " ").replace(/\b\w/g, (char) => char.toUpperCase());
}

function showError(message) {
  errorBox.textContent = message;
  errorBox.classList.remove("hidden");
  predictionResult.classList.add("hidden");
}

function renderProbabilities(probabilities) {
  probabilityList.replaceChildren();
  if (!probabilities || Object.keys(probabilities).length === 0) {
    topConfidence.textContent = "Not available";
    return;
  }

  const entries = Object.entries(probabilities).sort((a, b) => b[1] - a[1]);
  topConfidence.textContent = `${(entries[0][1] * 100).toFixed(1)}% top estimate`;

  entries.forEach(([label, probability]) => {
    const row = document.createElement("div");
    row.className = "probability-row";

    const name = document.createElement("span");
    name.textContent = prettyLabel(label);

    const percent = document.createElement("strong");
    percent.textContent = `${(probability * 100).toFixed(1)}%`;

    const track = document.createElement("div");
    track.className = "probability-track";
    const fill = document.createElement("div");
    fill.className = "probability-fill";
    fill.style.width = `${Math.max(0, Math.min(100, probability * 100))}%`;
    track.appendChild(fill);

    row.append(name, percent, track);
    probabilityList.appendChild(row);
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  errorBox.classList.add("hidden");
  predictButton.disabled = true;
  predictButton.querySelector("span:first-child").textContent = "Predicting…";

  const formData = new FormData(form);
  const payload = {
    latitude: Number(formData.get("latitude")),
    longitude: Number(formData.get("longitude")),
    price: Number(formData.get("price")),
    minimum_nights: Number(formData.get("minimum_nights")),
    number_of_reviews: Number(formData.get("number_of_reviews")),
    reviews_per_month: Number(formData.get("reviews_per_month")),
    calculated_host_listings_count: Number(formData.get("calculated_host_listings_count")),
    availability_365: Number(formData.get("availability_365")),
    neighbourhood_group: String(formData.get("neighbourhood_group")).trim(),
    neighbourhood: String(formData.get("neighbourhood")).trim()
  };

  try {
    const response = await fetch("/predict", {
      method: "POST",
      headers: {"Content-Type": "application/json"},
      body: JSON.stringify(payload)
    });
    const data = await response.json();

    if (!response.ok) {
      const detail = typeof data.detail === "string" ? data.detail : "The prediction request failed.";
      throw new Error(detail);
    }

    predictedLabel.textContent = prettyLabel(data.prediction);
    resultDescription.textContent = "Your trained Random Forest pipeline classified this listing as:";
    renderProbabilities(data.probabilities);
    emptyResult.classList.add("hidden");
    predictionResult.classList.remove("hidden");
    errorBox.classList.add("hidden");
  } catch (error) {
    showError(error.message || "Could not connect to the prediction API. Is the FastAPI server running?");
  } finally {
    predictButton.disabled = false;
    predictButton.querySelector("span:first-child").textContent = "Predict room type";
  }
});

resetButton.addEventListener("click", () => {
  predictionResult.classList.add("hidden");
  emptyResult.classList.remove("hidden");
  errorBox.classList.add("hidden");
  form.scrollIntoView({behavior: "smooth", block: "start"});
});
