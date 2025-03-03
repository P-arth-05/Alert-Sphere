import Image from "next/image";
import Navbar from "./components/Navbar";
import RealTime from "./components/RealTime";
import DangerousCountries from "./components/DangerousCountries";
import DisasterLineChart from "./components/Historic";
import Predicted from "./components/Predicted";
import Emergency from "./components/Emergency";
import predictedData from "@/app/api/predictedData.json"


export default async function Home() {
//   const data = [
//     ["BRAZIL", "FLOOD", "16:37"],
//     ["INDIA", "EARTHQUAKE", "8:37"],
//     ["BRAZIL", "FLOOD", "16:37"],
//     ["BRAZIL", "FLOOD", "5:37"],
//     ["BRAZIL", "FLOOD", "4:37"],
//     ["BRAZIL", "FLOOD", "0:37"],
//     ["BRAZIL", "FLOOD", "5:33"],
// ];

const idata = await fetch("http://127.0.0.1:5000/fetchingdata",{
  method:'GET',
  cache: 'no-store'
});
const data = await idata.json()
const predicteddata = predictedData


const contacts ={
  "countries": {
    "India": [
      {
        "id": 1,
        "number": "990000000",
        "authority": "Fire Brigade"
      },
      {
        "id": 2,
        "number": "999000000",
        "authority": "Flood Rescue Team"
      },
      {
        "id": 3,
        "number": "999900000",
        "authority": "Earthquake Management Team"
      }
    ],
    "USA": [
      {
        "id": 1,
        "number": "911",
        "authority": "Emergency Services"
      },
      {
        "id": 2,
        "number": "999000000",
        "authority": "Flood Rescue Team"
      }
    ],
    "Japan": [
      {
        "id": 1,
        "number": "110",
        "authority": "Police"
      },
      {
        "id": 2,
        "number": "119",
        "authority": "Fire Brigade and Ambulance"
      }
    ]
  }
}


  return (
    <>
      <Navbar />
      <section id="realtime">
        <RealTime data={data} />
      </section>
      <section id="predicted">
        <Predicted data={predicteddata}/>
      </section>
      <DangerousCountries data={data["data"]} />
      <DisasterLineChart />
      <section id="emergency">
        <Emergency contacts={contacts} />
      </section>
      <footer className="text-center py-6">© 2024 AlertSphere. All rights reserved.</footer>
    </>
  );
}
