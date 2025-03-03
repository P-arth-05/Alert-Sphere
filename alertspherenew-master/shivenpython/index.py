from flask import Flask, jsonify
from flask_socketio import SocketIO
from flask_cors import CORS
import requests
from apscheduler.schedulers.background import BackgroundScheduler
import time
from datetime import datetime
from dateutil import parser
import pytz
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi_socketio import SocketManager

app = FastAPI()

# Allow all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
sio = SocketManager(app=app, cors_allowed_origins="*")

alldata = {"data":[]}

eventtodis={
    "DR":"drought",
    "FL":"flood",
    "EQ":"earthquake",
    "TC":"storm",
    "WF":"wildfire"
}

tzinfos = {'IST': +19800}  # 19800 seconds = 5 hours 30 minutes

def remove_duplicates(data_list):
    unique_data = []
    seen_entries = set()

    for entry in data_list:
        # Convert dictionary to a tuple of sorted key-value pairs (hashable)
        entry_tuple = tuple(sorted(entry.items()))

        if entry_tuple not in seen_entries:
            seen_entries.add(entry_tuple)
            unique_data.append(entry)

    return unique_data


def convert_time_format(time_str):
    # Parse the input time string with timezone information
    dt = parser.parse(time_str, tzinfos=tzinfos)
    
    # Convert to the desired format (ISO 8601)
    output_format = '%Y-%m-%dT%H:%M:%S'
    return dt.strftime(output_format)

def remove_ist_from_string(time_str):
    # Replace ' IST ' with an empty string
    return time_str.replace(' IST ', ' ')

def convert_ist_to_gmt(ist_time_str):
    # Define the format of the input IST time string without the time zone
    ist_format = "%a %b %d %H:%M:%S %Y"
    
    # Parse the IST time string into a datetime object (without timezone)
    ist_time = datetime.strptime(remove_ist_from_string(ist_time_str), ist_format)
    
    # Define the IST and GMT timezones
    ist_zone = pytz.timezone('Asia/Kolkata')
    gmt_zone = pytz.timezone('GMT')
    
    # Localize the time to IST
    ist_time = ist_zone.localize(ist_time)
    
    # Convert IST to GMT
    gmt_time = ist_time.astimezone(gmt_zone)
    
    # Format the GMT time to the desired format
    return gmt_time.strftime("%Y-%m-%dT%H:%M:%S")


async def emit_new_data():
    # Notify all connected clients that new data is available via SocketIO
    await sio.emit('new_data_available')

# Function to fetch data from multiple APIs
def fetch_data():
    global alldata
    try:
        # Replace these with actual API URLs
        api_1_url = "https://www.gdacs.org/gdacsapi/api/events/geteventlist/SEARCH"
        api_2_url = "https://sachet.ndma.gov.in/cap_public_website/FetchEarthquakeAlerts"
        api_3_url = "https://sachet.ndma.gov.in/cap_public_website/FetchIMDNowcastAlerts"


        response_1 = requests.get(api_1_url)
        response_2 = requests.get(api_2_url)
        # response_3 = requests.get(api_3_url)



        if response_1.status_code == 200 and response_2.status_code == 200:
            gdacs_data = response_1.json()
            sachet_eq_data = response_2.json()
            # sachet_data = response_3.json()
            newgdacsdata=[]
            
            for data in gdacs_data["features"]:
                d1={}
                d1["country"]=data["properties"]["affectedcountries"][0]["countryname"]
                d1["disaster"]=eventtodis[data["properties"]["eventtype"]]
                d1["date"] = data["properties"]["datemodified"]
                d1["alert"] = data["properties"]["alertscore"]
                d1["longitude"] = data["geometry"]["coordinates"][0]
                d1["latitude"] = data["geometry"]["coordinates"][1]
                if data["properties"]["eventtype"]=="EQ":
                    d1["magnitude"] = data["properties"]["severitydata"]["severity"]
                else:
                    d1["magnitude"] = ""
                is_duplicate = False

                # Compare against existing data
                for existing_alert in alldata["data"]:
                    if (existing_alert["longitude"] == d1["longitude"] and
                        existing_alert["latitude"] == d1["latitude"]):
                        is_duplicate = True
                        break

                # Add to the list if not a duplicate
                if not is_duplicate:
                    alldata["data"].append(d1)
                
            for data in sachet_eq_data["alerts"]:
                d1={}
                d1["country"] = data["direction"] if "," not in data["direction"] else "India"
                d1["disaster"]="earthquake"
                d1["date"]=convert_ist_to_gmt(data["effective_start_time"])
                d1["magnitude"]=data["magnitude"]
                d1["longitude"] = data["longitude"]
                d1["latitude"] = data["latitude"]
                for existing_alert in alldata["data"]:
                    if (existing_alert["longitude"] == d1["longitude"] and
                        existing_alert["latitude"] == d1["latitude"] and
                        existing_alert["disaster"] == d1["disaster"]):
                        is_duplicate = True
                        break

                # Add to the list if not a duplicate
                if not is_duplicate:
                    alldata["data"].append(d1)

            # for data in sachet_data["nowcastDetails"]:
            #     pass

            # Notify all connected clients that new data is available
            emit_new_data()
        else:
            print("Error fetching data.")
    except Exception as e:
        print(f"Error in fetch_data: {e}")

# Schedule periodic fetching (every 10 minutes)
scheduler = BackgroundScheduler()
scheduler.add_job(func=fetch_data, trigger="interval", minutes=10)
scheduler.start()

# # Serve data at this route
# @app.route('/fetchingdata', methods=['GET'])
# def serve_data():
#     return jsonify({"data":alldata["data"]})

# @app.route("/fetchnewdata", methods=['GET'])
# def idk():
#     fetch_data()
#     return {"status":"200"}

# # Start server
# if __name__ == '__main__':
#     fetch_data()
#     socketio.run(app)  # Run the app on port 5000
@app.get('/fetchingdata')
async def serve_data():
    return JSONResponse({"data": alldata["data"]})

# Fetch new data
@app.get("/fetchnewdata")
async def idk():
    fetch_data()
    return {"status": "200"}

@sio.on('connect')
async def handle_connect(sid, environ):
    print(f"Client connected: {sid}")
    await sio.emit('response', {'message': 'Connected'}, to=sid)

@sio.on('disconnect')
async def handle_disconnect(sid):
    print(f"Client disconnected: {sid}")

@sio.on('message')
async def handle_message(sid, data):
    print(f"Received message: {data} from {sid}")
    await sio.emit('response', {'message': f'Message received: {data}'}, to=sid)


# Run the server
if __name__ == '__main__':
    import uvicorn
    fetch_data()  # Initial data fetch
    uvicorn.run(app, host='0.0.0.0', port=5000)