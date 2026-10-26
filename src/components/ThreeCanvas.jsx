import React, { useRef, useState, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// The 4 Garden Route Stations
const GARDEN_STATIONS = [
  { id: "left_photos", type: "photos", label: "Blossom Grove of Photos & Quotes", pos: [-12, 0, -4] },
  { id: "right_song", type: "song", label: "Melody Gazebo (Your Dedicated Song)", pos: [12, 0, -4] },
  { id: "fountain", type: "fountain", label: "The Whispering Fountain (What You Love in Aditya)", pos: [10, 0, 8] },
  { id: "center_gift", type: "gift", label: "The Starlight Pavilion (Grand Surprise)", pos: [0, 0, -22] }
];

// ----------------------------------------------------------------------------
// 3D GIRL CHARACTER MODEL (Walking Girl Avatar)
// ----------------------------------------------------------------------------
function GirlCharacter({ charPos, charRot, isMoving, walkCycle }) {
  const groupRef = useRef();
  const leftLegRef = useRef();
  const rightLegRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();
  const bodyRef = useRef();

  useFrame(() => {
    if (!groupRef.current) return;

    groupRef.current.position.set(charPos.x, charPos.y, charPos.z);
    groupRef.current.rotation.y = charRot;

    if (isMoving) {
      const legSwing = Math.sin(walkCycle) * 0.6;
      const armSwing = Math.cos(walkCycle) * 0.5;

      if (leftLegRef.current) leftLegRef.current.rotation.x = legSwing;
      if (rightLegRef.current) rightLegRef.current.rotation.x = -legSwing;
      if (leftArmRef.current) leftArmRef.current.rotation.x = -armSwing;
      if (rightArmRef.current) rightArmRef.current.rotation.x = armSwing;

      if (bodyRef.current) {
        bodyRef.current.position.y = 0.95 + Math.abs(Math.sin(walkCycle * 2)) * 0.08;
      }
    } else {
      if (leftLegRef.current) leftLegRef.current.rotation.x = 0;
      if (rightLegRef.current) rightLegRef.current.rotation.x = 0;
      if (leftArmRef.current) leftArmRef.current.rotation.x = 0;
      if (rightArmRef.current) rightArmRef.current.rotation.x = 0;
      if (bodyRef.current) {
        bodyRef.current.position.y = 0.95 + Math.sin(Date.now() * 0.003) * 0.03;
      }
    }
  });

  return (
    <group ref={groupRef}>
      {/* Soft circular ground shadow */}
      <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.5, 24]} />
        <meshBasicMaterial color="#0b170c" transparent opacity={0.4} />
      </mesh>

      {/* Body & Hair */}
      <group ref={bodyRef} position={[0, 0.95, 0]}>
        {/* Head */}
        <mesh position={[0, 0.5, 0]}>
          <sphereGeometry args={[0.22, 24, 24]} />
          <meshStandardMaterial color="#ffd8c2" roughness={0.5} />
        </mesh>

        {/* Cute hair with pink floral hairpin */}
        <mesh position={[0, 0.54, -0.04]}>
          <sphereGeometry args={[0.24, 24, 24]} />
          <meshStandardMaterial color="#422212" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.72, -0.08]}>
          <sphereGeometry args={[0.1, 16, 16]} />
          <meshStandardMaterial color="#422212" />
        </mesh>
        <mesh position={[0, 0.74, -0.04]}>
          <boxGeometry args={[0.12, 0.06, 0.06]} />
          <meshStandardMaterial color="#ff4081" />
        </mesh>

        {/* Garden Dress (Soft Rose Pink) */}
        <mesh position={[0, 0.16, 0]}>
          <cylinderGeometry args={[0.16, 0.22, 0.38, 20]} />
          <meshStandardMaterial color="#ff7aa2" roughness={0.4} />
        </mesh>

        {/* Flared Skirt with flower accents */}
        <mesh position={[0, -0.08, 0]}>
          <cylinderGeometry args={[0.22, 0.4, 0.24, 20]} />
          <meshStandardMaterial color="#ff4081" roughness={0.4} />
        </mesh>

        {/* Left Arm */}
        <group ref={leftArmRef} position={[-0.24, 0.22, 0]}>
          <mesh position={[0, -0.16, 0]}>
            <cylinderGeometry args={[0.045, 0.04, 0.32, 12]} />
            <meshStandardMaterial color="#ffd8c2" />
          </mesh>
        </group>

        {/* Right Arm */}
        <group ref={rightArmRef} position={[0.24, 0.22, 0]}>
          <mesh position={[0, -0.16, 0]}>
            <cylinderGeometry args={[0.045, 0.04, 0.32, 12]} />
            <meshStandardMaterial color="#ffd8c2" />
          </mesh>
        </group>
      </group>

      {/* Left Leg */}
      <group ref={leftLegRef} position={[-0.1, 0.5, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.05, 0.045, 0.5, 12]} />
          <meshStandardMaterial color="#ffd8c2" />
        </mesh>
        <mesh position={[0, -0.5, 0.04]}>
          <boxGeometry args={[0.08, 0.08, 0.16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Right Leg */}
      <group ref={rightLegRef} position={[0.1, 0.5, 0]}>
        <mesh position={[0, -0.25, 0]}>
          <cylinderGeometry args={[0.05, 0.045, 0.5, 12]} />
          <meshStandardMaterial color="#ffd8c2" />
        </mesh>
        <mesh position={[0, -0.5, 0.04]}>
          <boxGeometry args={[0.08, 0.08, 0.16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>
    </group>
  );
}

// ----------------------------------------------------------------------------
// CAMERA CONTROLLER: Follows character smoothly
// ----------------------------------------------------------------------------
function CameraController({ charPos }) {
  const { camera } = useThree();

  useFrame(() => {
    const targetX = charPos.x;
    const targetY = charPos.y + 6.0;
    const targetZ = charPos.z + 8.2;

    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetX, 0.08);
    camera.position.y = THREE.MathUtils.lerp(camera.position.y, targetY, 0.08);
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, targetZ, 0.08);

    camera.lookAt(charPos.x, charPos.y + 1.2, charPos.z);
  });

  return null;
}

// ----------------------------------------------------------------------------
// FLOATING PETALS & FIREFLIES
// ----------------------------------------------------------------------------
function GardenPetals() {
  const pointsRef = useRef();
  const count = 160;

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 44;
      arr[i * 3 + 1] = Math.random() * 8 + 0.3;
      arr[i * 3 + 2] = (Math.random() - 0.5) * 50 - 8;
    }
    return arr;
  }, [count]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    const time = state.clock.getElapsedTime();
    const pos = pointsRef.current.geometry.attributes.position.array;
    for (let i = 0; i < count; i++) {
      pos[i * 3] += Math.sin(time * 0.5 + i) * 0.015;
      pos[i * 3 + 1] -= 0.012; // Falling downward
      if (pos[i * 3 + 1] < 0.2) {
        pos[i * 3 + 1] = 8.0;
      }
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.22}
        color="#ff80ab"
        transparent
        opacity={0.8}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

// ----------------------------------------------------------------------------
// CHERRY BLOSSOM TREE COMPONENT
// ----------------------------------------------------------------------------
function CherryBlossomTree({ position, scale = 1 }) {
  return (
    <group position={position} scale={[scale, scale, scale]}>
      {/* Trunk */}
      <mesh position={[0, 1.8, 0]}>
        <cylinderGeometry args={[0.25, 0.45, 3.6, 12]} />
        <meshStandardMaterial color="#4e342e" roughness={0.9} />
      </mesh>
      {/* Blossom Foliage clusters */}
      <mesh position={[0, 3.8, 0]}>
        <sphereGeometry args={[1.8, 16, 16]} />
        <meshStandardMaterial color="#ff80ab" roughness={0.6} />
      </mesh>
      <mesh position={[-0.8, 4.2, 0.4]}>
        <sphereGeometry args={[1.2, 14, 14]} />
        <meshStandardMaterial color="#ff4081" roughness={0.6} />
      </mesh>
      <mesh position={[0.8, 4.0, -0.4]}>
        <sphereGeometry args={[1.3, 14, 14]} />
        <meshStandardMaterial color="#ffb2dd" roughness={0.6} />
      </mesh>
    </group>
  );
}

// ----------------------------------------------------------------------------
// ENCHANTED GARDEN ARCHITECTURE (3 ROUTES)
// ----------------------------------------------------------------------------
function GardenEnvironment({ nearbyStationId }) {
  return (
    <group>
      {/* 1. LUSH GRASS MEADOW (Floor) */}
      <mesh position={[0, -0.01, -10]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#214227" roughness={0.8} metalness={0.1} />
      </mesh>

      {/* 2. STONE COBBLESTONE PATHWAYS */}
      {/* Main Central Path (from entrance z:8 down to fork at z:2) */}
      <mesh position={[0, 0.01, 5]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[4, 8]} />
        <meshStandardMaterial color="#d4c7b8" roughness={0.7} />
      </mesh>

      {/* Path branching Left (to Photos & Quotes Grove) */}
      <mesh position={[-6, 0.01, 0]} rotation={[-Math.PI / 2, 0, -Math.PI / 6]}>
        <planeGeometry args={[3.2, 14]} />
        <meshStandardMaterial color="#d4c7b8" roughness={0.7} />
      </mesh>

      {/* Path branching Right (to Melody Gazebo) */}
      <mesh position={[6, 0.01, 0]} rotation={[-Math.PI / 2, 0, Math.PI / 6]}>
        <planeGeometry args={[3.2, 14]} />
        <meshStandardMaterial color="#d4c7b8" roughness={0.7} />
      </mesh>

      {/* Central Path leading straight to Starlight Pavilion */}
      <mesh position={[0, 0.01, -12]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[3.6, 18]} />
        <meshStandardMaterial color="#d4c7b8" roughness={0.7} />
      </mesh>

      {/* Path branching South-East (to Whispering Fountain) */}
      <mesh position={[5, 0.01, 6.5]} rotation={[-Math.PI / 2, 0, Math.PI / 4]}>
        <planeGeometry args={[2.8, 8]} />
        <meshStandardMaterial color="#d4c7b8" roughness={0.7} />
      </mesh>

      {/* =========================================================================
          SIGNPOST AT THE FORK (x:0, z:3)
         ========================================================================= */}
      <group position={[0, 0, 3]}>
        {/* Post */}
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 2.4, 12]} />
          <meshStandardMaterial color="#5d4037" />
        </mesh>
        {/* Left Arrow Board */}
        <mesh position={[-0.7, 1.8, 0]} rotation={[0, 0, 0.1]}>
          <boxGeometry args={[1.5, 0.35, 0.08]} />
          <meshStandardMaterial color="#8d6e63" />
        </mesh>
        {/* Right Arrow Board */}
        <mesh position={[0.7, 1.4, 0]} rotation={[0, 0, -0.1]}>
          <boxGeometry args={[1.5, 0.35, 0.08]} />
          <meshStandardMaterial color="#8d6e63" />
        </mesh>
        {/* Center Arrow Board */}
        <mesh position={[0, 2.1, 0]}>
          <boxGeometry args={[1.6, 0.35, 0.08]} />
          <meshStandardMaterial color="#d7ccc8" />
        </mesh>
        {/* Fountain Arrow Board */}
        <mesh position={[0.6, 1.0, 0]} rotation={[0, 0, -0.2]}>
          <boxGeometry args={[1.5, 0.32, 0.08]} />
          <meshStandardMaterial color="#ba68c8" />
        </mesh>
      </group>

      {/* =========================================================================
          🌸 4TH ROUTE: THE WHISPERING FOUNTAIN (What She Loves in Aditya) (x: 10, z: 8)
         ========================================================================= */}
      <group position={[10, 0, 8]}>
        {/* Stone Basin */}
        <mesh position={[0, 0.25, 0]}>
          <cylinderGeometry args={[2.5, 2.7, 0.5, 32]} />
          <meshStandardMaterial color="#d7ccc8" roughness={0.4} />
        </mesh>
        {/* Water Pool */}
        <mesh position={[0, 0.48, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[2.3, 32]} />
          <meshStandardMaterial color="#4fc3f7" roughness={0.1} metalness={0.6} transparent opacity={0.85} />
        </mesh>
        {/* Tier 2 Fountain Pedestal */}
        <mesh position={[0, 0.9, 0]}>
          <cylinderGeometry args={[0.4, 0.6, 1.0, 16]} />
          <meshStandardMaterial color="#bcaaa4" />
        </mesh>
        {/* Tier 2 Basin */}
        <mesh position={[0, 1.4, 0]}>
          <cylinderGeometry args={[1.2, 0.8, 0.35, 24]} />
          <meshStandardMaterial color="#d7ccc8" />
        </mesh>
        {/* Floating Heart Jewel in Fountain Spray */}
        <mesh position={[0, 2.1, 0]}>
          <octahedronGeometry args={[0.35]} />
          <meshStandardMaterial color="#ff4081" emissive="#ff4081" emissiveIntensity={0.8} />
        </mesh>
        <pointLight position={[0, 2.2, 0]} color="#4fc3f7" intensity={3} distance={7} />
      </group>

      {/* =========================================================================
          ⬅️ LEFT ROUTE: BLOSSOM GROVE OF PHOTOS & QUOTES (x: -12, z: -4)
         ========================================================================= */}
      <group position={[-12, 0, -4]}>
        {/* Pavilion Base */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[5, 32]} />
          <meshStandardMaterial color="#eddcc9" roughness={0.4} />
        </mesh>
        {/* Wooden Columns & Trellis */}
        {[-3, 3].map((xOffset, i) => (
          <mesh key={i} position={[xOffset, 2, 0]}>
            <cylinderGeometry args={[0.15, 0.15, 4, 12]} />
            <meshStandardMaterial color="#6d4c41" />
          </mesh>
        ))}
        {/* Floating 3D Polaroid Frames */}
        {[-1.8, 0, 1.8].map((xOffset, idx) => (
          <group key={idx} position={[xOffset, 2.2 + Math.sin(idx) * 0.2, -1.8]}>
            <mesh>
              <boxGeometry args={[1.4, 1.8, 0.08]} />
              <meshStandardMaterial color="#ffffff" roughness={0.3} />
            </mesh>
            <mesh position={[0, 0.15, 0.05]}>
              <planeGeometry args={[1.2, 1.1]} />
              <meshStandardMaterial color="#ff7aa2" roughness={0.5} />
            </mesh>
          </group>
        ))}
        {/* Golden floating crystal */}
        <mesh position={[0, 1.6, 0]}>
          <octahedronGeometry args={[0.45]} />
          <meshStandardMaterial color="#ffd54f" emissive="#ffab00" emissiveIntensity={0.6} />
        </mesh>
        <pointLight position={[0, 2.5, 0]} color="#ffd54f" intensity={2} distance={6} />
      </group>

      {/* =========================================================================
          ➡️ RIGHT ROUTE: MELODY GAZEBO & DEDICATED SONG (x: 12, z: -4)
         ========================================================================= */}
      <group position={[12, 0, -4]}>
        {/* Gazebo Platform */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[5, 32]} />
          <meshStandardMaterial color="#eedfd0" roughness={0.4} />
        </mesh>
        {/* Gazebo Roof */}
        <mesh position={[0, 3.6, 0]}>
          <coneGeometry args={[3.2, 1.6, 6]} />
          <meshStandardMaterial color="#8d6e63" />
        </mesh>
        {/* Gazebo Pillars */}
        {[0, 1, 2, 3, 4, 5].map((idx) => {
          const angle = (idx * Math.PI * 2) / 6;
          return (
            <mesh key={idx} position={[Math.cos(angle) * 2.6, 1.8, Math.sin(angle) * 2.6]}>
              <cylinderGeometry args={[0.12, 0.12, 3.6, 12]} />
              <meshStandardMaterial color="#efebe9" />
            </mesh>
          );
        })}
        {/* Glowing Gramophone / Music Altar in center */}
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.8, 0.9, 0.8, 24]} />
          <meshStandardMaterial color="#ff4081" roughness={0.3} />
        </mesh>
        {/* Floating musical note crystal */}
        <mesh position={[0, 1.8, 0]}>
          <torusGeometry args={[0.35, 0.08, 16, 32]} />
          <meshStandardMaterial color="#ff80ab" emissive="#ff4081" emissiveIntensity={0.8} />
        </mesh>
        <pointLight position={[0, 2.5, 0]} color="#ff4081" intensity={3} distance={7} />
      </group>

      {/* =========================================================================
          ⬆️ CENTER ROUTE: THE STARLIGHT PAVILION & GRAND MAIN GIFT (x: 0, z: -22)
         ========================================================================= */}
      <group position={[0, 0, -22]}>
        {/* Grand Altar Platform */}
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <circleGeometry args={[8, 36]} />
          <meshStandardMaterial color="#1a1226" roughness={0.5} />
        </mesh>
        {/* Marble steps */}
        <mesh position={[0, 0.2, 0]}>
          <cylinderGeometry args={[5, 5.4, 0.35, 32]} />
          <meshStandardMaterial color="#eae4e9" />
        </mesh>
        {/* Giant Surprise Love Letter Box */}
        <mesh position={[0, 1.0, 0]}>
          <boxGeometry args={[1.8, 1.5, 1.8]} />
          <meshStandardMaterial color="#ff3366" roughness={0.3} />
        </mesh>
        {/* Golden Ribbons */}
        <mesh position={[0, 1.0, 0]}>
          <boxGeometry args={[1.85, 1.55, 0.35]} />
          <meshStandardMaterial color="#ffd700" metalness={0.8} />
        </mesh>
        <mesh position={[0, 1.0, 0]}>
          <boxGeometry args={[0.35, 1.55, 1.85]} />
          <meshStandardMaterial color="#ffd700" metalness={0.8} />
        </mesh>
        {/* Floating Heart Jewel on Top */}
        <mesh position={[0, 2.5, 0]}>
          <octahedronGeometry args={[0.55]} />
          <meshStandardMaterial color="#ff4081" emissive="#ff1744" emissiveIntensity={0.9} />
        </mesh>
        <pointLight position={[0, 2.6, 0]} color="#ff4081" intensity={4} distance={9} />
      </group>

      {/* Cherry Blossom Trees lining the garden */}
      <CherryBlossomTree position={[-6, 0, 6]} scale={1.2} />
      <CherryBlossomTree position={[6, 0, 6]} scale={1.2} />
      <CherryBlossomTree position={[-16, 0, -2]} scale={1.3} />
      <CherryBlossomTree position={[16, 0, -2]} scale={1.3} />
      <CherryBlossomTree position={[-5, 0, -18]} scale={1.4} />
      <CherryBlossomTree position={[5, 0, -18]} scale={1.4} />

      {/* Glowing Interaction Rings at each of the 3 stations */}
      {GARDEN_STATIONS.map((station) => {
        const isNear = nearbyStationId === station.id;
        return (
          <group key={station.id} position={station.pos}>
            <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[2.0, 2.3, 32]} />
              <meshBasicMaterial
                color={isNear ? "#ffd700" : "#ff4081"}
                transparent
                opacity={isNear ? 0.95 : 0.45}
              />
            </mesh>
          </group>
        );
      })}
    </group>
  );
}

// ----------------------------------------------------------------------------
// MAIN 3D CANVAS COMPONENT
// ----------------------------------------------------------------------------
export default function ThreeCanvas({ 
  onProximityChange, 
  joystickInput, 
  onTriggerInteract 
}) {
  const [charPos, setCharPos] = useState({ x: 0, y: 0, z: 8 });
  const [charRot, setCharRot] = useState(Math.PI);
  const [isMoving, setIsMoving] = useState(false);
  const [walkCycle, setWalkCycle] = useState(0);
  const [nearbyStationId, setNearbyStationId] = useState(null);

  const keysPressed = useRef({});
  const posRef = useRef({ x: 0, y: 0, z: 8 });
  const rotRef = useRef(Math.PI);

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current[e.code] = true;
      if (e.code === "KeyE" || e.code === "Space") {
        e.preventDefault();
        onTriggerInteract();
      }
    };
    const handleKeyUp = (e) => {
      keysPressed.current[e.code] = false;
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [onTriggerInteract]);

  // Game loop
  useEffect(() => {
    let animId;
    let localWalk = 0;

    const updateMovement = () => {
      let dx = 0;
      let dz = 0;

      if (keysPressed.current["KeyW"] || keysPressed.current["ArrowUp"]) dz -= 1;
      if (keysPressed.current["KeyS"] || keysPressed.current["ArrowDown"]) dz += 1;
      if (keysPressed.current["KeyA"] || keysPressed.current["ArrowLeft"]) dx -= 1;
      if (keysPressed.current["KeyD"] || keysPressed.current["ArrowRight"]) dx += 1;

      if (joystickInput && (Math.abs(joystickInput.x) > 0.1 || Math.abs(joystickInput.y) > 0.1)) {
        dx += joystickInput.x;
        dz += joystickInput.y;
      }

      const length = Math.hypot(dx, dz);
      const speed = 0.15;

      if (length > 0.05) {
        const normX = (dx / length) * speed;
        const normZ = (dz / length) * speed;

        let nextX = posRef.current.x + normX;
        let nextZ = posRef.current.z + normZ;

        // Boundaries within the romantic garden
        nextX = Math.max(-19, Math.min(19, nextX));
        nextZ = Math.max(-30, Math.min(11, nextZ));

        posRef.current = { x: nextX, y: 0, z: nextZ };
        rotRef.current = Math.atan2(dx, dz);

        localWalk += 0.22;
        setWalkCycle(localWalk);
        setIsMoving(true);
        setCharPos({ ...posRef.current });
        setCharRot(rotRef.current);
      } else {
        setIsMoving(false);
      }

      // Check proximity to the 3 stations
      let nearest = null;
      let minDist = 3.8;

      GARDEN_STATIONS.forEach((station) => {
        const dist = Math.hypot(
          posRef.current.x - station.pos[0],
          posRef.current.z - station.pos[2]
        );
        if (dist < minDist) {
          nearest = station;
        }
      });

      setNearbyStationId(nearest ? nearest.id : null);
      onProximityChange(nearest, posRef.current);

      animId = requestAnimationFrame(updateMovement);
    };

    animId = requestAnimationFrame(updateMovement);
    return () => cancelAnimationFrame(animId);
  }, [joystickInput, onProximityChange]);

  return (
    <div className="canvas-wrapper">
      <Canvas
        camera={{ position: [0, 8, 14], fov: 50 }}
        shadows
        style={{ width: "100%", height: "100%" }}
      >
        {/* Sunset Twilight Lighting */}
        <ambientLight intensity={0.9} color="#fff1f5" />
        <directionalLight
          position={[10, 18, 8]}
          intensity={1.3}
          color="#ffecd2"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[0, 8, 4]} color="#ff80ab" intensity={2} distance={20} />

        {/* 3D Walking Girl Avatar */}
        <GirlCharacter
          charPos={charPos}
          charRot={charRot}
          isMoving={isMoving}
          walkCycle={walkCycle}
        />

        {/* Camera Follow */}
        <CameraController charPos={charPos} />

        {/* The 3 Enchanted Garden Routes */}
        <GardenEnvironment nearbyStationId={nearbyStationId} />

        {/* Falling Pink Petals */}
        <GardenPetals />
      </Canvas>
    </div>
  );
}
