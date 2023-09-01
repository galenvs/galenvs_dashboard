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
    df = pd.DataFrame([input_data])
    
    # Preprocess the tables
    preprocessed_experiments_data = preprocess_data(df)
    preprocessed_lysis_recipes_data = preprocess_data(lysis_recipes_data)
    preprocessed_wash1_recipes_data = preprocess_data(wash1_recipes_data)
    preprocessed_wash2_recipes_data = preprocess_data(wash2_recipes_data)

    # Combine the data
    combined_data = pd.merge(preprocessed_experiments_data, preprocessed_lysis_recipes_data, how='inner', left_on='lysis', right_on='version')
    combined_data = pd.merge(combined_data, preprocessed_wash1_recipes_data, how='inner', left_on='wash1', right_on='version')
    combined_data = pd.merge(combined_data, preprocessed_wash2_recipes_data, how='inner', left_on='wash2', right_on='version')

    # Drop unnecessary columns
    columns_to_drop_from_combined_data = ['wash1','wash2','lysis', 'version_x' , 'version_y' , 'version']
    combined_data = combined_data.drop(columns_to_drop_from_combined_data, axis=1)
    
    return combined_data

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
