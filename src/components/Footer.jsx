import React, { useState } from 'react';
import { attributions } from '../constants';
import './Footer.css';

function Footer() {
    const [expandedCategory, setExpandedCategory] = useState(null);

    const toggleCategory = (category) => {
        if (expandedCategory === category) {
            setExpandedCategory(null);
        } else {
            setExpandedCategory(category);
        }
    };

    const currentYear = new Date().getFullYear();

    return (
        <footer className="footer-container bg-gray-800/94 rounded-lg shadow-sm m-4 z-10 relative mt-auto">
            <div className="w-full mx-auto max-w-screen-xl p-4 md:flex md:flex-col">
                {/* Main footer content */}
                <div className="md:flex md:items-center md:justify-between mb-6">
                    <span className="text-sm text-gray-400 sm:text-center">
                        {currentYear} Michael Greene. All Rights Reserved.
                    </span>
                    <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-400 sm:mt-0">
                        <li>
                            <a href="#about" className="hover:underline me-4 md:me-6">About</a>
                        </li>
                        <li>
                            <a href="#projects" className="hover:underline me-4 md:me-6">Projects</a>
                        </li>
                        <li>
                            <a href="#contact" className="hover:underline">Contact</a>
                        </li>
                    </ul>
                </div>
                
                {/* Attributions section */}
                <div className="attribution-section border-t border-gray-700 pt-4">
                    <h3 className="text-sm font-semibold text-gray-300 mb-3">Attributions</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {attributions.map((category, index) => (
                            <div key={index} className="attribution-category mb-4">
                                <button 
                                    onClick={() => toggleCategory(category.category)}
                                    className="flex items-center justify-between w-full text-left text-sm font-medium text-gray-400 hover:text-white p-2 rounded"
                                >
                                    <span>{category.category}</span>
                                    <svg 
                                        className={`w-4 h-4 transition-transform ${expandedCategory === category.category ? 'transform rotate-180' : ''}`} 
                                        fill="none" 
                                        stroke="currentColor" 
                                        viewBox="0 0 24 24" 
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                                    </svg>
                                </button>
                                
                                <div className={`attribution-items ${expandedCategory === category.category ? 'expanded' : ''}`}>
                                    <div className="mt-2 pl-2 border-l-2 border-gray-700">
                                        {category.items.map((item, itemIndex) => (
                                            <div key={itemIndex} className="attribution-item mb-2 text-xs">
                                                <a 
                                                    href={item.url} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {item.name}
                                                </a>
                                                <p className="text-gray-500">
                                                    by {item.author} • {item.license}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
