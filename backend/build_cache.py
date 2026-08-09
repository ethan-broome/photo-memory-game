import os
import json
from PIL import Image
from datetime import datetime


MEMORIES_FOLDER = '/Users/ethanbroome/Ethan/Photos/SnapchatMemories'
CACHE_FILE = os.path.join(os.path.dirname(__file__), 'cache.json')

def get_timestamp(filepath):
    try: 
        img = Image.open(filepath)
        data = img._getexif()

        if data:
            timestamp = data.get(36867)
            if timestamp:
                return timestamp
    
    except:
        pass

    filename = os.path.basename(filepath)
    name = os.path.splitext(filename)[0]
    parts = name.split('-')
    unix_str = parts[-1]

    try:
        unix_int = int(unix_str)
        unix_ts = unix_int / 1000
        timestamp = datetime.fromtimestamp(unix_ts)
        if timestamp:
            return timestamp
    
    except:
        pass

    filemodified = datetime.fromtimestamp(os.path.getmtime(filepath))
    return filemodified

def build_cache():

    if os.path.exists(CACHE_FILE):
        with open(CACHE_FILE, 'r') as f:
            cache = json.load(f)
    else:
        cache = {}

    processed = 0

    for root, dirs, files in os.walk(MEMORIES_FOLDER):
        for filename in files:
            if not filename.lower().endswith(('.jpg', '.jpeg', '.png')):
                continue
            
            filepath = os.path.join(root, filename)

            modified = os.path.getmtime(filepath)

            if filepath in cache and cache[filepath]["modified"] == modified:
                continue

            timestamp = get_timestamp(filepath)

            if not timestamp:
                continue

            cache[filepath] = {
                "timestamp": str(timestamp),
                "modified": modified
            }

            processed += 1

    print("New photos processed:", processed)
    print("Total cached:", len(cache))
    with open(CACHE_FILE, 'w') as f:
        json.dump(cache, f)

if __name__ == '__main__':
    build_cache()