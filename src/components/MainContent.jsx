import React, { Suspense, useEffect, useState } from 'react';
import WordCloud from './WordCloud';
import { serviceCards, projects, experiences } from '../constants';
import TiltCard from './TiltCard';
import ScrollSection from './ScrollSection';
import HeroThree from './HeroThree';
import TradingViewWidget from './TVEmbed';
import ProjectCard from './ProjectCard';
import ProjectModal from './ProjectModal';
import ExperienceTimeline from './ExperienceTimeline';
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
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Professional Experience</h2>
                    <ExperienceTimeline experiences={experiences} />
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
