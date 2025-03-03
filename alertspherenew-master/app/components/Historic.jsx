"use client";

import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale,
} from "chart.js";
import { useState, useEffect } from "react";

import { Poppins } from 'next/font/google'

const poppins = Poppins({
  weight: ['400', '500', '600', '700','800','900'],
  subsets: ['latin'],
});


// Register necessary components with ChartJS
ChartJS.register(
  LineElement,
  PointElement,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  CategoryScale
);

const DisasterLineChart = () => {
  const [chartData, setChartData] = useState(null);
  const [country, setCountry] = useState("country");
  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };
  const [jsonData, setJsonData] = useState();
  
  const [countries, setCountries] = useState(["ALL"]);
  
  useEffect(() => {
    // Simulate fetching JSON data (replace with your API endpoint or file path)
    fetch("/api/historic-data")
    .then((response) => response.json())
    .then((json) => setJsonData(json.data)); // Assuming your JSON structure has a "data" array
  }, []);
  
  useEffect(() => {
    const disasterTypesToInclude = [
      "Drought",
      "Flood",
      "Earthquake",
      "Storm",
      "Volcanic Activity",
    ];
    const myFilterFunction = (data) => {
      const fdata =
        country === "ALL" || country === 'country'
          ? data
          : data.filter((item) => item.Country === country);
      const filteredDisasters = fdata.filter((item) =>
        disasterTypesToInclude.includes(item["Disaster Type"])
      );
  
      return filteredDisasters;
    };
    const disasterColors = {
      Drought: "#FFA07A", // Light Salmon
      Flood: "#00BFFF", // Deep Sky Blue
      Earthquake: "#FFD700", // Gold
      Storm: "#FF4500", // Orange Red
      "Volcanic Activity": "#8A2BE2", // Blue Violet
    };
    if (jsonData && country) {
      setCountries(['ALL', ...getUniqueValues(jsonData, "Country")])
      // Initialize an object to store disaster counts by year and disaster type
      let disasterCounts = {};
      myFilterFunction(jsonData).forEach((item) => {
        const Year = item["Year"];
        const disasterType = item["Disaster Type"];

        if (!disasterCounts[disasterType]) {
          disasterCounts[disasterType] = {};
        }

        if (!disasterCounts[disasterType][Year]) {
          disasterCounts[disasterType][Year] = 0;
        }

        disasterCounts[disasterType][Year] += 1;
      });

      // Prepare data for the chart
      const labels = Array.from(
        new Set(
          Object.values(disasterCounts).flatMap((typeCounts) =>
            Object.keys(typeCounts)
          )
        )
      ).sort();

      const datasets = Object.keys(disasterCounts).map((disasterType) => {
        const data = labels.map(
          (year) => disasterCounts[disasterType][year] || 0
        );

        return {
          label: disasterType,
          data,
          borderColor: disasterColors[disasterType], // Generate different colors for each line
          backgroundColor: disasterColors[disasterType],
          fill: true,
          tension: 0.3,
          pointRadius: 0,
        };
      });

      setChartData({
        labels,
        datasets,
      });
    }
  }, [jsonData, country]);

  

  const getUniqueValues = (array, index) => {
    const values = array.map((item) => item[index]);
    return Array.from(new Set(values));
  };

  return (
    <div className="px-4 mx-4">
    <h1 className={"text-5xl font-bold " + poppins.className}>Historic Data</h1>
      <label>
        <select value={country} onChange={handleCountryChange} className="px-2 py-4 bg-[#cbd0d0] rounded-lg mr-4 font-bold my-4">
          <option value='country' className="hidden" selected disabled>Country</option>
          {countries.map((c, index) => (
            <option key={index} value={c}>
              {c}
            </option>
          ))}
        </select>
      </label>
      <div className="h-[50vh] relative mx-4">
        {chartData && (
          <Line
            data={chartData}
            options={{
              scales: {
                x: {
                  grid: {
                    display: false,
                  },
                },
                y: {
                  grid: {
                    display: true,
                  },
                },
              },
              maintainAspectRatio: false,
              responsive: true,
              plugins: {
                legend: {
                  position: "right",
                  align: "start",
                },
                title: {
                  display: false,
                },
              },
            }}
          />
        )}
      </div>
    </div>
  );
};

export default DisasterLineChart;
