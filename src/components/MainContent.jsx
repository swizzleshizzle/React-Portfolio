import React from 'react';
import { Link } from 'react-router-dom';
//import { Tech } from './Tech';
//import { StarsCanvas } from './canvas/Stars.jsx';

function MainContent() {
    return (
        <main>

            <h1 class="object-center mb-4 text-3xl font-extrabold text-gray-900 dark:text-white md:text-5xl lg:text-6xl"><span class="text-transparent bg-clip-text bg-300% animate-gradient bg-gradient-to-r to-violet-600 via-green-300 from-sky-400">Michael Greene</span> <br></br><span class="text-transparent bg-clip-text bg-300% animate-gradient bg-gradient-to-r to-sky-400 via-green-300 from-violet-600">Full Stack Dev</span></h1>

            <p class="mb-3 text-gray-500 dark:text-gray-400">I am a full-stack developer with expertise in Java, Javascript, React, Node.js, Python, PHP, and SQL, specializing in building dynamic, data-driven applications. With a strong foundation in backend and frontend development, I create efficient, scalable solutions for web-based platforms, automation, and financial analytics.</p>
            <div class="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div class="col-span-2">
                    <br></br>
                    <p class="mb-3 text-gray-500 dark:text-gray-400">In addition to software development, I have six years of experience in financial markets, specializing in Stocks, Options, Futures, and Crypto. I’ve developed a proprietary Fibonacci Moving Average indicator, which I teach through my trading course designed for beginner traders. My background in both trading and technology allows me to develop custom trading tools, automate market strategies, and enhance data-driven decision-making.</p>
                    <br></br>

                    <p class="mb-3 text-gray-500 dark:text-gray-400">I am continuously expanding my skillset and seeking opportunities in software development, fintech, and quantitative trading, aiming to integrate advanced technology with financial markets.</p>
                    
                </div>


                <ul class="mb-3 text-gray-500 dark:text-gray-400">
                    <li><a href="#" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">

                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Web Development</h5>
                        <p class="font-normal text-gray-700 dark:text-gray-400">Building interactive and responsive front-end interfaces with React and robust backend systems with Node.js and PHP.</p>
                    </a></li>
                    <li><a href="#" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">

                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Database Management</h5>
                        <p class="font-normal text-gray-700 dark:text-gray-400">Designing and optimizing SQL databases for secure and efficient data storage.</p>
                    </a></li>
                    <li><a href="#" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">

                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Automation &amp; Data Analysis</h5>
                        <p class="font-normal text-gray-700 dark:text-gray-400">Designing and optimizing SQL databases for secure and efficient data storage.</p>
                    </a></li>
                    <li><a href="#" class="block max-w-sm p-6 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700">

                        <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">Quantum Computing</h5>
                        <p class="font-normal text-gray-700 dark:text-gray-400">Designing and optimizing SQL databases for secure and efficient data storage.</p>
                    </a></li>
                    </ul>

            </div>


            <br></br>
            <br></br>
            <br></br>


            <ol class="relative border-s border-gray-200 dark:border-gray-700">
                <li class="mb-10 ms-4">
                    <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                    <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">February 2022</time>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Application UI code in Tailwind CSS</h3>
                    <p class="mb-4 text-base font-normal text-gray-500 dark:text-gray-400">Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order E-commerce & Marketing pages.</p>
                    <a href="#" class="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-100 focus:text-blue-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 dark:focus:ring-gray-700">Learn more <svg class="w-3 h-3 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                    </svg></a>
                </li>
                <li class="mb-10 ms-4">
                    <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                    <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">March 2022</time>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Marketing UI design in Figma</h3>
                    <p class="text-base font-normal text-gray-500 dark:text-gray-400">All of the pages and components are first designed in Figma and we keep a parity between the two versions even as we update the project.</p>
                </li>
                <li class="ms-4">
                    <div class="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
                    <time class="mb-1 text-sm font-normal leading-none text-gray-400 dark:text-gray-500">April 2022</time>
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">E-Commerce UI code in Tailwind CSS</h3>
                    <p class="text-base font-normal text-gray-500 dark:text-gray-400">Get started with dozens of web components and interactive elements built on top of Tailwind CSS.</p>
                </li>
            </ol>
            
        </main>
    );
}


export default MainContent;
