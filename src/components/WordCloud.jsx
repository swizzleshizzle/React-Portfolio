import * as THREE from 'three'
import { useRef, useState, useMemo, useEffect, Suspense } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Billboard, Text, TrackballControls } from '@react-three/drei'
import { skills } from '../constants'
import StarField from './StarField'
import ParticleExplosion from './ParticleExplosion'

// Background color that matches the dark theme of the website
const BACKGROUND_COLOR = 'rgba(36, 36, 36, 0)'; // Fully transparent

// Gradient colors from the span element
const GRADIENT_COLORS = {
  from: new THREE.Color('#7c3aed'), // violet-600
  via: new THREE.Color('#86efac'),  // green-300
  to: new THREE.Color('#38bdf8'),   // sky-400
}

// Centralized explosion manager
function ExplosionManager({ totalClicked, totalSkills }) {
  const [explosions, setExplosions] = useState([])
  const [celebrationTriggered, setCelebrationTriggered] = useState(false)
  
  // Function to create a new explosion
  const triggerExplosion = (position) => {
    const id = Date.now()
    setExplosions(prev => [...prev, { id, position }])
  }
  
  // Remove explosion when complete
  const handleExplosionComplete = (id) => {
    setExplosions(prev => prev.filter(explosion => explosion.id !== id))
  }
  
  // Register the trigger function with the scene
  useEffect(() => {
    window.triggerWordExplosion = triggerExplosion
    return () => {
      delete window.triggerWordExplosion
    }
  }, [])

  // Trigger celebration when all skills are clicked
  useEffect(() => {
    if (totalClicked === totalSkills && totalSkills > 0 && !celebrationTriggered) {
      setCelebrationTriggered(true)
      
      // Create multiple explosions at different positions
      const explosionCount = 10
      for (let i = 0; i < explosionCount; i++) {
        setTimeout(() => {
          const randomPos = new THREE.Vector3(
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30,
            (Math.random() - 0.5) * 30
          )
          triggerExplosion(randomPos)
        }, i * 200) // Stagger the explosions
      }
      
      // Vibrate device if supported (mobile haptic feedback)
      if (navigator.vibrate) {
        navigator.vibrate([100, 50, 100, 50, 200])
      }
    }
  }, [totalClicked, totalSkills, celebrationTriggered])
  
  return explosions.map(explosion => (
    <ParticleExplosion
      key={explosion.id}
      position={explosion.position}
      colors={GRADIENT_COLORS}
      count={150}
      lifespan={3}
      onComplete={() => handleExplosionComplete(explosion.id)}
    />
  ))
}

// Counter display in the center of the word cloud
function SkillCounter({ current, total }) {
  const ref = useRef()
  
  // Pulse animation for the counter
  useFrame(({ clock }) => {
    if (ref.current) {
      const pulse = Math.sin(clock.getElapsedTime() * 2) * 0.1 + 1
      ref.current.scale.set(pulse, pulse, pulse)
      
      // Rotate slightly for visual interest
      ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1
    }
  })
  
  return (
    <Billboard position={[0, 0, 0]}>
      <Text
        ref={ref}
        fontSize={5}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.1}
        outlineColor="#000000"
      >
        {current}/{total}
      </Text>
    </Billboard>
  )
}

// Timer component that shows elapsed time
function Timer({ startTime, isComplete }) {
  const [elapsedTime, setElapsedTime] = useState(0);
  const ref = useRef()
  
  // Pulse animation for the counter
  useFrame(({ clock }) => {
    if (ref.current) {
      const pulse = Math.sin(clock.getElapsedTime() * 2) * 0.1 + 1
      ref.current.scale.set(pulse, pulse, pulse)
      
      // Rotate slightly for visual interest
      ref.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.5) * 0.1
    }
  })
  
  useEffect(() => {
    let interval;
    
    if (startTime && !isComplete) {
      // Update the timer every 100ms
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime)));
      }, 100);
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [startTime, isComplete]);
  
  // Format the time as mm:ss
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60000);
    const secs = Math.floor((seconds % 60000)/1000);
    const msecs = Math.floor((seconds % 1000)/10)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}:${msecs.toString().padStart(2, '0')}`;
  };
  
  return (
    <Billboard position={[0, -4, 0]}>
      <Text
        color="white"
        fontSize={1.5}
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        ref={ref}
        anchorX="center"
        anchorY="center"
        outlineWidth={0.1}
        outlineColor="#000000"
      >
        Time: {formatTime(elapsedTime)}
      </Text>
    </Billboard>
  );
}

function Word({ children, ...props }) {
  const color = new THREE.Color()
  const gradientColor = useRef(new THREE.Color(1, 1, 1)) // white by default
  const fontProps = { 
    fontSize: 2.5, 
    letterSpacing: -0.05, 
    lineHeight: 1, 
    'material-toneMapped': false 
  }
  const ref = useRef()
  const [hovered, setHovered] = useState(false)
  const [clicked, setClicked] = useState(false)
  
  // Increase the hit area for better click detection
  const hitAreaScale = 1.5;
  
  const over = (e) => {
    e.stopPropagation();
    setHovered(true);
  }
  
  const out = () => setHovered(false)
  
  const click = (e) => {
    e.stopPropagation();
    
    // Only register click if not already clicked
    if (!clicked) {
      setClicked(true);
      
      // Trigger explosion from the center
      if (window.triggerWordExplosion) {
        window.triggerWordExplosion(new THREE.Vector3(0, 0, 0));
      }
      
      // Vibrate device if supported (mobile haptic feedback)
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
      
      // Notify parent component that a skill was clicked
      if (props.onSkillClick) {
        props.onSkillClick(children);
      }
    }
  }
  
  // Change the mouse cursor on hover
  useEffect(() => {
    if (hovered && !clicked) document.body.style.cursor = 'pointer';
    else if (clicked) document.body.style.cursor = 'default';
    return () => (document.body.style.cursor = 'auto');
  }, [hovered, clicked]);
  
  // Create animated gradient effect similar to the span element
  useFrame(({ clock }) => {
    if (ref.current) {
      if (clicked) {
        // Keep the current gradient color when clicked
        // No animation needed as we want to preserve the color
      } else if (hovered) {
        // Animated gradient effect 
        const t = (Math.sin(clock.getElapsedTime() * 0.5) + 1) * 0.5; // oscillate between 0 and 1
        
        // First half of the gradient (from -> via)
        if (t < 0.5) {
          const mappedT = t * 2; // Scale 0-0.5 to 0-1
          gradientColor.current.copy(GRADIENT_COLORS.from).lerp(GRADIENT_COLORS.via, mappedT);
        } 
        // Second half of the gradient (via -> to)
        else {
          const mappedT = (t - 0.5) * 2; // Scale 0.5-1 to 0-1
          gradientColor.current.copy(GRADIENT_COLORS.via).lerp(GRADIENT_COLORS.to, mappedT);
        }
        
        ref.current.material.color.lerp(gradientColor.current, 0.1);
      } else {
        // Not hovered - fade back to white
        ref.current.material.color.lerp(color.set('white'), 0.1);
      }
    }
  });
  
  return (
    <Billboard {...props}>
      <group>
        {/* Invisible hit area for better click detection */}
        <mesh
          onPointerOver={over}
          onPointerOut={out}
          onClick={click}
          visible={false}
        >
          <boxGeometry args={[4 * hitAreaScale, 2 * hitAreaScale, 0.1]} />
          <meshBasicMaterial transparent opacity={0} />
        </mesh>
        
        <Text 
          ref={ref} 
          onPointerOver={over} 
          onPointerOut={out} 
          onClick={click}
          {...fontProps}
        >
          {children}
        </Text>
      </group>
    </Billboard>
  );
}

function Cloud({ count = 4, radius = 20, customSkills = skills, onSkillClick }) {
  // Create a count x count words with spherical distribution
  const words = useMemo(() => {
    const temp = []
    
    // Use all skills provided
    const skillsToUse = [...customSkills];
    
    // Shuffle the skills array to randomize positions
    const shuffledSkills = [...skillsToUse].sort(() => Math.random() - 0.5);
    
    // Calculate positions for a spherical distribution
    const numSkills = shuffledSkills.length;
    
    // Ensure we don't divide by zero
    if (numSkills <= 1) {
      if (numSkills === 1) {
        temp.push([new THREE.Vector3(0, 0, 0), shuffledSkills[0]]);
      }
      return temp;
    }
    
    // Use the Fibonacci sphere algorithm for even distribution
    const offset = 2.0 / numSkills;
    const increment = Math.PI * (3.0 - Math.sqrt(5.0)); // golden angle
    
    for (let i = 0; i < numSkills; i++) {
      const y = ((i * offset) - 1) + (offset / 2);
      const r = Math.sqrt(1 - y * y);
      const phi = i * increment;
      
      const x = Math.cos(phi) * r;
      const z = Math.sin(phi) * r;
      
      // Add some jitter for a more natural look
      const jitter = 0.1;
      const jitterX = (Math.random() * 2 - 1) * jitter;
      const jitterY = (Math.random() * 2 - 1) * jitter;
      const jitterZ = (Math.random() * 2 - 1) * jitter;
      
      const position = new THREE.Vector3(
        x * radius + jitterX * radius,
        y * radius + jitterY * radius,
        z * radius + jitterZ * radius
      );
      
      // Add to our words array
      temp.push([position, shuffledSkills[i]]);
    }
    
    return temp;
  }, [radius, customSkills]);
  
  return words.map(([pos, word], index) => (
    <Word 
      key={`word-${index}-${word}`} 
      position={pos} 
      onSkillClick={onSkillClick}
    >
      {word}
    </Word>
  ));
}

// This component adds a slow rotation to the whole word cloud
function RotatingContainer({ children, speed = 0.2 }) {
  const groupRef = useRef()
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * speed
    }
  })
  
  return <group ref={groupRef}>{children}</group>
}

// Custom controls component with zoom limits
function ZoomLimitedControls(props) {
  const controlsRef = useRef()
  const { size } = useThree()
  const [isMobile, setIsMobile] = useState(false)
  
  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      const mobileCheck = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
      // Alternative check based on screen size
      const smallScreen = window.innerWidth <= 768
      setIsMobile(mobileCheck || smallScreen)
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])
  
  return (
    <TrackballControls
      ref={controlsRef}
      enabled={!isMobile} // Disable controls on mobile
      minDistance={20}
      maxDistance={60}
      rotateSpeed={2}
      zoomSpeed={1}
      panSpeed={0.5}
      {...props}
    />
  )
}

// Main component
function WordCloud({ customSkills, count = 0, radius = 25 }) {
  const [clickedSkills, setClickedSkills] = useState([]);
  const [startTime, setStartTime] = useState(null);
  const [completionTime, setCompletionTime] = useState(null);
  
  // Use all available skills by default
  const skillsToUse = useMemo(() => customSkills || skills, [customSkills]);
  const totalSkillCount = skillsToUse.length;
  
  // Dynamically calculate count based on the number of skills
  const dynamicCount = useMemo(() => {
    if (count > 0) return count;
    // Calculate a reasonable grid size based on the number of skills
    return Math.ceil(Math.sqrt(totalSkillCount));
  }, [count, skillsToUse]);
  
  const handleSkillClick = (skill) => {
    // Start the timer on first click if not already started
    if (!startTime) {
      setStartTime(Date.now());
    }
    
    setClickedSkills(prev => {
      if (!prev.includes(skill)) {
        const newClickedSkills = [...prev, skill];
        
        // If all skills are clicked, record the completion time
        if (newClickedSkills.length === totalSkillCount) {
          setCompletionTime(Date.now());
        }
        
        return newClickedSkills;
      }
      return prev;
    });
  };
  
  // Check if all skills have been clicked
  const isComplete = clickedSkills.length === totalSkillCount;
  
  return (
    <div className="word-cloud-container h-[600px] w-full relative">
      <Canvas
        camera={{ position: [0, 0, 60], fov: 75 }}
        style={{ background: BACKGROUND_COLOR }}
        dpr={[1, 2]} // Responsive DPR for better performance
      >
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1} />
        <Suspense fallback={null}>
          
          <RotatingContainer>
            <Cloud 
              count={dynamicCount} 
              radius={radius} 
              customSkills={skillsToUse}
              onSkillClick={handleSkillClick}
            />
            {clickedSkills.length > 0 && (
              <>
                <SkillCounter current={clickedSkills.length} total={totalSkillCount} />
                <Timer startTime={startTime} isComplete={isComplete} />
              </>
            )}
          </RotatingContainer>
          <ExplosionManager 
            totalClicked={clickedSkills.length} 
            totalSkills={totalSkillCount} 
          />
        </Suspense>
        <ZoomLimitedControls />
      </Canvas>
    </div>
  )
}

export default WordCloud
