import React from 'react';

const ExperienceItem = ({ date, title, description, link }) => (
  <li className="mb-10 ms-4">
    <div className="absolute w-3 h-3 bg-gray-200 rounded-full mt-1.5 -start-1.5 border border-white dark:border-gray-900 dark:bg-gray-700"></div>
    <time className="mb-1 text-sm font-normal leading-none text-gray-500">{date}</time>
    <h3 className="text-lg font-semibold text-white">{title}</h3>
    <p className="mb-4 text-base font-normal" style={{ color: '#cfdbe8' }}>{description}</p>
    {link && (
      <a 
        href={link.url} 
        target="_blank" 
        rel="noopener noreferrer" 
        className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-400 bg-gray-800 border border-gray-600 rounded-lg hover:bg-gray-700 hover:text-white focus:z-10 focus:ring-4 focus:outline-none focus:ring-gray-700 focus:text-white"
      >
        {link.text} 
        <svg className="w-3 h-3 ms-2 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
        </svg>
      </a>
    )}
  </li>
);

const ExperienceTimeline = ({ experiences }) => {
  return (
    <ol className="relative border-s border-gray-200 dark:border-gray-700">
      {experiences.map((experience, index) => (
        <ExperienceItem 
          key={index}
          date={experience.date}
          title={experience.title}
          description={experience.description}
          link={experience.link}
        />
      ))}
    </ol>
  );
};

export default ExperienceTimeline;
