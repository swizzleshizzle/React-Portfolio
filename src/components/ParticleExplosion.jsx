import * as THREE from 'three'
import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'

// Particle explosion effect that triggers at the provided position
function ParticleExplosion({ position, colors, count = 100, onComplete, lifespan = 3 }) {
  const mesh = useRef()
  const startTime = useRef(Date.now())
  const completed = useRef(false)
  
  // Create particles once at component initialization
  const [positions, velocities, particleColors, sizes] = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const velocities = new Float32Array(count * 3)
    const particleColors = new Float32Array(count * 3)
    const sizes = new Float32Array(count)
    
    for (let i = 0; i < count; i++) {
      // All particles start at the explosion center
      positions[i * 3] = position.x
      positions[i * 3 + 1] = position.y
      positions[i * 3 + 2] = position.z
      
      // Generate particles in a uniform spherical distribution
      const u = Math.random()
      const v = Math.random()
      const theta = 2 * Math.PI * u
      const phi = Math.acos(2 * v - 1)
      
      // Calculate direction
      const x = Math.sin(phi) * Math.cos(theta)
      const y = Math.sin(phi) * Math.sin(theta)
      const z = Math.cos(phi)
      
      // Randomize speed based on particle type
      let speed;
      if (i % 5 === 0) {
        // Fast particles
        speed = 5 + Math.random() * 5
      } else if (i % 3 === 0) {
        // Medium particles
        speed = 3 + Math.random() * 3
      } else {
        // Slow particles
        speed = 1 + Math.random() * 2
      }
      
      // Set initial velocities
      velocities[i * 3] = x * speed
      velocities[i * 3 + 1] = y * speed
      velocities[i * 3 + 2] = z * speed
      
      // Distribute colors from the gradient
      let selectedColor;
      
      // Select colors with an even distribution
      if (i % 3 === 0) {
        selectedColor = colors.from;
      } else if (i % 3 === 1) {
        selectedColor = colors.via;
      } else {
        selectedColor = colors.to;
      }
      
      // Store colors
      particleColors[i * 3] = selectedColor.r
      particleColors[i * 3 + 1] = selectedColor.g
      particleColors[i * 3 + 2] = selectedColor.b
      
      // Vary the particle sizes for visual interest
      if (i % 10 === 0) {
        // Extra large particles
        sizes[i] = 0.3 + Math.random() * 0.2
      } else if (i % 4 === 0) {
        // Large particles
        sizes[i] = 0.2 + Math.random() * 0.1
      } else {
        // Standard particles
        sizes[i] = 0.1 + Math.random() * 0.1
      }
    }
    
    return [positions, velocities, particleColors, sizes]
  }, [position, count, colors])
  
  // Animation of particles
  useFrame(() => {
    if (completed.current) return
    
    const positionAttr = mesh.current.geometry.attributes.position
    const colorAttr = mesh.current.geometry.attributes.color
    const sizeAttr = mesh.current.geometry.attributes.size
    
    // Calculate elapsed time and progress (0 to 1)
    const elapsed = (Date.now() - startTime.current) / 1000
    const progress = Math.min(elapsed / lifespan, 1)
    
    // Update each particle
    for (let i = 0; i < count; i++) {
      // Add a slight gravity effect (particles fall downward)
      velocities[i * 3 + 1] -= 0.03
      
      // Apply drag/friction to slow particles gradually
      const drag = 0.99
      velocities[i * 3] *= drag
      velocities[i * 3 + 1] *= drag
      velocities[i * 3 + 2] *= drag
      
      // Update position based on velocity
      positionAttr.array[i * 3] += velocities[i * 3] * 0.1
      positionAttr.array[i * 3 + 1] += velocities[i * 3 + 1] * 0.1
      positionAttr.array[i * 3 + 2] += velocities[i * 3 + 2] * 0.1
      
      // Fade out particles in the last portion of their life
      if (progress > 0.7) {
        const fadeOutProgress = (progress - 0.7) / 0.3 // 0 to 1 during last 30% of life
        
        // Fade out colors
        colorAttr.array[i * 3 + 0] *= (1 - fadeOutProgress * 0.05)
        colorAttr.array[i * 3 + 1] *= (1 - fadeOutProgress * 0.05)
        colorAttr.array[i * 3 + 2] *= (1 - fadeOutProgress * 0.05)
        
        // Shrink particles
        sizeAttr.array[i] *= (1 - fadeOutProgress * 0.03)
      }
    }
    
    // Mark attributes as needing update
    positionAttr.needsUpdate = true
    colorAttr.needsUpdate = true
    sizeAttr.needsUpdate = true
    
    // Complete effect when lifespan is over
    if (progress >= 1 && !completed.current) {
      completed.current = true
      onComplete && onComplete()
    }
  })
  
  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={positions.length / 3}
          array={positions}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-color"
          count={particleColors.length / 3}
          array={particleColors}
          itemSize={3}
        />
        <bufferAttribute
          attach="attributes-size"
          count={sizes.length}
          array={sizes}
          itemSize={1}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.35}
        sizeAttenuation={true}
        vertexColors={true}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}

export default ParticleExplosion
