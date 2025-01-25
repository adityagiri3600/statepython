from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import sys
from io import StringIO

app = Flask(__name__, static_folder='../frontend/build', static_url_path='')
CORS(app)

@app.route('/')
@app.route('/<path:path>')
def serve_react(path='index.html'):
    try:
        return send_from_directory(app.static_folder, path)
    except Exception:
        return send_from_directory(app.static_folder, 'index.html')


@app.route('/run-python', methods=['POST'])
def run_python():
    variables = request.json.get('variables')
    python_code = request.json.get('code')
    original_stdout = sys.stdout
    sys.stdout = StringIO()  # Capture output

    # Execute the code and capture the output
    try:
        exec(python_code, globals(), variables)
    except Exception as e:
        sys.stdout = original_stdout  # Reset stdout in case of error
        return jsonify({"error": str(e)}), 400
    
    sys.stdout = original_stdout  # Reset stdout
    return jsonify(variables)

if __name__ == '__main__':
    app.run(debug=True)