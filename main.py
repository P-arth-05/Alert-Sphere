from fastapi import FastAPI
import json
import os

app = FastAPI()

@app.get("/disaster-data")
def get_disaster_data():
    data_files = ["usgs_earthquake_data.json", "gdacs_rss_feed.json", "reliefweb_data.json", "google_news_data.json"]
    combined_data = {}

    for file in data_files:
        file_path = os.path.join(os.path.dirname(__file__), file)
        if os.path.exists(file_path):
            with open(file_path, "r") as f:
                combined_data[file.replace(".json", "")] = json.load(f)
        else:
            combined_data[file.replace(".json", "")] = {}

    return combined_data

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
