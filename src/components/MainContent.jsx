import React, { Suspense, useEffect } from 'react';
import WordCloud from './WordCloud';
import { serviceCards } from '../constants';
import TiltCard from './TiltCard';
import ScrollSection from './ScrollSection';
import HeroThree from './HeroThree';
import TradingViewWidget from './TVEmbed';

const MainContent = () => {
    // Debug log to check component loading
    useEffect(() => {
        console.log('MainContent mounted');
    }, []);

    return (
        <main className="relative">
            {/* Hero Section - Shown first in the center */}
            <ScrollSection id="hero" isHero={true}>
                <div className="w-full h-full">
                    <HeroThree />
                </div>
            </ScrollSection>

            {/* Content container for everything except hero */}
            <div className="container mx-auto px-4">
                {/* About Section */}
                <ScrollSection id="about">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">About Me</h2>
                    <div className="prose dark:prose-invert max-w-none">
                        <p className="mb-3 text-gray-500 dark:text-white">As an inspired, early career software engineer, I am constantly looking for compelling opportunities to apply my skills and contribute to meaningful projects. Adapting to new technology is par for the course, and I welcome the challenge of learning new tools and frameworks.</p>
                        <p className="mb-3 text-gray-500 dark:text-white">I am continuously expanding my skillset and seeking new opportunities in all fields of software development, including web development, mobile development, and data analysis. One of the most rewarding aspects of my work is the ability to create something that can have a positive impact on people's lives.</p>
                        <p className="mb-3 text-gray-500 dark:text-white">One of the sectors I have a particular passion for is Finance, and I love exploring the role software can play in the industry. AI/ML with deep forensic analysis will likely have a disruptive impact on the industry, and I am excited to be a part of that.</p>
                        <p className="mb-3 text-gray-500 dark:text-white">I am also a big fan of 3D graphics, and I love how they can be used to represent data in a more engaging way. Like 3D Audio visualizers, or 3D representations of user interfaces in AR/VR.</p>
                        <br />
                        <p className="mb-3 text-gray-500 dark:text-white">Normally I would just list out my skills, but why do that when I can make them spin around in 3D instead?</p>
                    </div>
                </ScrollSection>

                <ScrollSection id="skills">
                    {/* Word Cloud Component */}
                    <div className="my-0">
                        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">My Skill Set</h2>
                        <Suspense fallback={<div className="py-8 text-center rounded-md bg-300% animate-gradient bg-gradient-to-r to-violet-600 via-green-300 from-sky-400">Loading Skills Cloud...</div>}>
                            <WordCloud count={6} radius={30} />
                        </Suspense>
                    </div>
                </ScrollSection>

                <ScrollSection id="services" >
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">What I Do</h2>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {serviceCards.map(card => (
                            <TiltCard
                                key={card.id}
                                title={card.title}
                                description={card.description}
                                icon={card.icon}
                            />
                        ))}
                    </div>
                </ScrollSection>

                <ScrollSection id="projects" staggerChildren={true}>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Recent Projects</h2>


                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                            <img src="/project1.jpg" alt="Project 1" className="w-full h-48 object-cover" />
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Algorithmic Trading Platform</h3>
                                <p className="text-gray-700 dark:text-gray-400 mb-4">A comprehensive platform for developing, testing, and deploying trading algorithms with real-time market data integration.</p>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm">React</span>
                                    <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm">Node.js</span>
                                    <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm">WebSockets</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                            <img src="/project2.jpg" alt="Project 2" className="w-full h-48 object-cover" />
                            <div className="p-6">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Financial Data Visualization Dashboard</h3>
                                <p className="text-gray-700 dark:text-gray-400 mb-4">Interactive dashboard for visualizing complex financial data sets with customizable charts and real-time filtering capabilities.</p>
                                <div className="flex gap-2">
                                    <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm">D3.js</span>
                                    <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm">Vue.js</span>
                                    <span className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded-full text-sm">Express</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </ScrollSection>

                <ScrollSection id="experience" staggerChildren={true}>
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Experience</h2>

                    <ol className="relative border-s border-gray-200 dark:border-gray-700">
                        <li className="mb-10 ms-4">
                            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                            <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">February 2022</time>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Application UI code in Tailwind CSS</h3>
                            <p className="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order E-commerce & Marketing pages.</p>
                            <a href="#" className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700">Learn more <svg className="w-3 h-3 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                            </svg></a>
                        </li>
                        <li className="mb-10 ms-4">
                            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                            <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">March 2022</time>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Marketing UI design in Figma</h3>
                            <p className="text-base font-normal text-gray-500 dark:text-gray-400">All of the pages and components are first designed in Figma and we keep a parity between the two versions even as we update the project.</p>
                        </li>
                        <li className="ms-4">
                            <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                            <time className="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">April 2022</time>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">E-Commerce UI code in Tailwind CSS</h3>
                            <p className="text-base font-normal text-gray-500 dark:text-gray-400">Get started with dozens of web components and interactive elements built on top of Tailwind CSS.</p>
                        </li>
                    </ol>
                </ScrollSection>
                <ScrollSection id="tvembed">
                    <div>
                    </div>
                </ScrollSection>
            </div>
            
        </main>
    );
};

export default MainContent;
