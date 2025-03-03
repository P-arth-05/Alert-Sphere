"use client";

import { Poppins } from "next/font/google";
import { useState } from "react";
const poppins = Poppins({
	weight: ["400", "500", "600", "700", "800", "900"],
	subsets: ["latin"],
});
export default function DangerousCountries({ data }) {
    const [timePeriod, setTimePeriod] = useState(1);
	const filterByDays = (days) => {
        const today = new Date();
        const cutoffDate = new Date(today);
        cutoffDate.setDate(today.getDate() - days);
    
        return data.filter(item => new Date(item.date) >= cutoffDate);
      };
    
      // Group disasters by country and count occurrences
      const groupByCountry = (filteredData) => {
        const countryCount = {};
    
        filteredData.forEach(item => {
          const country = item.country;
          if (!countryCount[country]) {
            countryCount[country] = 0;
          }
          countryCount[country]++;
        });
    
        return countryCount;
      };
    
      // Sort countries by number of disasters
      const sortCountriesByDisasters = (countryCount) => {
        return Object.entries(countryCount).sort(([,a], [,b]) => b - a);
      };
    
      // Calculate disasters based on selected timePeriod
      const getSortedCountries = () => {
        const filteredData = filterByDays(timePeriod);
        const countryCount = groupByCountry(filteredData);
        return sortCountriesByDisasters(countryCount);
      };
    
      const sortedCountries = getSortedCountries();
	return (
		<div className="mx-8 my-4 bg-gray-200 p-4 border-zinc-400 border rounded-xl">
			<h1 className={"text-5xl font-bold mb-2 " + poppins.className}>
				Most dangerous countries
			</h1>
			<h2 className={"text-4xl font-medium " + poppins.className}>
				Countries with most number of current disasters
			</h2>

			<select
				value={timePeriod}
				onChange={(e) => setTimePeriod(Number(e.target.value))}
                className="px-2 py-4 bg-[#cbd0d0] rounded-lg mr-4 font-bold mt-4"
			>
				<option value={1}>1 Day</option>
				<option value={7}>7 Days</option>
				<option value={30}>30 Days</option>
			</select>
            <div className="flex justify-between items-center py-4 px-4 bg-[#cbd0d0] rounded-lg mt-4 font-bold">
              <div className="w-1/3 text-center">S.No.</div>
              <div className="w-1/3 text-center">COUNTRY</div>
              <div className="w-1/3 text-center">No. of disasters</div>
            </div>
			<div>
				{sortedCountries.slice(0,6).map(([country, count], index) => (
					<div key={index} className="flex justify-between items-center py-4 px-4 border-b border-[#cbd0d0]">
						<div className="w-1/3 text-center">{index+1}</div>
                        <div className="w-1/3 text-center">{country}</div>
                        <div className="w-1/3 text-center">{count}</div>
					</div>
				))}
			</div>
		</div>
	);
}
