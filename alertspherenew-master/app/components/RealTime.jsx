"use client";
import dynamic from "next/dynamic";
import { useState, useEffect, useRef } from "react";
import World from "./Globe1";
import Globe2 from "./Globe2";

import { Poppins } from 'next/font/google'

const poppins = Poppins({
  weight: ['400', '500', '600', '700','800','900'],
  subsets: ['latin'],
});

export default function RealTime({ data }) {
  const [isMounted, setIsMounted] = useState(false);
  const [dimensions, setDimensions] = useState([0, 0]);
  const [disaster, setDisaster] = useState("disaster");
  const [country, setCountry] = useState("country");

  useEffect(() => {
    setDimensions([window.innerHeight / 2, 0]);
  }, []);

  const parseTime = (timeStr) => {
    return new Date(timeStr);
  };
  const filteredData = data["data"]
    .filter((item) => {
      return (
        (country === "ALL" || country==="country" || item.country === country) &&
        (disaster === "ALL" || disaster==="disaster" || item.disaster === disaster)
      );
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date))


  const Item = (data) => {
    return <div className="flex"></div>;
  };

  const getUniqueValues = (array, index) => {
    const values = array.map((item) => item[index]);
    return Array.from(new Set(values));
  };

  const countries = ["ALL", ...getUniqueValues(data["data"], "country")];
  const disasters = ["ALL", ...getUniqueValues(data["data"], "disaster")];



  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };

  const handleDisasterChange = (e) => {
    setDisaster(e.target.value);
  };

  const toSentenceCase = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  };

  return (
    <div className="mx-4 p-4 my-4 rounded-lg">
      <h1 className={"text-5xl font-bold " + poppins.className}>Real-Time Disasters</h1>
      <div className="flex gap-4 h-[80vh]">
        <div className="rounded-2xl overflow-hidden my-2 w-1/2">
          <Globe2 data={filteredData}/>
        </div>
        <div className="w-1/2 overflow-auto">
          <div className="sticky top-0 bg-white z-20">
            <label>
              <select value={country} onChange={handleCountryChange} className="px-2 py-4 bg-[#cbd0d0] rounded-lg mr-4 font-bold">
              <option value='country' disabled  className="hidden">Country</option>
                {countries.map((c, index) => (
                  <option key={index} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </label>
            <label>
              <select value={disaster} onChange={handleDisasterChange} className="px-2 py-4 bg-[#cbd0d0] rounded-lg mr-4 font-bold">
              <option value='disaster' disabled className="hidden">Disaster</option>
                {disasters.map((d, index) => (
                  <option key={index} value={d}>
                    {toSentenceCase(d)}
                  </option>
                ))}
              </select>
            </label>
            <div className="flex justify-between items-center py-4 px-4 bg-[#cbd0d0] rounded-lg mt-4 font-bold">
              <div className="w-1/3 text-center">COUNTRY</div>
              <div className="w-1/3 text-center">DISASTER</div>
              <div className="w-1/3 text-center">TIME</div>
            </div>
          </div>
          <div>
            
            {filteredData.map((item, index) => {
              let bgColorClass = '';

              if (item.alert) {
                // Background color based on alert value
                bgColorClass = item.alert === 2 ? 'bg-orange-300' : item.alert === 3 ? 'bg-red-500' : '';
              } else {
                // Background color based on magnitude
                if (item.magnitude > 6) {
                  bgColorClass = 'bg-red-500';
                } else if (item.magnitude > 4) {
                  bgColorClass = 'bg-orange-300';
                } else {
                  bgColorClass = 'bg-yellow-300'
                }
              }
             return <div key={index} className={`flex justify-between items-center my-2 py-4 px-4 ${bgColorClass} rounded-xl`}>
              <div className="w-1/3 text-center">{item.country}</div>
              <div className="w-1/3 text-center">{toSentenceCase(item.disaster)} {item.magnitude}</div>
              <div className="w-1/3 text-center">{item.date}</div>
              
            </div>}
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
