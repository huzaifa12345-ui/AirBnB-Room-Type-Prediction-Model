# Airbnb Room Type Predictor 🏠

A machine learning web application that predicts the room type of an Airbnb listing using listing details such as location, price, minimum nights, reviews, and availability.

The project uses a trained **Random Forest Classifier** with a Scikit-learn preprocessing pipeline, a **FastAPI backend**, and a responsive frontend built with HTML, CSS, and JavaScript.

## ✨ Features

- Predict Airbnb room types from listing information.
- Machine learning pipeline with preprocessing and classification.
- Random Forest model with balanced class weights.
- Hyperparameter tuning using `RandomizedSearchCV`.
- Cross-validation using accuracy and macro F1-score.
- Interactive web interface for entering listing details.
- Prediction probabilities for available classes.
- FastAPI endpoints with automatic API documentation.
- Responsive interface for desktop and mobile screens.

## 🛠️ Technologies Used

- **Language:** Python
- **Machine Learning:** Scikit-learn
- **Data Processing:** Pandas, NumPy
- **Data Visualization:** Matplotlib, Seaborn
- **Backend:** FastAPI, Uvicorn
- **Frontend:** HTML, CSS, JavaScript
- **Model Serialization:** Joblib
- **Dataset:** AB_NYC_2019.csv

## 📊 Dataset

This project uses the AB_NYC_2019 dataset containing New York City Airbnb listing information.

The target variable is `room_type`, which includes categories such as:

- Entire home/apt
- Private room
- Shared room

The model uses features including latitude, longitude, price, minimum nights, number of reviews, reviews per month, host listing count, availability, neighbourhood group, and neighbourhood.

## ⚙️ Machine Learning Workflow

1. Load and explore the dataset.
2. Analyze missing values, distributions, class balance, and correlations.
3. Clean data and handle missing review counts.
4. Cap extreme values for price and minimum nights.
5. Split the data into training and testing sets using stratification.
6. Preprocess numerical and categorical features with Scikit-learn pipelines.
7. Compare Logistic Regression, Decision Tree, Random Forest, and Gradient Boosting.
8. Tune Random Forest hyperparameters with `RandomizedSearchCV`.
9. Evaluate the selected model on the held-out test set.
10. Save the complete trained pipeline as `model_pipeline.pkl`.
11. Serve predictions through FastAPI and a web interface.

## 📁 Project Structure

```text
airbnb-room-type-predictor/
├── main.py
├── model_pipeline.pkl
├── requirements.txt
├── AB_NYC_2019.csv
├── new_york_air_bnb.ipynb
├── templates/
│   └── index.html
└── static/
    ├── style.css
    └── script.js
```

Your actual repository may contain additional files. Do not upload virtual environments such as `.venv/` or `.venv-1/`.

## 🚀 Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/YOUR-USERNAME/airbnb-room-type-predictor.git
cd airbnb-room-type-predictor
```

Replace `YOUR-USERNAME` with your GitHub username.

### 2. Create a virtual environment

Windows PowerShell:

```powershell
py -m venv .venv
.\.venv\Scripts\Activate.ps1
```

### 3. Install dependencies

```bash
python -m pip install --upgrade pip
pip install -r requirements.txt
```

### 4. Run the application

```bash
uvicorn main:app --reload
```

Open the application at:

http://127.0.0.1:8000

Interactive API documentation:

http://127.0.0.1:8000/docs

Health check:

http://127.0.0.1:8000/health

## 📈 Evaluation

The project uses:

- Accuracy
- Macro F1-score
- Confusion matrix
- Three-fold cross-validation
- Randomized hyperparameter search

Add your actual best cross-validation and test scores here after running the notebook. Do not report estimated results as measured results.

## ⚠️ Important Notes

- The saved model pipeline must be compatible with the installed Scikit-learn version.
- The API expects the same feature names used during training.
- This is an educational project based on historical Airbnb listing data. Predictions are estimates and are not guaranteed to be accurate.
- This project is not affiliated with Airbnb.

## 👨‍💻 Author

**Huzaifa Ikram**

Computer Science Student | Machine Learning | Python | Web Development

GitHub: https://github.com/huzaifa12345-ui

Portfolio: https://huzaifaikram.online

## 📄 License

If you choose the MIT License, include a `LICENSE` file containing the standard MIT license text and your copyright year and name. Also check the dataset's original license and terms before redistributing the dataset or model.

---

If you find this project useful, consider giving the repository a ⭐ on GitHub.
