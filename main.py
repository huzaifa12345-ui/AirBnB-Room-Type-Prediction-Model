from pathlib import Path
from typing import Dict

import joblib
import pandas as pd
from fastapi import FastAPI, HTTPException, Request
from fastapi.responses import HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from pydantic import BaseModel, Field

BASE_DIR = Path(__file__).resolve().parent
MODEL_PATH = BASE_DIR / "model_pipeline.pkl"

app = FastAPI(
    title="Airbnb Room Type Predictor",
    description="Predict an Airbnb listing's room type using a trained scikit-learn pipeline.",
    version="1.0.0",
)

app.mount("/static", StaticFiles(directory=BASE_DIR / "static"), name="static")
templates = Jinja2Templates(directory=BASE_DIR / "templates")

model = None
model_load_error = None

try:
    if MODEL_PATH.exists():
        model = joblib.load(MODEL_PATH)
    else:
        model_load_error = f"Model file not found at {MODEL_PATH}. Place model_pipeline.pkl beside main.py."
except Exception as exc:
    model_load_error = (
        "The model could not be loaded. Check that model_pipeline.pkl was created "
        "with a compatible scikit-learn version. Details: " + str(exc)
    )


class ListingInput(BaseModel):
    latitude: float = Field(..., ge=-90, le=90, description="Listing latitude")
    longitude: float = Field(..., ge=-180, le=180, description="Listing longitude")
    price: float = Field(..., ge=0, description="Nightly price in USD")
    minimum_nights: int = Field(..., ge=1, le=100000)
    number_of_reviews: int = Field(..., ge=0)
    reviews_per_month: float = Field(..., ge=0)
    calculated_host_listings_count: int = Field(..., ge=1)
    availability_365: int = Field(..., ge=0, le=365)
    neighbourhood_group: str = Field(..., min_length=1)
    neighbourhood: str = Field(..., min_length=1)


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse(
        request=request,
        name="index.html",
        context={"model_ready": model is not None},
    )


@app.get("/health")
async def health():
    return {
        "status": "ok" if model is not None else "model_not_ready",
        "model_loaded": model is not None,
        "detail": model_load_error,
    }


@app.post("/predict")
async def predict(listing: ListingInput) -> Dict:
    if model is None:
        raise HTTPException(
            status_code=503,
            detail=model_load_error or "The model is not available.",
        )

    # Column names and order match the training notebook's input features.
    input_df = pd.DataFrame([listing.model_dump()])
    try:
        prediction = model.predict(input_df)[0]
        result = {"prediction": str(prediction)}

        # Return class probabilities when supported by the trained classifier.
        if hasattr(model, "predict_proba"):
            probabilities = model.predict_proba(input_df)[0]
            classes = model.classes_
            result["probabilities"] = {
                str(label): round(float(prob), 4)
                for label, prob in zip(classes, probabilities)
            }

        return result
    except Exception as exc:
        raise HTTPException(
            status_code=500,
            detail=(
                "Prediction failed. Confirm that the saved pipeline was trained "
                "with the same feature columns used by this API. Details: " + str(exc)
            ),
        ) from exc
