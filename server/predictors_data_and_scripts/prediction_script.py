import sys
import json
import pandas as pd
import pickle
import os

# Load the datasets based on environment variable
DATA_PATH = os.environ["PREDICTORS_DATA_PATH"]
lysis_recipes_data = pd.read_csv(os.path.join(DATA_PATH, "lysis_recipes.csv"))
wash1_recipes_data = pd.read_csv(os.path.join(DATA_PATH, "wash1_recipes.csv"))
wash2_recipes_data = pd.read_csv(os.path.join(DATA_PATH, "wash2_recipes.csv"))

def preprocess_data(data):
    # Remove leading/trailing whitespaces and make lowercase
    data = data.applymap(lambda x: x.strip().lower() if isinstance(x, str) else x)
    # Also strip white spaces and lower case column headers
    data.rename(columns=lambda x: x.strip().lower(), inplace=True)
    return data

def preprocess_input_data(input_data):
    # Convert the input data (JSON format) into a DataFrame
    experiments_data = pd.DataFrame([input_data])
    
    # Preprocess the data
    experiments_data = preprocess_data(experiments_data)
    
    # Check if versions in experiments_data are available in the recipe dataframes
    experiments_data['lysis version available in recipe table'] = experiments_data['lysis'].isin(lysis_recipes_data['version'])
    experiments_data['wash1 version available in recipe table'] = experiments_data['wash1'].isin(wash1_recipes_data['version'])
    experiments_data['wash2 version available in recipe table'] = experiments_data['wash2'].isin(wash2_recipes_data['version'])
    experiments_data = experiments_data[
        (experiments_data['lysis version available in recipe table']) &
        (experiments_data['wash1 version available in recipe table']) &
        (experiments_data['wash2 version available in recipe table'])
    ]
    
    # Drop the helper columns used to check availability
    experiments_data.drop(columns=['lysis version available in recipe table',
                                   'wash1 version available in recipe table',
                                   'wash2 version available in recipe table'], inplace=True)
    
    # Drop rows with missing values in the specified columns
    experiments_data = experiments_data.dropna(subset=['cq', 'date', 'target_name', 'sample_type', 'target_type'])
    
    # Replacing missing values with the provided default values
    default_values = {
        'lysis_temp': 25,
        'elution_temp': 25,
        'concentration': 30,
        'pretreatment_heating': 'no',
        'bead_beating': 'no',
        'pretreatment_buffer': 'n/a',
        'sample_name': 'n/a',
        'bead_conc_mg_ml': 30,
        'elution': 'h2o',
        'sample_volume': 200,
    }
    for column, default_value in default_values.items():
        experiments_data[column].fillna(default_value, inplace=True)
    
    # Merge experiments_data with recipe data
    combined_data = pd.merge(experiments_data, lysis_recipes_data, how='inner', left_on='lysis', right_on='version')
    combined_data = pd.merge(combined_data, wash1_recipes_data, how='inner', left_on='wash1', right_on='version')
    combined_data = pd.merge(combined_data, wash2_recipes_data, how='inner', left_on='wash2', right_on='version')
    combined_data = combined_data.drop(columns_to_drop_from_combined_data, axis=1)

    # One-hot encode specified categorical columns
    combined_data_encoded = pd.get_dummies(combined_data, columns=['beads', 'elution', 'target_name', 'target_type', 'sample_type',
                                                                    'sample_name', 'pretreatment_buffer', 'pretreatment_heating', 'bead_beating'])
    
    return combined_data_encoded

# Load the trained model from disk
model_path = os.path.join(DATA_PATH, "trained_model.pkl")
with open(model_path, "rb") as model_file:
    model = pickle.load(model_file)

# Get the input data passed from the Express server
input_data_json = sys.argv[1]
input_data = json.loads(input_data_json)

# Preprocess the input data
preprocessed_data = preprocess_input_data(input_data)

# Make prediction
prediction = model.predict(preprocessed_data)

# Print the prediction result (to be captured by Express server)
print(prediction[0])
