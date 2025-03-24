import React, { useRef, useState, useEffect } from 'react';

// Card component with 3D tilt effect
const TiltCard = ({ title, description, icon, children }) => {
    const cardRef = useRef(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const [lastMousePosition, setLastMousePosition] = useState(null);
    const [shouldReset, setShouldReset] = useState(false);
    const lastInteractionTimeRef = useRef(Date.now());
    const animationFrameRef = useRef(null);
    
    // Handle mouse move to create the tilt effect
    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        
        // Update last interaction time
        lastInteractionTimeRef.current = Date.now();
        setShouldReset(false);
        
        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        
        // Calculate mouse position relative to card center
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        // Calculate distance from center as a percentage of card dimensions
        const distanceX = Math.abs(mouseX) / (rect.width / 2);
        const distanceY = Math.abs(mouseY) / (rect.height / 2);
        
        // Check if mouse is too far from card (more than 2x the card's dimensions away)
        const maxDistance = 2.0; // Maximum allowed distance multiplier
        if (distanceX > maxDistance || distanceY > maxDistance) {
            // If too far, don't update tilt
            return;
        }
        
        // Apply distance limiting - clamp values to acceptable range
        const clampedMouseX = Math.max(-rect.width, Math.min(rect.width, mouseX));
        const clampedMouseY = Math.max(-rect.height, Math.min(rect.height, mouseY));
        
        // Save last mouse position
        setLastMousePosition({ x: clampedMouseX, y: clampedMouseY });
        
        // Calculate rotation (stronger when closer to edges)
        const rotateX = (clampedMouseY / (rect.height / 2)) * -10; // Inverted Y for natural tilt
        const rotateY = (clampedMouseX / (rect.width / 2)) * 10;
        
        // Calculate slight position shift
        const posX = (clampedMouseX / rect.width) * 5;
        const posY = (clampedMouseY / rect.height) * 5;
        
        // Apply smoothed rotation and position
        setRotation({ x: rotateX, y: rotateY });
        setPosition({ x: posX, y: posY });
    };
    
    // Handle mouse enter
    const handleMouseEnter = () => {
        setIsHovered(true);
        lastInteractionTimeRef.current = Date.now();
        setShouldReset(false);
        
    };
    
    // Handle mouse leave
    const handleMouseLeave = () => {
        setIsHovered(false);
        lastInteractionTimeRef.current = Date.now();
        //setShouldReset(true);
    };
    
    // Animation loop to check for inactivity and handle reset
    useEffect(() => {
        const checkInactivity = () => {
            const now = Date.now();
            const timeSinceLastInteraction = now - lastInteractionTimeRef.current;
            
            // If card is tilted and inactive for 2 seconds and not being hovered
            const hasTilt = Math.abs(rotation.x) > 0.1 || Math.abs(rotation.y) > 0.1 || 
                          Math.abs(position.x) > 0.1 || Math.abs(position.y) > 0.1;
                          
            if (hasTilt && timeSinceLastInteraction > 200 && !isHovered && !shouldReset) {
                // Start reset animation
                setShouldReset(true);
            }
            
            // Continue the animation loop
            animationFrameRef.current = requestAnimationFrame(checkInactivity);
        };
        
        // Start the animation loop
        animationFrameRef.current = requestAnimationFrame(checkInactivity);
        
        // Clean up
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [rotation.x, rotation.y, position.x, position.y, isHovered, shouldReset]);
    
    // Handle the reset animation when shouldReset is true
    useEffect(() => {
        if (!shouldReset) return;
        
        const resetAnimation = () => {
            setRotation(prev => ({
                x: prev.x * 0.9,
                y: prev.y * 0.9
            }));
            
            setPosition(prev => ({
                x: prev.x * 0.9,
                y: prev.y * 0.9
            }));
            
            // Check if animation is complete
            if (Math.abs(rotation.x) <= 0.1 && Math.abs(rotation.y) <= 0.1 && 
                Math.abs(position.x) <= 0.1 && Math.abs(position.y) <= 0.1) {
                // Animation complete, set to exact zero
                setRotation({ x: 0, y: 0 });
                setPosition({ x: 0, y: 0 });
                setShouldReset(false);
            } else {
                // Continue animation
                animationFrameRef.current = requestAnimationFrame(resetAnimation);
            }
        };
        
        // Start reset animation
        animationFrameRef.current = requestAnimationFrame(resetAnimation);
        
        // Clean up
        return () => {
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, [shouldReset, rotation.x, rotation.y, position.x, position.y]);
    
    // Shadow and glow effects based on tilt
    const calculateShadow = () => {
        const shadowX = rotation.y * -0.5;
        const shadowY = rotation.x * 0.5;
        const blur = isHovered ? 20 : 10;
        const opacity = isHovered ? 0.4 : 0.2;
        return `${shadowX}px ${shadowY}px ${blur}px rgba(0, 0, 0, ${opacity})`;
    };
    
    return (
        <div
            ref={cardRef}
            className="relative block p-6 bg-gray-800 border border-gray-700 rounded-lg shadow-sm cursor-pointer overflow-hidden transform-gpu"
            style={{
                transform: `perspective(1200px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateX(${position.x}px) translateY(${position.y}px)`,
                boxShadow: calculateShadow(),
                transition: 'box-shadow 0.3s ease-out'
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Glowing gradient overlay */}
            <div 
                className="absolute inset-0 transition-opacity duration-300 ease-in-out rounded-lg pointer-events-none"
                style={{ 
                    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(56, 189, 248, 0.2))',
                    opacity: isHovered ? 0.6 : 0.2,
                    transform: `perspective(1200px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                    zIndex: 5 // Lower z-index for the overlay
                }}
            />
            
            {/* Content */}
            {children ? (
                <div className="relative" style={{ zIndex: 10 }}>
                    {children}
                </div>
            ) : (
                <>
                    {icon && (
                        <div className="flex justify-center mb-4 relative z-10">
                            <img 
                                src={icon} 
                                alt={`${title} icon`} 
                                className="w-16 h-16 object-contain"
                            />
                        </div>
                    )}
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-white relative z-10">
                        {title}
                    </h5>
                    <p className="font-normal text-gray-400 relative z-10">
                        {description}
                    </p>
                </>
            )}
        </div>
    );
};

export default TiltCard;
