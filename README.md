# Indian House Price Predictor - Flask Deployment

A complete Flask web application for predicting Indian house prices using a trained Random Forest ML model with 98.23% accuracy.

## 🎯 Features

- **High Accuracy**: 98.23% R² score on test data
- **Real-time Predictions**: Instant price predictions based on property features
- **Interactive UI**: Modern, animated, and responsive design
- **19 Feature Analysis**: Comprehensive property evaluation
- **Confidence Intervals**: Provides price range estimates
- **Mobile Responsive**: Works seamlessly on all devices

## 📁 Project Structure

```
Indian_House_price_prediction/
│
├── app.py                              # Flask application
├── optimized_house_price_model.pkl    # Trained ML model
├── feature_scaler.pkl                 # Feature scaler
├── requirements.txt                    # Python dependencies
│
├── templates/
│   └── index.html                     # Main HTML template
│
└── static/
    ├── style.css                      # Styling with animations
    └── script.js                      # JavaScript for interactivity
```

## 🚀 Installation & Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Run the Application

```bash
python app.py
```

### 3. Access the App

Open your browser and navigate to:
```
http://localhost:5000
```

## 💡 How to Use

1. **Fill in Property Details**:
   - Basic details (Property Type, BHK, Size, etc.)
   - Property features (Age, Facing, Owner Type)
   - Amenities (Schools, Hospitals, Parking, etc.)

2. **Click "Predict Price"**:
   - The model analyzes all 19 features
   - Returns predicted price in Lakhs and Crores
   - Shows confidence interval

3. **View Results**:
   - See the estimated price
   - Check the confidence range
   - Model accuracy displayed

## 🎨 Features of the UI

- **Animated Background**: Dynamic floating circles
- **Interactive Forms**: Real-time validation and feedback
- **Smooth Animations**: Counter animations for price display
- **Confetti Effect**: Celebration animation on successful prediction
- **Responsive Design**: Works on desktop, tablet, and mobile
- **Keyboard Shortcuts**: 
  - `Ctrl/Cmd + Enter` to submit
  - `Esc` to reset results

## 🔧 Model Details

- **Algorithm**: Random Forest Regressor
- **Trees**: 200
- **Max Depth**: 30
- **Features**: 19 (including engineered features)
- **Training Samples**: 200,000
- **Test Accuracy**: 98.23%
- **RMSE**: ₹18.78 Lakhs
- **MAE**: ₹14.32 Lakhs

## 📊 Input Features

1. Property Type (Apartment/House/Villa/Penthouse)
2. BHK (Number of bedrooms)
3. Size in Square Feet
4. Price per Square Foot
5. Furnished Status
6. Total Floors
7. Age of Property
8. Nearby Schools
9. Nearby Hospitals
10. Public Transport Access
11. Parking Spaces
12. Security Level
13. Amenities Level
14. Facing Direction
15. Owner Type
16. Availability Status
17. Price per BHK (Auto-calculated)
18. Total Nearby Amenities (Auto-calculated)
19. Average Floor Height (Auto-calculated)

## 🌐 API Endpoints

### GET /
- Returns the main HTML page

### POST /predict
- Accepts JSON with property details
- Returns prediction with confidence interval

**Request Format**:
```json
{
    "property_type": 0,
    "bhk": 2,
    "size_sqft": 1000,
    "price_per_sqft": 5000,
    ...
}
```

**Response Format**:
```json
{
    "success": true,
    "predicted_price": 50.25,
    "predicted_price_crores": 0.50,
    "confidence_lower": 47.74,
    "confidence_upper": 52.76,
    "model_accuracy": "98.23%",
    "features_used": 19
}
```

### GET /health
- Health check endpoint
- Returns model loading status

## 🎯 Deployment Options

### Local Development
```bash
python app.py
```

### Production (with Gunicorn)
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

### Docker Deployment
Create a `Dockerfile`:
```dockerfile
FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

Build and run:
```bash
docker build -t house-price-predictor .
docker run -p 5000:5000 house-price-predictor
```

## 🔐 Security Considerations

- Input validation on both client and server side
- CORS protection (configure as needed)
- Rate limiting recommended for production
- Environment variables for sensitive configs

## 📱 Browser Compatibility

- ✅ Chrome/Edge (Latest)
- ✅ Firefox (Latest)
- ✅ Safari (Latest)
- ✅ Mobile browsers

## 🤝 Contributing

Contributions are welcome! Please ensure:
- Code follows PEP 8 standards
- All features are tested
- UI remains responsive

## 📄 License

This project is for educational and demonstration purposes.

## 👨‍💻 Developer

Data Science Programme - Machine Learning Project

## 🎉 Acknowledgments

- Random Forest algorithm from scikit-learn
- Flask web framework
- Font Awesome for icons
- Google Fonts (Poppins)

---

**Note**: Ensure both `optimized_house_price_model.pkl` and `feature_scaler.pkl` are in the project root directory before running the application.
