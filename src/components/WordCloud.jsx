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
function ExplosionManager() {
  const [explosions, setExplosions] = useState([])
  
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
  
  return explosions.map(explosion => (
    <ParticleExplosion
      key={explosion.id}
      position={explosion.position}
      colors={GRADIENT_COLORS}
      count={100}
      lifespan={3}
      onComplete={() => handleExplosionComplete(explosion.id)}
    />
  ))
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
  
  const over = (e) => (e.stopPropagation(), setHovered(true))
  const out = () => setHovered(false)
  const click = (e) => {
    e.stopPropagation()
    setClicked(true)
    
    // Trigger explosion from the center
    if (window.triggerWordExplosion) {
      window.triggerWordExplosion(new THREE.Vector3(0, 0, 0))
    }
    
    // Vibrate device if supported (mobile haptic feedback)
    if (navigator.vibrate) {
      navigator.vibrate(50)
    }
  }
  
  // Change the mouse cursor on hover
  useEffect(() => {
    if (hovered) document.body.style.cursor = 'pointer'
    return () => (document.body.style.cursor = 'auto')
  }, [hovered])
  
  // Create animated gradient effect similar to the span element
  useFrame(({ clock }) => {
    if (ref.current) {
      if (hovered) {
        // Animated gradient effect 
        const t = (Math.sin(clock.getElapsedTime() * 0.5) + 1) * 0.5 // oscillate between 0 and 1
        
        // First half of the gradient (from -> via)
        if (t < 0.5) {
          const mappedT = t * 2 // Scale 0-0.5 to 0-1
          gradientColor.current.copy(GRADIENT_COLORS.from).lerp(GRADIENT_COLORS.via, mappedT)
        } 
        // Second half of the gradient (via -> to)
        else {
          const mappedT = (t - 0.5) * 2 // Scale 0.5-1 to 0-1
          gradientColor.current.copy(GRADIENT_COLORS.via).lerp(GRADIENT_COLORS.to, mappedT)
        }
        
        ref.current.material.color.lerp(gradientColor.current, 0.1)
      } else {
        // Not hovered - fade back to white
        ref.current.material.color.lerp(color.set('white'), 0.1)
      }
    }
  })
  
  return (
    <Billboard {...props}>
      <Text 
        ref={ref} 
        onPointerOver={over} 
        onPointerOut={out} 
        onClick={click}
        {...fontProps}
      >
        {children}
      </Text>
    </Billboard>
  )
}

function Cloud({ count = 4, radius = 20, customSkills = skills }) {
  // Create a count x count words with spherical distribution
  const words = useMemo(() => {
    const temp = []
    const spherical = new THREE.Spherical()
    const phiSpan = Math.PI / (count + 1)
    const thetaSpan = (Math.PI * 2) / count
    
    // Calculate total words needed
    const totalPositions = count * count
    
    // Use skills if available, or repeat if there are fewer skills than positions
    const skillsToUse = customSkills && customSkills.length ? 
      (customSkills.length >= totalPositions
        ? [...customSkills].sort(() => Math.random() - 0.5).slice(0, totalPositions)
        : Array(totalPositions).fill().map((_, i) => customSkills[i % customSkills.length]))
      : Array(totalPositions).fill().map((_, i) => `Skill ${i+1}`)
    
    let wordIndex = 0
    // Add randomization to the positions to avoid perfect grid alignment
    for (let i = 1; i < count + 1; i++) {
      for (let j = 0; j < count; j++) {
        // Add some randomness to the position for more natural spacing
        const jitter = 0.2
        const jitteredRadius = radius * (1 + (Math.random() * jitter * 2 - jitter))
        const jitteredPhi = phiSpan * i * (1 + (Math.random() * jitter * 0.5 - jitter * 0.25))
        const jitteredTheta = thetaSpan * j * (1 + (Math.random() * jitter * 0.5 - jitter * 0.25))
        
        temp.push([
          new THREE.Vector3().setFromSpherical(spherical.set(jitteredRadius, jitteredPhi, jitteredTheta)),
          skillsToUse[wordIndex++]
        ])
      }
    }
    return temp
  }, [count, radius, customSkills])
  
  return words.map(([pos, word], index) => <Word key={index} position={pos}>{word}</Word>)
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
  
  // Apply zoom limits and mobile constraints after the controls are initialized
  useEffect(() => {
    if (controlsRef.current) {
      // Set minimum and maximum distance (zoom limits)
      controlsRef.current.minDistance = 20;  // Closest you can zoom in
      controlsRef.current.maxDistance = 60;  // Furthest you can zoom out
      
      // Disable panning on mobile devices
      if (isMobile) {
        controlsRef.current.noPan = true;  // Disable panning on mobile
      }
    }
  }, [isMobile])
  
  return <TrackballControls 
    ref={controlsRef} 
    {...props} 
    noPan={isMobile} // Also set the prop directly
  />
}

function WordCloud({ customSkills, count = 11, radius = 25 }) {
  return (
    <div className="word-cloud-container" style={{ width: '100%', height: '500px', position: 'relative', overflow: 'hidden' }}>
      <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 40], fov: 90 }}>
        {/* Set background color to match the webpage */}
        <color attach="background" args={[BACKGROUND_COLOR]} />
        
        {/* Fog for depth perception */}
        <fog attach="fog" args={[BACKGROUND_COLOR, 25, 65]} />
        
        {/* Light sources */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={0.8} />
        
        {/* Star field background */}
        <StarField count={3000} />
        
        {/* Explosion manager */}
        <ExplosionManager />
        
        <Suspense fallback={null}>
          <RotatingContainer speed={0.1}>
            <Cloud count={count} radius={radius} customSkills={customSkills} />
          </RotatingContainer>
        </Suspense>
        
        
        {/* Use the custom controls with zoom limits */}
        <ZoomLimitedControls 
          rotateSpeed={2.5}
          zoomSpeed={1.2}
          panSpeed={0.8}
          // No need to specify min/max distance here as they're set in the component
        />
      </Canvas>
    </div>
  )
}

export default WordCloud
