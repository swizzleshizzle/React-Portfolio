import * as THREE from 'three'
import React, { useRef, useEffect, Suspense, useState } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Text, OrbitControls, Trail } from '@react-three/drei'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { Typewriter } from 'react-simple-typewriter'
import './HeroThree.css'
import { heroTaglines } from '../constants'

// Import spaceship models
import spaceship1Model from '../assets/ships/Spaceship1.glb?url'
import spaceship2Model from '../assets/ships/Spaceship2.glb?url'
import spaceship3Model from '../assets/ships/Spaceship3.glb?url'
import spaceship4Model from '../assets/ships/Spaceship4.glb?url'
import spaceship5Model from '../assets/ships/Spaceship5.glb?url'

// Model paths array
const SHIP_MODELS = [spaceship1Model, spaceship2Model, spaceship3Model, spaceship4Model, spaceship5Model]

// Ship color palettes - vibrant colors that look good with emissive materials
const SHIP_COLORS = [
  '#ff3366', // Pink
  '#33ccff', // Light Blue
  '#66ff66', // Light Green
  '#ffcc33', // Gold
  '#cc66ff', // Purple
  '#ff6633', // Orange
  '#33ffcc', // Teal
  '#ff99cc', // Light Pink
  '#99ff33', // Lime
  '#3366ff'  // Blue
]

// Function to get a random color from the palette
const getRandomShipColor = () => {
  return SHIP_COLORS[Math.floor(Math.random() * SHIP_COLORS.length)]
}

// Gradient colors
const GRADIENT_COLORS = {
  from: new THREE.Color('#7c3aed'), // violet-600
  via: new THREE.Color('#86efac'),  // green-300
  to: new THREE.Color('#38bdf8'),   // sky-400
}

const hightlightColors = ["#7b01c1", "#a8140e", "#4315aa", "#000596", "#8f4762"];

// Background color
const BACKGROUND_COLOR = '#242424'
//const BACKGROUND_COLOR = '#000000'

// Text component
function GradientText({ text, position, fontSize = 5, scrollProgress = 0 }) {
  const ref = useRef()
  
  // Calculate animated position based on scroll progress
  const animatedY = position[1] + (scrollProgress * 40); // Move up by 20 units when fully scrolled
  const animatedZ = position[2] - (scrollProgress * 30); // Move back by 30 units when fully scrolled
  const animatedPosition = [position[0], animatedY, animatedZ];
  
  // Calculate opacity based on scroll progress
  const opacity = 1 - (scrollProgress * 1); // Fade out to 0.2 opacity when fully scrolled

  useFrame(({ clock }) => {
    if (ref.current) {
      const t = (Math.sin(clock.getElapsedTime() * 0.5) + 1) * 0.5

      if (t < 0.5) {
        const mappedT = t * 2
        ref.current.material.color.copy(GRADIENT_COLORS.from).lerp(GRADIENT_COLORS.via, mappedT)
      }
      else {
        const mappedT = (t - 0.5) * 2
        ref.current.material.color.copy(GRADIENT_COLORS.via).lerp(GRADIENT_COLORS.to, mappedT)
      }
      
      // Apply opacity from scroll
      ref.current.material.opacity = opacity;
    }
  })

  return (
    <Text
      ref={ref}
      position={animatedPosition}
      fontSize={fontSize}
      letterSpacing={-0.05}
      lineHeight={1}
      material-toneMapped={false}
      material-transparent={true}
      textAlign="center"
    >
      {text}
    </Text>
  )
}

// Typewriter text component for 3D scene
function TypewriterText({ position, fontSize = 2, scrollProgress = 0 }) {
  const textRef = useRef();
  const [displayedText, setDisplayedText] = useState("");
  const [currentTaglineIndex, setCurrentTaglineIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
  const timeoutRef = useRef(null);
  
  // Calculate animated position based on scroll progress
  const animatedY = position[1] + (scrollProgress * 40);
  const animatedZ = position[2] - (scrollProgress * 30);
  const animatedPosition = [position[0], animatedY, animatedZ];
  
  // Calculate opacity based on scroll progress
  const opacity = 1 - (scrollProgress * 1);

  // Typewriter effect logic  
  useEffect(() => {
    const currentTagline = heroTaglines[currentTaglineIndex];
    
    function typeAnimation() {
      if (isTyping) {
        if (currentLetterIndex < currentTagline.length) {
          setDisplayedText(currentTagline.substring(0, currentLetterIndex + 1));
          setCurrentLetterIndex(prev => prev + 1);
          // Faster typing speed (was 70ms)
          timeoutRef.current = setTimeout(typeAnimation, 40);
        } else {
          // Shorter pause when fully typed (was 1500ms)
          timeoutRef.current = setTimeout(() => {
            setIsTyping(false);
            typeAnimation();
          }, 1000);
        }
      } else {
        // Erasing
        if (currentLetterIndex > 0) {
          setDisplayedText(currentTagline.substring(0, currentLetterIndex - 1));
          setCurrentLetterIndex(prev => prev - 1);
          // Faster backspacing speed (was 30ms)
          timeoutRef.current = setTimeout(typeAnimation, 20);
        } else {
          // Move to next tagline after erasing
          const nextIndex = (currentTaglineIndex + 1) % heroTaglines.length;
          setCurrentTaglineIndex(nextIndex);
          setIsTyping(true);
          // Shorter pause between taglines (was 300ms)
          timeoutRef.current = setTimeout(typeAnimation, 150);
        }
      }
    }

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Start the animation
    timeoutRef.current = setTimeout(typeAnimation, 100);

    // Cleanup on unmount or when dependencies change
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [currentTaglineIndex, currentLetterIndex, isTyping]);
  
  // Add blinking cursor effect
  const [showCursor, setShowCursor] = useState(true);
  
  useEffect(() => {
    // Faster cursor blinking (was 530ms)
    const cursorIntervalId = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 400);
    
    return () => clearInterval(cursorIntervalId);
  }, []);

  // Combine text and cursor
  const textWithCursor = `${displayedText}${showCursor ? "_" : ""}`;
  
  useFrame(({ clock }) => {
    if (textRef.current) {
      const t = (Math.sin(clock.getElapsedTime() * 0.5) + 1) * 0.5;

      if (t < 0.5) {
        const mappedT = t * 2;
        textRef.current.material.color.copy(GRADIENT_COLORS.from).lerp(GRADIENT_COLORS.via, mappedT);
      } else {
        const mappedT = (t - 0.5) * 2;
        textRef.current.material.color.copy(GRADIENT_COLORS.via).lerp(GRADIENT_COLORS.to, mappedT);
      }
      
      // Apply opacity from scroll
      textRef.current.material.opacity = opacity;
    }
  });
  
  return (
    <Text
      ref={textRef}
      position={animatedPosition}
      fontSize={fontSize}
      letterSpacing={-0.05}
      lineHeight={1}
      material-toneMapped={false}
      material-transparent={true}
      textAlign="center"
    >
      {textWithCursor}
    </Text>
  );
}

// Spaceship component with trail
function Spaceship({ shipType = 0, scale = 0.005, speed = 1.0, direction = 'left-to-right' }) {
  const shipRef = useRef()
  const isActive = useRef(true)

  // Load the 3D model
  const modelPath = SHIP_MODELS[shipType % SHIP_MODELS.length]
  const gltf = useLoader(GLTFLoader, modelPath)

  // Generate a random color for this ship
  const shipColor = useRef(getRandomShipColor())

  // Add emissive materials to make the ships glow
  useEffect(() => {
    if (gltf?.scene) {
      // Log mesh names for debugging
      console.log('Ship model loaded:', shipType);
      gltf.scene.traverse((child) => {
        if (child.isMesh) {
          console.log('Mesh found:', child.material.name);
        }
      });

      gltf.scene.traverse((child) => {
        if (child.isMesh && child.material) {
          // Clone the material to avoid affecting other instances
          if (!child.material.userData.isCloned) {
            child.material = child.material.clone();
            child.material.userData.isCloned = true;
          }

          // Check mesh name to apply different styling
          if (child.material.name.includes('lambert2SG') || child.material.name.includes('Body')) {
            // Main body - apply the random color
            child.material.color = new THREE.Color('#333333');
            child.material.emissive = new THREE.Color('#222222');
            child.material.emissiveIntensity = 0.5;
          } else if (child.material.name.includes('lambert4SG') || child.material.name.includes('Window')) {
            // Windows - make them glow white or light blue
            child.material.color = new THREE.Color('#ffffff');
            child.material.emissive = new THREE.Color('#88ccff');
            child.material.emissiveIntensity = 0.8;
          } else if (child.name.includes('lambert3SG') || child.name.includes('Detail')) {
            // Details/accents - make them a complementary color
            const hsl = new THREE.Color(shipColor.current).getHSL({});
            const complementaryHue = (hsl.h + 0.5) % 1.0;
            const complementaryColor = new THREE.Color().setHSL(complementaryHue, hsl.s, hsl.l);

            child.material.color = complementaryColor;
            child.material.emissive = complementaryColor;
            child.material.emissiveIntensity = 0.3;
          } else {
            // Default - apply the random color with less intensity
            child.material.color = new THREE.Color(shipColor.current);
            child.material.emissive = new THREE.Color(shipColor.current);
            child.material.emissiveIntensity = 0.3;
          }

          // Ensure the material catches light
          child.material.roughness = 0.3;
          child.material.metalness = 0.7;
        }
      });
    }
  }, [gltf, shipType]);

  // Get bounds for respawning
  const sceneBounds = {
    xMin: -60,
    xMax: 60,
    yMin: -20,
    yMax: 20,
    zMin: -40,
    zMax: 10  // Keep ships somewhat behind the text (which is at z=0)
  }

  // Generate random starting position behind the text
  const generateRandomPosition = () => {
    // Decide which edge to spawn from based on direction
    let x, y, z

    if (direction === 'left-to-right') {
      // Start from left edge
      x = sceneBounds.xMin
      y = Math.random() * (sceneBounds.yMax - sceneBounds.yMin) + sceneBounds.yMin
      z = Math.random() * (sceneBounds.zMax - sceneBounds.zMin) + sceneBounds.zMin
    } else if (direction === 'right-to-left') {
      // Start from right edge
      x = sceneBounds.xMax
      y = Math.random() * (sceneBounds.yMax - sceneBounds.yMin) + sceneBounds.yMin
      z = Math.random() * (sceneBounds.zMax - sceneBounds.zMin) + sceneBounds.zMin
    } else if (direction === 'top-to-bottom') {
      // Start from top edge
      x = Math.random() * (sceneBounds.xMax - sceneBounds.xMin) + sceneBounds.xMin
      y = sceneBounds.yMax
      z = Math.random() * (sceneBounds.zMax - sceneBounds.zMin) + sceneBounds.zMin
    } else if (direction === 'bottom-to-top') {
      // Start from bottom edge
      x = Math.random() * (sceneBounds.xMax - sceneBounds.xMin) + sceneBounds.xMin
      y = sceneBounds.yMin
      z = Math.random() * (sceneBounds.zMax - sceneBounds.zMin) + sceneBounds.zMin
    } else {
      // Diagonal paths
      const randomEdge = Math.floor(Math.random() * 4)
      switch (randomEdge) {
        case 0: // Left edge
          x = sceneBounds.xMin
          y = Math.random() * (sceneBounds.yMax - sceneBounds.yMin) + sceneBounds.yMin
          break
        case 1: // Right edge
          x = sceneBounds.xMax
          y = Math.random() * (sceneBounds.yMax - sceneBounds.yMin) + sceneBounds.yMin
          break
        case 2: // Top edge
          x = Math.random() * (sceneBounds.xMax - sceneBounds.xMin) + sceneBounds.xMin
          y = sceneBounds.yMax
          break
        case 3: // Bottom edge
          x = Math.random() * (sceneBounds.xMax - sceneBounds.xMin) + sceneBounds.xMin
          y = sceneBounds.yMin
          break
      }
      z = Math.random() * (sceneBounds.zMax - sceneBounds.zMin) + sceneBounds.zMin
    }

    return [x, y, z]
  }

  // Set initial position
  const initialPosition = generateRandomPosition()

  // Setup movement vector based on direction
  const movementVector = useRef(new THREE.Vector3())

  useEffect(() => {
    // Calculate movement vector based on direction
    if (direction === 'left-to-right') {
      movementVector.current.set(1, 0.1 * (Math.random() - 0.5), 0)
    } else if (direction === 'right-to-left') {
      movementVector.current.set(-1, 0.1 * (Math.random() - 0.5), 0)
    } else if (direction === 'top-to-bottom') {
      movementVector.current.set(0.1 * (Math.random() - 0.5), -1, 0)
    } else if (direction === 'bottom-to-top') {
      movementVector.current.set(0.1 * (Math.random() - 0.5), 1, 0)
    } else {
      // Random diagonal direction
      const randomVector = new THREE.Vector3(
        Math.random() * 2 - 1,
        Math.random() * 2 - 1,
        0
      )
      randomVector.normalize()
      movementVector.current.copy(randomVector)
    }

    // Normalize and scale by speed
    movementVector.current.normalize().multiplyScalar(speed)

    // Orient the ship to face the direction of travel using quaternions
    if (shipRef.current) {
      const directionVector = movementVector.current.clone().normalize();
      const quaternion = new THREE.Quaternion();
      // For some models the forward vector might be different - adjust as needed
      // In this case, we need to use positive Z as forward
      const defaultForward = new THREE.Vector3(0, 0, 1);
      quaternion.setFromUnitVectors(defaultForward, directionVector);
      shipRef.current.quaternion.copy(quaternion);
    }
  }, [direction, speed])

  useFrame(({ clock }) => {
    if (shipRef.current && isActive.current) {
      // Move the ship along its path
      shipRef.current.position.x += movementVector.current.x * 0.1;
      shipRef.current.position.y += movementVector.current.y * 0.1;
      shipRef.current.position.z += movementVector.current.z * 0.01;

      // Check if ship is out of bounds
      const pos = shipRef.current.position;
      if (
        pos.x < sceneBounds.xMin - 5 ||
        pos.x > sceneBounds.xMax + 5 ||
        pos.y < sceneBounds.yMin - 5 ||
        pos.y > sceneBounds.yMax + 5
      ) {
        // Reset ship position
        const newPos = generateRandomPosition();
        shipRef.current.position.set(newPos[0], newPos[1], newPos[2]);

        // Recalculate movement vector
        if (direction === 'left-to-right') {
          movementVector.current.set(1, 0.1 * (Math.random() - 0.5), 0)
        } else if (direction === 'right-to-left') {
          movementVector.current.set(-1, 0.1 * (Math.random() - 0.5), 0)
        } else if (direction === 'top-to-bottom') {
          movementVector.current.set(0.1 * (Math.random() - 0.5), -1, 0)
        } else if (direction === 'bottom-to-top') {
          movementVector.current.set(0.1 * (Math.random() - 0.5), 1, 0)
        } else {
          // Random diagonal direction
          const randomVector = new THREE.Vector3(
            Math.random() * 2 - 1,
            Math.random() * 2 - 1,
            0
          )
          randomVector.normalize()
          movementVector.current.copy(randomVector)
        }

        // Normalize and scale by speed
        movementVector.current.normalize().multiplyScalar(speed)

        // Orient the ship to face the direction of travel using quaternions
        const directionVector = movementVector.current.clone().normalize();
        const quaternion = new THREE.Quaternion();
        // For some models the forward vector might be different - adjust as needed
        // In this case, we need to use positive Z as forward
        const defaultForward = new THREE.Vector3(0, 0, 1);
        quaternion.setFromUnitVectors(defaultForward, directionVector);
        shipRef.current.quaternion.copy(quaternion);
      }
    }
  })

  // Different trail configs based on ship type
  const trailConfigs = {
    0: { width: 1.0, length: 8, opacity: 0.6 },
    1: { width: 0.8, length: 10, opacity: 0.5 },
    2: { width: 1.2, length: 6, opacity: 0.7 },
    3: { width: 0.9, length: 12, opacity: 0.4 },
    4: { width: 1.1, length: 7, opacity: 0.65 }
  }

  // Get the trail config for this ship type
  const trailConfig = trailConfigs[shipType % 5]

  return (
    <group ref={shipRef} position={initialPosition} scale={[scale, scale, scale]}>
      <Trail
        width={trailConfig.width}
        length={trailConfig.length}
        color={shipColor.current}
        attenuation={(t) => t * t}
        opacity={trailConfig.opacity}
      >
        <primitive object={gltf.scene} />
      </Trail>
    </group>
  )
}

// Simple star field
function StarField() {
  const points = useRef()

  const [positions] = React.useMemo(() => {
    const count = 1000
    const positions = new Float32Array(count * 3)

    for (let i = 0; i < count; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 50
      positions[i * 3 + 1] = (Math.random() - 0.5) * 50
      positions[i * 3 + 2] = (Math.random() - 0.5) * 50
    }

    return [positions]
  }, [])

  useFrame(({ clock }) => {
    if (points.current) {
      points.current.rotation.y = clock.getElapsedTime() * 0.05
    }
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.1} color="#ffffff" />
    </points>
  )
}

// Fallback loading component
function LoadingFallback() {
  return (
    <mesh>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="white" />
    </mesh>
  )
}

// Scene
function HeroScene({ scrollProgress = 0 }) {
  const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  const orbitControlsRef = useRef(null)
  
  // Handle Y-axis drag to scroll on mobile and wheel events on desktop
  useEffect(() => {
    if (!orbitControlsRef.current) return;
    
    // Function to scroll to the About section
    const scrollToAboutSection = () => {
      const aboutSection = document.getElementById('about');
      if (aboutSection) {
        aboutSection.scrollIntoView({ behavior: 'smooth' });
      } else {
        // Fallback if section not found
        window.scrollTo({
          top: window.innerHeight,
          behavior: 'smooth'
        });
      }
    };
    
    // Get the canvas element
    const canvas = document.querySelector('.hero-three-container canvas');
    if (canvas) {
      if (mobileCheck) {
        // For mobile: Simple touch handlers to navigate to next section
        let touchStartY = 0;
        let touchStartTime = 0;
        
        const handleTouchStart = (e) => {
          touchStartY = e.touches[0].clientY;
          touchStartTime = Date.now();
        };
        
        const handleTouchMove = (e) => {
          // Only handle if we're at the top of the page (in hero section)
          if (window.scrollY > 50) return;
          
          const touchY = e.touches[0].clientY;
          const deltaY = touchStartY - touchY;
          const timeElapsed = Date.now() - touchStartTime;
          
          // If significant downward swipe detected, navigate to About section
          if (deltaY > 30 && timeElapsed < 300) {
            e.preventDefault();
            scrollToAboutSection();
          }
        };
        
        canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
        canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
        
        // Add to cleanup
        return () => {
          canvas.removeEventListener('touchstart', handleTouchStart);
          canvas.removeEventListener('touchmove', handleTouchMove);
        };
      } else {
        // For desktop: Simple wheel handler
        const handleWheel = (e) => {
          // Only handle if we're at the top of the page (in hero section)
          if (window.scrollY > 50) return;
          
          // If scrolling down, navigate to About section
          if (e.deltaY > 0) {
            e.preventDefault();
            scrollToAboutSection();
          }
        };
        
        canvas.addEventListener('wheel', handleWheel, { passive: false });
        
        return () => {
          canvas.removeEventListener('wheel', handleWheel);
        };
      }
    }
  }, [mobileCheck]);
  
  // Define ship configurations
  const shipConfigs = React.useMemo(() => {
    const directions = ['left-to-right', 'right-to-left', 'top-to-bottom', 'bottom-to-top', 'random']


    // Create 15 ships with varied configurations for all 5 ship types
    return Array.from({ length: 15 }, (_, i) => ({
      shipType: i % 5,
      scale: 0.003 + Math.random() * 0.002, // Very small scale for 3D models
      direction: directions[i % directions.length],
      speed: 0.3 + Math.random() * 1.0, // Random speed between 0.3 and 1.3
    }))
  }, [])

  if (mobileCheck) {
    return (
      <>
        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.2} color="#b0c4de" />
        <pointLight position={[0, 0, 10]} intensity={0.5} color="#ffe4b5" distance={50} />

        <StarField />

        {/* Add spaceships to the scene with proper error handling */}
        <Suspense fallback={<LoadingFallback />}>
          {shipConfigs.map((ship, index) => (
            <Spaceship
              key={index}
              shipType={ship.shipType}
              scale={ship.scale}
              direction={ship.direction}
              speed={ship.speed}
            />
          ))}
        </Suspense>
        <group position={[0, 0, 0]}>
          <GradientText
            text="Hi, I'm Michael Greene"
            position={[0, 2, 0]}
            fontSize={0.75}
            scrollProgress={scrollProgress}
          />
          <TypewriterText
            position={[0, -2, 0]}
            fontSize={0.6}
            scrollProgress={scrollProgress}
          />
        </group>

        <OrbitControls
          ref={orbitControlsRef}
          enableZoom={false}
          enablePan={false}
          minPolarAngle={Math.PI / 2}
          maxPolarAngle={Math.PI / 2}
          rotateSpeed={0.5}
        />
      </>
    )
  } else {
    return (
      <>
        {/* Enhanced lighting setup */}
        <ambientLight intensity={0.3} />
        <directionalLight position={[10, 10, 5]} intensity={0.5} color="#ffffff" />
        <directionalLight position={[-10, -10, -5]} intensity={0.2} color="#b0c4de" />
        <pointLight position={[0, 0, 10]} intensity={0.5} color="#ffe4b5" distance={50} />

        <StarField />

        {/* Add spaceships to the scene with proper error handling */}
        <Suspense fallback={<LoadingFallback />}>
          {shipConfigs.map((ship, index) => (
            <Spaceship
              key={index}
              shipType={ship.shipType}
              scale={ship.scale}
              direction={ship.direction}
              speed={ship.speed}
            />
          ))}
        </Suspense>
        <group position={[0, 0, 0]}>
          <GradientText
            text="Hi, I'm Michael Greene"
            position={[0, 2, 0]}
            fontSize={2}
            scrollProgress={scrollProgress}
          />
          <TypewriterText
            position={[0, -2, 0]}
            fontSize={1.5}
            scrollProgress={scrollProgress}
          />
        </group>

        <OrbitControls
          ref={orbitControlsRef}
          enableZoom={false}
          enablePan={false}
          minPolarAngle={0}
          maxPolarAngle={Math.PI}
          rotateSpeed={0.5}
        />
      </>
    )
  }
}

// Canvas wrapper with error handling
function CanvasWrapper({ scrollProgress = 0 }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 15], fov: 75 }}
      dpr={window.devicePixelRatio}
      gl={{ antialias: true }}
    >
      <color attach="background" args={[BACKGROUND_COLOR]} />
      <Suspense fallback={<LoadingFallback />}>
        <HeroScene scrollProgress={scrollProgress} />
      </Suspense>
    </Canvas>
  )
}

// Main component
function HeroThree() {
  const [scrolled, setScrolled] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const previousScrollProgress = useRef(0);

  useEffect(() => {
    // Debug log
    console.log('HeroThree mounted');

    // Add scroll event listener
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const scrollThreshold = window.innerHeight * 0.5; // 50% of viewport height
      
      // Set scrolled state (for CSS classes)
      if (scrollPosition > window.innerHeight * 0.1) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      // Calculate scroll progress (0 to 1)
      let progress = Math.min(scrollPosition / scrollThreshold, 1);
      // Apply easing function for smoother animation
      progress = Math.pow(progress, 0.8); // Slight ease-out effect
      
      // Only update if the change is significant to reduce re-renders
      if (Math.abs(progress - previousScrollProgress.current) > 0.01) {
        setScrollProgress(progress);
        previousScrollProgress.current = progress;
      }
    };

    window.addEventListener('scroll', handleScroll);

    window.addEventListener("mousedown", (e) => {
      const color = hightlightColors.shift();
      document.documentElement.style.setProperty("--highlight-color", color);
      hightlightColors.push(color);
    });
    
    // Call once on mount to initialize
    handleScroll();

    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <div className={`hero-three-container`}>
      <CanvasWrapper scrollProgress={scrollProgress} />
    </div>
  )
}

export default HeroThree
