"use client";
import './safety.css';
import { useRef, useState, useEffect } from 'react';
import { Poppins } from 'next/font/google';
import Link from 'next/link';
const poppins = Poppins({
    weight: ['400', '500', '600', '700','800','900'],
    subsets: ['latin'],
  });

export default function Home(){
    const readAloudBtnRef = useRef(null);
    const mainRef = useRef(null);
  
    useEffect(() => {
      const readAloudBtn = readAloudBtnRef.current;
      const mainContent = mainRef.current;
  
      if (readAloudBtn && mainContent) {
        const handleClick = () => {
          const textContent = mainContent.innerText;
  
          const utterance = new SpeechSynthesisUtterance(textContent);
  
          // Function to get the desired voice
          const getVoice = () => {
            const voices = speechSynthesis.getVoices();
            return voices.find(voice => voice.lang === 'en-GB' && voice.name.includes('female'));
          };
  
          // Set voice properties
          speechSynthesis.onvoiceschanged = () => {
            const selectedVoice = getVoice();
            if (selectedVoice) {
              utterance.voice = selectedVoice;
              utterance.pitch = 1;
              utterance.rate = 1;
              speechSynthesis.speak(utterance);
            } else {
              console.error("Female Indian voice not found.");
            }
          };
  
          // Trigger voiceschanged event in case voices are not yet loaded
          if (!speechSynthesis.getVoices().length) {
            speechSynthesis.getVoices();
          }
        };
  
        readAloudBtn.addEventListener('click', handleClick);
  
        return () => {
          readAloudBtn.removeEventListener('click', handleClick);
        };
      }
    }, []);


    return <div className='body'>
    <header>

    <Link href="/" className="font-bold text-3xl">
      ALERT-SPHERE
    </Link>
        <button ref={readAloudBtnRef} id="readAloudBtn">Read Aloud</button>
    </header>

    <main>
        <div className={"content " + poppins.className}>
            

            <h2 className="heading2">Earthquake Precautions</h2>
            <ul className="precautions-list">
                <li>Drop, Cover, and Hold On: During shaking, drop to your hands and knees, cover your head and neck under a sturdy piece of furniture, and hold on until the shaking stops.</li>
                <li>Secure Heavy Objects: Bolt down heavy furniture and secure items that could fall, such as TVs, mirrors, and picture frames.</li>
                <li>Know Safe Spots: Identify safe spots in each room, such as under a sturdy table or against an interior wall away from windows.</li>
                <li>Prepare an Emergency Kit: Include water, food, medications, first aid supplies, flashlight, batteries, and important documents.</li>
                <li>Create a Family Plan: Develop a plan for communication and meeting points in case family members are separated.</li>
                <li>Stay Away from Windows: Glass can shatter during an earthquake, causing injuries.</li>
                <li>Turn Off Utilities: Know how to turn off gas, water, and electricity in case of leaks or electrical hazards.</li>
            </ul>


            <h2 className="heading2">Forest Fire Precautions</h2>
            <ul className="precautions-list">
                <li>Create a Defensible Space: Clear flammable vegetation around your home to create a buffer zone.</li>
                <li>Prepare an Evacuation Plan: Know multiple evacuation routes and have a plan for your family, including pets.</li>
                <li>Stay Informed: Monitor local news and weather reports for updates on fire conditions.</li>
                <li>Have an Emergency Kit: Include N95 masks (to filter out smoke particles), medications, food, water, and other essentials.</li>
                <li>Keep Important Documents Ready: Have copies of important documents, such as passports, insurance papers, and property records.</li>
                <li>Use Fire-Resistant Materials: Install roofing and siding materials that are less likely to ignite.</li>
                <li>Clear Gutters and Roofs: Remove leaves, pine needles, and other flammable debris.</li>
            </ul>

            <h2 className="heading2">Storm Precautions (e.g., Hurricanes, Tornadoes)</h2>
            <ul className="precautions-list">
                <li>Secure Outdoor Objects: Bring in or tie down outdoor furniture, garbage cans, and other loose items.</li>
                <li>Board Up Windows: Use storm shutters or plywood to protect windows from high winds.</li>
                <li>Stay Indoors: Find a safe room, such as a basement or interior room on the lowest floor, away from windows.</li>
                <li>Prepare an Emergency Kit: Include non-perishable food, water, medications, flashlight, batteries, and a weather radio.</li>
                <li>Have a Family Plan: Establish communication methods and meeting points if separated.</li>
                <li>Know Evacuation Routes: Plan your route in advance in case evacuation is necessary.</li>
                <li>Charge Electronic Devices: Keep cell phones and portable chargers fully charged in case of power outages.</li>
            </ul>

            <h2 className="heading2">Flood Precautions</h2>
            <ul className="precautions-list">
                <li>Know Your Risk: Understand if you live in a flood-prone area and stay informed about local weather alerts.</li>
                <li>Elevate Appliances and Utilities: Move electrical appliances, water heaters, and other utilities above the potential flood level.</li>
                <li>Avoid Floodwaters: Do not walk, swim, or drive through floodwaters, as they can be deeper and more dangerous than they appear.</li>
                <li>Prepare an Emergency Kit: Include water, non-perishable food, medications, first aid supplies, and important documents.</li>
                <li>Have a Family Plan: Determine a safe evacuation route and a meeting place for family members.</li>
                <li>Turn Off Utilities: Know how to shut off gas, water, and electricity before flooding occurs.</li>
                <li>Move to Higher Ground: If flooding is imminent, move to higher floors or evacuate as directed by local authorities.</li>
            </ul>
        </div>
    </main></div>
}