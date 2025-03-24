import React, { Suspense, useEffect, useState } from 'react';
import WordCloud from './WordCloud';
import { serviceCards, projects, experiences } from '../constants';
import TiltCard from './TiltCard';
import ScrollSection from './ScrollSection';
import HeroThree from './HeroThree';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import ExperienceTimeline from './ExperienceTimeline';
import ContactForm from './ContactForm';
import SocialLinks from './SocialLinks';
import TradingViewWidget from './TVEmbed';
import { motion } from 'framer-motion';

const MainContent = () => {
    // Debug log to check component loading
    useEffect(() => {
        console.log('MainContent mounted');
    }, []);

    // State for the selected project modal
    const [selectedProject, setSelectedProject] = useState(null);

    // Function to handle project card click
    const handleProjectClick = (project) => {
        setSelectedProject(project);
    };

    // Function to close the modal
    const closeModal = () => {
        setSelectedProject(null);
    };

    return (
        <main className="relative">
            {/* Project Modal */}
            {selectedProject && (
                <ProjectModal 
                    project={selectedProject} 
                    onClose={closeModal} 
                />
            )}
            
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
                    <h2 className="text-3xl font-bold text-white mb-6">About Me</h2>
                    <div className="prose dark:prose-invert max-w-none">
                        <p className="mb-3 text-gray-300" style={{ color: '#cfdbe8' }}>As an inspired, early career software engineer, I am constantly looking for compelling opportunities to apply my skills and contribute to meaningful projects. Adapting to new technology is par for the course, and I welcome the challenge of learning new tools and frameworks.</p>
                        <p className="mb-3 text-gray-300" style={{ color: '#cfdbe8' }}>I am always looking for ways to expand my skillset and explore new opportunities in all fields of software development. Further developing my skillset contributes to one of the most rewarding aspects of my work, creating solutions that have a positive impact on people's lives.</p>
                        <p className="mb-3 text-gray-300" style={{ color: '#cfdbe8' }}>One of the sectors I have a particular passion for is Finance, and I love exploring the role software can play in the industry. For example, AI/ML trading algorithms with deep forensic analysis capabilities will likely have a disruptive impact on the industry, and I am excited to be a part of that.</p>
                        <p className="mb-3 text-gray-300" style={{ color: '#cfdbe8' }}>I am also a big fan of 3D graphics, and I love how they can be used to represent data in a more engaging way. To me, finding new and engaging ways to represent data is one of the most exciting aspects of software development.</p>
                        <br />
                        <p className="mb-3 text-gray-300" style={{ color: '#cfdbe8' }}>Normally I would just list out my skills, but why do that when I can make a 3D word cloud instead?</p>
                        <p className="mb-3 text-gray-300 flex justify-center" style={{ color: '#cfdbe8' }}>(Pssss... Click one!)</p>
                    </div>
                </ScrollSection>

                <ScrollSection id="skills">
                    {/* Word Cloud Component */}
                    <div className="my-0">
                        <h2 className="text-3xl font-bold text-white mb-8">My Skill Set</h2>
                        <Suspense fallback={<div className="py-8 text-center rounded-md bg-300% animate-gradient bg-gradient-to-r to-violet-600 via-green-300 from-sky-400">Loading Skills Cloud...</div>}>
                            <WordCloud count={6} radius={30} />
                        </Suspense>
                    </div>
                </ScrollSection>

                <ScrollSection id="services" >
                    <h2 className="text-3xl font-bold text-white mb-8">What I Do</h2>

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
                    <h2 className="text-3xl font-bold text-white mb-8">Recent Projects</h2>

                    <div className="grid md:grid-cols-2 gap-8">
                        {projects.map(project => (
                            <ProjectCard
                                key={project.id}
                                project={project}
                                onClick={handleProjectClick}
                            />
                        ))}
                    </div>
                </ScrollSection>

                <ScrollSection id="experience" staggerChildren={true}>
                    <h2 className="text-3xl font-bold text-white mb-8">Professional Experience</h2>
                    <ExperienceTimeline experiences={experiences} />
                </ScrollSection>
                
                <ScrollSection id="contact" staggerChildren={true}>
                    <h2 className="text-3xl font-bold text-white mb-8">Contact Me</h2>
                    <div className="flex flex-col md:flex-row gap-8 items-start">
                        <div className="w-full md:w-1/2">
                            <p className="text-lg dark:text-gray-300 mb-6" style={{ color: '#cfdbe8' }}>
                                I'm always open to discussing new projects, creative ideas, or opportunities to be part of your vision. Feel free to reach out using the form below.
                            </p>
                            <div className="bg-indigo-900 dark:bg-indigo-900/0 p-6 rounded-lg mb-6">
                                <h3 className="text-xl font-semibold text-white mb-3">Contact Information</h3>
                                <div className="space-y-3 flex flex-col items-center">
                                    <p className="flex items-center text-gray-300"><a className="flex items-center text-gray-300" href="mailto:michael.greene.pro@gmail.com">
                                        <svg className="w-5 h-5 mr-3 text-indigo-400 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                        </svg>
                                        michael.greene.pro@gmail.com
                                    </a></p>
                                    <p className="flex items-center text-gray-300">
                                        <svg className="w-5 h-5 mr-3 text-indigo-400 dark:text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                                        </svg>
                                        Pittsburgh, PA, USA
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full md:w-1/2">
                            <ContactForm />
                        </div>
                    </div>
                </ScrollSection>
                <ScrollSection id="tvembed">
                    <div>
                    </div>
                </ScrollSection>
            </div>
            
            {/* Social Media Links */}
            <SocialLinks />
        </main>
    );
};

export default MainContent;
