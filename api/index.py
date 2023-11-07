from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin
import json

# Define the path to your JSON file
JSON_FILE_PATH = 'data.json'

app = Flask(__name__)
CORS(app)

app.config['CORS_ALLOWED_ORIGINS'] = ['http://localhost:3000', 'http://localhost:3001']

@app.route("/api/tax", methods=['POST'])
@cross_origin()
def calculate_tax():
    if request.is_json:
        try:
            data = request.get_json()
            suma = data.get('suma')
            if suma is not None:
                suma = float(suma)
                if suma <= 500 and suma > 20:
                    suma = suma * 8 / 100
                elif 501 <= suma <= 5000:
                    suma = 40 + suma * 7 / 100
                elif 5001 <= suma <= 25000:
                    suma = 355 + suma * 5 / 100
                elif 25001 <= suma <= 50000:
                    suma = 1355 + suma * 3 / 100
                elif 50001 <= suma <= 250000:
                    suma = 2105 + suma * 2 / 100
                elif 250000 <= suma:
                    suma = 6105 + suma / 100

                response_data = {"suma": suma}
                print(response_data)
                return jsonify(response_data)
            else:
                return "The 'suma' field is missing in the JSON data", 400
        except Exception as e:
            return f"Error parsing JSON data: {str(e)}", 400
    else:
        return "Invalid JSON data in the request", 400

@app.route("/api/save-json", methods=['POST'])
@cross_origin()
def save_json():
    if request.is_json:
        try:
            data = request.get_json()

            # Read the existing data from the file
            existing_data = []
            try:
                with open(JSON_FILE_PATH, 'r') as json_file:
                    existing_data = json.load(json_file)
            except FileNotFoundError:
                existing_data = []

            # Append the new data to the existing data
            existing_data.append(data)

            # Write the entire list of data back to the file as a JSON array
            with open(JSON_FILE_PATH, 'w') as json_file:
                json_file.write(json.dumps(existing_data, indent=2))

            return "JSON data saved successfully", 200
        except Exception as e:
            return f"Error saving JSON data: {str(e)}", 500
    else:
        return "Invalid JSON data in the request", 400


if __name__ == "__main__":
    app.run(debug=True)
