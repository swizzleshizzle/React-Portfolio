import React, { useRef, useState, useEffect } from 'react';

// Card component with 3D tilt effect
const TiltCard = ({ title, description, icon, children }) => {
    const cardRef = useRef(null);
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovered, setIsHovered] = useState(false);
    
    // Handle mouse move to create the tilt effect
    const handleMouseMove = (e) => {
        if (!cardRef.current) return;
        
        const card = cardRef.current;
        const rect = card.getBoundingClientRect();
        
        // Calculate mouse position relative to card center
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        // Calculate rotation (stronger when closer to edges)
        const rotateX = (mouseY / (rect.height / 2)) * -10; // Inverted Y for natural tilt
        const rotateY = (mouseX / (rect.width / 2)) * 10;
        
        // Calculate slight position shift
        const posX = (mouseX / rect.width) * 5;
        const posY = (mouseY / rect.height) * 5;
        
        // Apply smoothed rotation and position
        setRotation({ x: rotateX, y: rotateY });
        setPosition({ x: posX, y: posY });
    };
    
    // Smooth reset when mouse leaves
    const handleMouseLeave = () => {
        setIsHovered(false);
        
        // Animate back to flat position
        const resetAnimation = () => {
            setRotation(prev => ({
                x: prev.x * 0.9,
                y: prev.y * 0.9
            }));
            
            setPosition(prev => ({
                x: prev.x * 0.9,
                y: prev.y * 0.9
            }));
            
            // Continue animation until nearly flat
            if (Math.abs(rotation.x) > 0.1 || Math.abs(rotation.y) > 0.1 || 
                Math.abs(position.x) > 0.1 || Math.abs(position.y) > 0.1) {
                requestAnimationFrame(resetAnimation);
            } else {
                setRotation({ x: 0, y: 0 });
                setPosition({ x: 0, y: 0 });
            }
        };
        
        requestAnimationFrame(resetAnimation);
    };
    
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
            className="relative block p-6 bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 cursor-pointer overflow-hidden transition-all duration-200 ease-out transform-gpu"
            style={{
                transform: `perspective(1200px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg) translateX(${position.x}px) translateY(${position.y}px)`,
                boxShadow: calculateShadow(),
                transition: isHovered ? 'none' : 'all 0.5s ease-out'
            }}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={handleMouseLeave}
        >
            {/* Glowing gradient overlay */}
            <div 
                className="absolute inset-0 opacity-0 transition-opacity duration-300 ease-in-out rounded-lg"
                style={{ 
                    background: 'linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(56, 189, 248, 0.2))',
                    opacity: isHovered ? 0.6 : 0,
                    transform: `perspective(1200px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`
                }}
            />
            
            {/* Content */}
            {children ? children : (
                <>
                    <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white relative z-10">
                        {title}
                    </h5>
                    <p className="font-normal text-gray-700 dark:text-gray-400 relative z-10">
                        {description}
                    </p>
                </>
            )}
        </div>
    );
};

export default TiltCard;
