"use client";
import mapboxgl from "mapbox-gl";
import React, { useEffect, useState, useRef } from "react";
const size = 200;
const pulsingDot = {
	width: size,
	height: size,
	data: new Uint8Array(size * size * 4),

	onAdd: function () {
		const canvas = document.createElement("canvas");
		canvas.width = this.width;
		canvas.height = this.height;
		this.context = canvas.getContext("2d");
	},

	render: function () {
		const duration = 1000;
		const t = (performance.now() % duration) / duration;

		const radius = (size / 2) * 0.3;
		const outerRadius = (size / 2) * 0.7 * t + radius;
		const context = this.context;

		context.clearRect(0, 0, this.width, this.height);
		context.beginPath();
		context.arc(this.width / 2, this.height / 2, outerRadius, 0, Math.PI * 2);
		context.fillStyle = `rgba(255, 200, 200, ${1 - t})`;
		context.fill();

		context.beginPath();
		context.arc(this.width / 2, this.height / 2, radius, 0, Math.PI * 2);
		context.fillStyle = "rgba(255, 100, 100, 1)";
		context.strokeStyle = "white";
		context.lineWidth = 2 + 4 * (1 - t);
		context.fill();
		context.stroke();

		this.data = context.getImageData(0, 0, this.width, this.height).data;

		mapRef.current.triggerRepaint();

		return true;
	},
};

export default function Globe2({ data }) {
	const mapContainerRef = useRef();
	const mapRef = useRef();

	useEffect(() => {
		mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN;
		if (mapRef.current) return;
		if (!mapContainerRef.current) return;

		mapRef.current = new mapboxgl.Map({
			container: mapContainerRef.current,
			center: [0, 0],
			zoom: 2,
			style: "mapbox://styles/mapbox/streets-v12",
		});

		mapRef.current.scrollZoom.disable();

		
	}, []);

	useEffect(() =>{
		data.map((d) => {

			let bgColorClass = 'green';
	  
					if (d.alert) {
					  // Background color based on alert value
					  bgColorClass = d.alert === 2 ? '#FDBA74' : d.alert === 3 ? '#EF4444' : '';
					} else {
					  // Background color based on magnitude
					  if (d.magnitude > 6) {
						bgColorClass = '#EF4444';
					  } else if (d.magnitude > 4) {
						bgColorClass = '#FDBA74';
					  } else {
						bgColorClass = '#FCD34D'
					  }
					}
				  new mapboxgl.Marker({ color: bgColorClass })
					  .setLngLat([d["longitude"], d["latitude"]])
			  .setPopup(
				new mapboxgl.Popup({ offset: 25 }) // add popups
				  .setHTML(
					`<h3>${d["country"]}</h3><p>${d["disaster"]}</p>`
				  )
			  )
					  .addTo(mapRef.current);
			  });
	},[data])

	return (
		<div className="h-full">
			<div
				id="map"
				className="map-container h-full"
				ref={mapContainerRef}
			></div>
		</div>
	);
}
