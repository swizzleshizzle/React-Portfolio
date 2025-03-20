import React, { useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import './ScrollReveal.css';

const ScrollSection = ({ 
  children, 
  id, 
  className = '', 
  threshold = 0.15, 
  triggerOnce = true,
  isHero = false,
  staggerChildren = false
}) => {
  const { ref, inView } = useInView({
    threshold,
    triggerOnce,
    rootMargin: '0px 0px -10% 0px', 
  });

  // Detect if children is HeroThree component by checking for className
  const hasHeroThree = React.Children.toArray(children).some(
    child => child?.props?.className?.includes('hero-three-container') || 
             (child?.props?.children && child?.props?.children?.props?.className?.includes('hero-three-container'))
  );

  const baseClass = `scroll-section ${isHero ? 'hero' : ''} ${hasHeroThree ? 'hero-three-section' : ''} ${className}`;
  const staggerClass = staggerChildren ? 'stagger-children' : '';
  
  return (
    <section 
      id={id} 
      ref={ref}
      className={`${baseClass} ${inView ? 'visible' : ''} ${staggerClass} ${inView && staggerChildren ? 'visible' : ''}`}
      style={isHero ? { display: 'flex', flexDirection: 'column' } : {}}
    >
      {children}
      
      {isHero && !hasHeroThree && (
        <div className="scroll-indicator" onClick={() => {
          const nextSection = document.getElementById(id).nextElementSibling;
          if (nextSection) {
            nextSection.scrollIntoView({ behavior: 'smooth' });
          }
        }}>
          ↓
        </div>
      )}
    </section>
  );
};

export default ScrollSection;
