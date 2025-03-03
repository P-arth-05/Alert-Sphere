// "use client";
// import { useEffect, useRef, forwardRef, useState } from "react";
// import * as THREE from "three";
// import dynamic from "next/dynamic";

// const GlobeTmpl = dynamic(() => import("react-globe.gl"), {
//   ssr: false,
// });
// const Globe = forwardRef((props, ref) => (
//   <GlobeTmpl {...props} forwardRef={ref} />
// ));

// const World = ({ dimensions }) => {
//   const globeEl = useRef();

//   const [globeReady, setGlobeReady] = useState(false);

//   useEffect(() => {
//     console.log(globeEl.current, globeReady);
//     const globe = globeEl.current;

//     if (!globe) return;

//     // Auto-rotate the globe
//     const controls = globe.controls();
//     if (controls) {
//       controls.autoRotate = true;
//       controls.autoRotateSpeed = 0.35;
//     }

//     // Add clouds layer
//     const CLOUDS_IMG_URL = "/clouds.png"; // Ensure the path is correct in Next.js public folder
//     const CLOUDS_ALT = 0.004;
//     const CLOUDS_ROTATION_SPEED = -0.006; // deg/frame

//     const loader = new THREE.TextureLoader();
//     loader.load(CLOUDS_IMG_URL, (cloudsTexture) => {
//       const globeRadius = globe.getGlobeRadius();
//       const clouds = new THREE.Mesh(
//         new THREE.SphereGeometry(globeRadius * (1 + CLOUDS_ALT), 75, 75),
//         new THREE.MeshPhongMaterial({ map: cloudsTexture, transparent: true })
//       );
//       globe.scene().add(clouds);

//       // Rotation animation for clouds
//       const rotateClouds = () => {
//         clouds.rotation.y += (CLOUDS_ROTATION_SPEED * Math.PI) / 180;
//         requestAnimationFrame(rotateClouds);
//       };
//       rotateClouds();
//     });
//   }, [globeReady]);

//   return (
//     <Globe
//       ref={globeEl}
//       animateIn={false}
//       globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
//       bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
//       height={dimensions[0]}
//       onGlobeReady={() => setGlobeReady(true)}
//     />
//   );
// };

// export default World;
