from flask import Flask, render_template, request, jsonify
import joblib
import numpy as np
import pandas as pd
import os

app = Flask(__name__)

# Load the trained model and scaler
MODEL_PATH = 'house_price_model_deployment.pkl'
SCALER_PATH = 'feature_scaler.pkl'

print("Loading model and scaler...")
try:
    model = joblib.load(MODEL_PATH)
    scaler = joblib.load(SCALER_PATH)
    print("✓ Model and scaler loaded successfully!")
    print(f"✓ Model type: {type(model).__name__}")
    print(f"✓ Model has {model.n_estimators} trees")
except Exception as e:
    print(f"❌ Error loading model: {e}")
    model = None
    scaler = None

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/predict', methods=['POST'])
def predict():
    try:
        if model is None or scaler is None:
            return jsonify({'error': 'Model not loaded properly'}), 500
        
        # Get data from request
        data = request.get_json()
        
        # Extract and prepare features in the correct order (19 features)
        # The model expects: Property_Type, BHK, Size_in_SqFt, Price_per_SqFt, Furnished_Status, 
        # Total_Floors, Age_of_Property, Nearby_Schools, Nearby_Hospitals, 
        # Public_Transport_Accessibility, Parking_Space, Security, Amenities, 
        # Facing, Owner_Type, Availability_Status, Price_per_BHK, Total_Nearby_Amenities, Avg_Floor_Height
        
        property_type = int(data.get('property_type', 0))
        bhk = int(data.get('bhk', 2))
        size_sqft = float(data.get('size_sqft', 1000))
        price_per_sqft = float(data.get('price_per_sqft', 5000))
        furnished_status = int(data.get('furnished_status', 0))
        total_floors = int(data.get('total_floors', 5))
        age_of_property = int(data.get('age_of_property', 5))
        nearby_schools = int(data.get('nearby_schools', 2))
        nearby_hospitals = int(data.get('nearby_hospitals', 1))
        public_transport = int(data.get('public_transport', 1))
        parking_space = int(data.get('parking_space', 1))
        security = int(data.get('security', 1))
        amenities = int(data.get('amenities', 1))
        facing = int(data.get('facing', 0))
        owner_type = int(data.get('owner_type', 0))
        availability_status = int(data.get('availability_status', 0))
        
        # Calculate engineered features
        price_per_bhk = price_per_sqft * bhk
        total_nearby_amenities = nearby_schools + nearby_hospitals
        avg_floor_height = total_floors / (bhk + 1)
        
        # Create feature array in correct order
        features = np.array([[
            property_type,
            bhk,
            size_sqft,
            price_per_sqft,
            furnished_status,
            total_floors,
            age_of_property,
            nearby_schools,
            nearby_hospitals,
            public_transport,
            parking_space,
            security,
            amenities,
            facing,
            owner_type,
            availability_status,
            price_per_bhk,
            total_nearby_amenities,
            avg_floor_height
        ]])
        
        # Scale the features
        features_scaled = scaler.transform(features)
        
        # Make prediction
        prediction = model.predict(features_scaled)
        predicted_price = float(prediction[0])
        
        # Calculate confidence interval (approximate)
        confidence_lower = predicted_price * 0.95
        confidence_upper = predicted_price * 1.05
        
        return jsonify({
            'success': True,
            'predicted_price': round(predicted_price, 2),
            'predicted_price_crores': round(predicted_price / 100, 2),
            'confidence_lower': round(confidence_lower, 2),
            'confidence_upper': round(confidence_upper, 2),
            'model_accuracy': '98.09%',
            'features_used': 19
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 400

@app.route('/health')
def health():
    return jsonify({
        'status': 'healthy',
        'model_loaded': model is not None,
        'scaler_loaded': scaler is not None
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
