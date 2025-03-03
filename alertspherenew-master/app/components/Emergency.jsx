"use client";
import { Poppins } from 'next/font/google'
import { useState } from 'react';
const poppins = Poppins({
  weight: ['400', '500', '600', '700','800','900'],
  subsets: ['latin'],
});


export default function Emergency({contacts}){
    const [country, setCountry] = useState("India");
    const handleCountryChange = (e) => {
        setCountry(e.target.value);
      };
      
    return (
        <div className='px-4 mt-4 mx-4'>
            <h1 className={"text-5xl font-bold mb-4 " + poppins.className}>Emergency contacts</h1>
            <label>
              <select value={country} onChange={handleCountryChange} className="px-2 py-4 bg-[#cbd0d0] rounded-lg mr-4 font-bold">
              <option value='country' disabled  className="hidden">Country</option>
              {Object.keys(contacts.countries).map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
              </select>
            </label>

            <div className="flex justify-between items-center py-4 px-4 bg-[#cbd0d0] rounded-lg mt-4 font-bold">
              <div className="w-1/3 text-center">S.No.</div>
              <div className="w-1/3 text-center">NUMBER</div>
              <div className="w-1/3 text-center">AUTHORITY</div>
            </div>
            {contacts.countries[country].map((contact, index) => (
            <div key={index} className="flex justify-between items-center py-4 px-4 border-b border-[#cbd0d0]">
              <div className='w-1/3 text-center'>{contact.id}</div>
              <div className='w-1/3 text-center'>{contact.number}</div>
              <div className='w-1/3 text-center'>{contact.authority}</div>
            </div>
          ))}
        </div>
    )
}