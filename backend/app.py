from flask import Flask, jsonify, send_file, request
from flask_cors import CORS
from build_cache import build_cache
import json
import os

MEMORIES_FOLDER = '/path/to/your/memories/folder' #CHANGE THIS
HIGHSCORES_FILE = 'highscores.json'

app = Flask(__name__)
CORS(app)

@app.route('/cache')
def cache():

    build_cache()

    cache_file = os.path.join(os.path.dirname(__file__), 'cache.json')

    with open(cache_file) as f:
        data = json.load(f)

    return [
        {
            "path": path,
            "timestamp": info["timestamp"]
        }
        for path, info in data.items()
    ]

@app.route('/images')
def get_image():
    filepath = request.args.get("path")
    if not filepath or not os.path.exists(filepath):
        return "Image not found", 404
    return send_file(filepath)

@app.route('/highscores')
def get_score():
    try:
        with open('highscores.json') as f:
            highscores = json.load(f)
        return jsonify(highscores)
    except:
        return jsonify([])
    
@app.route('/highscores', methods=['POST'])
def write_score():
    data = request.get_json()
    with open('highscores.json', 'w') as f:
        json.dump(data, f)
    return jsonify({'success': True})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
