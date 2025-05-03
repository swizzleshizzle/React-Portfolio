import reactjs from "../assets/tech/reactjs.png"
import nodejs from "../assets/tech/nodejs.png"
import threejs from "../assets/tech/threejs.webp"
import aws from "../assets/tech/aws.png"
import ai from "../assets/tech/ai.png"
import stocks from "../assets/tech/stocks2.png"
import fma from "../assets/projectScreens/fma.png"
import portfolio from "../assets/projectScreens/portfolio.png"
import equilibrium from "../assets/projectScreens/eqgjg2.png" 

// Hero taglines that rotate in the hero section
const heroTaglines = [
  "a Full Stack Developer",
  "a Javascript Expert",
  "a FinTech Enthusiast",
  "a Problem Solver",
  "a UI/UX Designer",
  "an AI Integration Specialist"
];

// Skills for the 3D word cloud
const skills = [
  // Programming Languages
  "JavaScript", "Python", "Java", "PHP", "SQL", "TypeScript", "HTML", "CSS", "Pinescript","QISKIT","Lua",

  // Frameworks & Libraries
  "React", "Node.js", "Express", "Vue.js", "Angular","Django", "Flask",
  "jQuery", "Bootstrap", "Tailwind CSS", "Three.js", "D3.js", "TensorFlow","PyTorch",
  "Redux", "Next.js", "Spring Boot", "ASP.NET",

  // Tools & Technologies
  "Git", "Docker", "AWS", "Azure", "GraphQL", "RESTful APIs", "Webpack", "Vite",
  "npm", "yarn", "Babel", "ESLint", "Jest", "CAD", "Blender", "Canva", "Miro", "Figma",

  // Methodologies
  "Agile", "Scrum", "TDD", "CI/CD", "DevOps",

  // Industry Specific
  "FinTech", "Algorithmic Trading", "Data Analysis", "IoT", "Blockchain", "Web3", "AI/ML", "Quantum Computing"
];

// Services/expertise cards for the main content
const serviceCards = [
  {
    id: 1,
    title: "Front End Development",
    description: "Creating responsive and interactive front-end experiences is necessary in the modern zeitgeist, so using modern tools like React and TailwindCSS is key to shipping great products. My experience with both open-source and proprietary tools gives me the understanding to adapt quickly to new standards and technologies as the industry evolves.",
    icon: reactjs, 
  },
  {
    id: 2,
    title: "Data Visualization",
    description: "Data visualization is an ever evolving field, and I enjoy trying to push the boundaries of what is possible. Precision and visual storytelling can transform complex data into intuitive user experiences, and having access to a diverse toolbox is mandatory in today's development landscape to produce solutions that are both engaging and effective.",
    icon: threejs,
  },
  {
    id: 3,
    title: "Backend Development",
    description: "Creating secure, scalable backend systems is key to building robust applications. I've used Node.js, Django, Flask, and Spring boot to build backend systems, but, every project is unique, and adapting to the requirements means being flexible and agile. I think serverless solutions like Firebase have a lot of merit and I enjoy exploring their capabilities as well. ",
    icon: nodejs,
  },
  {
    id: 4,
    title: "Cloud Solutions",
    description: "At my last tenure, most customer deployments were hosted on cloud services. This gave me solid hands on experience deploying and managing customer solutions on platforms like AWS and Azure. A big component of cloud hosted solutions is containerization, so employing tools like Docker and Kubernetes allows for efficient deployments with CI/CD pipelines.",
    icon: aws,
  },
  {
    id: 5,
    title: "AI Integration",
    description: "AI and Machine learning is undeniably a disruptive force in the current market. With this in mind, I am constantly pushing my skillset to incorporate AI/ML where it benefits the user experience. Using AI/ML methods like LLM APIs, Deep learning, and cloud-based ML services can add tons of value to user experiences, making them more interactive and adaptive.",
    icon: ai,
  },
  {
    id: 6,
    title: "Trading Systems",
    description: "A passion of mine is Finance and with 6+ years of personal development in the field, I have found reliability in sentiment congruent systems. My current focus is on developing precise, reliable trading systems that can be integrated with algorithmic trading platforms. Using tools like QuantConnect's Python framework has allowed me to pursue this endeavor.",
    icon: stocks,
  }
];

// Projects data for the projects section
const projects = [
  {
    id: 1,
    title: "Equilibrium Protocol -- A Web Game",
    description: "My best friend and I created this game together for the 2025 Gamedev.Js Jam! We had 14 days to build a game from scratch with a unique theme that ended up being... Balance.",
    image: equilibrium,
    technologies: ["React", "Phaser.js", "Vite", "Jira+Git CI/CD"],
    link: "https://fluffymcchicken.itch.io/gjg2",
    githubLink: "https://github.com/Fluffy-Swizzle-Interactive/Equilibrium-Protocol-GameDevjs-2025-Entry",
    longDescription: "2 Weeks ago as im writing this, my best friend and I got the spontaneous idea to look into some Game Development competitions and stumbled across the 2025 Gamedev.Js Jam on Itch.io. We ended up diving in head first and brainstorming foundational concepts we could try to work with once we found out the secret theme. \n\n Once we found out the theme was Balance, we started by setting up our project structure and setting up Jira and Git to handle collaboration and version control. Once that was in place we hammered out some tickets and got to work. We really locked in on our idea to create a top-down, bullet-hell game with rogue-like elements, and we liked the direction the theme took us. Our choice of incorporation for the theme relied in our primary game mechanic of CHAOS Management! \n\n It was a fantastic experience as this was my first time ever starting, and finishing a video game development project, and doing it with a close friend made it that much more fun! \n\n Feel free to give the game a try with the embeded version or check out the official page on Itch.io!",
  },
  {
    id: 2,
    title: "Personal Portfolio Webpage",
    description: "The website youre looking at! I really wanted to experiment and test my skills with this project using modern React frameworks and best practices, here we are!",
    image: portfolio,
    technologies: ["React", "Three.js", "TailwindCSS", "Framer Motion"],
    link: "https://github.com/swizzleshizzle/React-Portfolio/",
    embed: null,
    longDescription: "This portfolio website represents my journey into modern web development, combining cutting-edge technologies to create an engaging and interactive experience. I built it from scratch using React and Vite for lightning-fast performance, while leveraging Three.js to create immersive 3D elements that make the site stand out. The responsive design is powered by TailwindCSS, allowing for a clean, professional appearance across all devices.\n\nThe site features interactive elements like the 3D word cloud of skills, tilt-effect cards that respond to mouse movement, and this modal system for project details. I've implemented smooth animations using Framer Motion to enhance the user experience, and organized the codebase with best practices for maintainability and scalability.\n\nThis project wasn't just about showcasing my work—it was an opportunity to push my technical boundaries and create something that reflects both my skills and personality as a developer. The entire codebase is available on GitHub, demonstrating my commitment to clean, well-structured code and modern development practices."
  },
  {
    id: 3,
    title: "Fibonacci Moving Average Indicator",
    description: "A sophisticated technical indicator that employs the first 15 numbers of the Fibonacci sequence to create dynamic moving average channels.",
    image: fma,
    technologies: ["Pinescript", "API", "Algorithmic Trading"],
    link: "https://www.tradingview.com/script/GPSApq2E-Fibonacci-Moving-Average-Plus/",
    embed: null,
    longDescription: "The Fibonacci Moving Average Indicator is a powerful technical analysis tool that leverages the mathematical properties of the Fibonacci sequence to create dynamic support and resistance levels. By utilizing the first 15 numbers of the sequence as weighting factors, this indicator generates moving average channels that adapt to market volatility. The indicator helps traders identify potential trend reversals, continuation patterns, and optimal entry/exit points. It includes customizable parameters for timeframe selection, color schemes, and alert conditions.\n\nThe source code for this indicator is available on Tradingview via Pinecode, allowing traders to modify and adapt the indicator to their specific needs."
  }
];

// Experience data for the experience section
const experiences = [
  {
    date: "May 2022",
    title: "Bachelor of Science in Computer Information Systems",
    description: "Graduated from California University of Pennsylvania (now PennWest) with a Bachelor of Science in Computer Information Systems. This was a great experience that allowed me to learn a lot about computer science and programming with a focus on Business Development.",
    link: {
      text: "PennWest",
      url: "https://www.pennwest.edu/"
    }
  },
  {
    date: "June 2022 - November 2024",
    title: "IoT Software Engineer at PTC",
    description: "Started my career as an IoT Software Engineer at PTC, a leading actor in the PLM and IoT market. Developing and maintaining customer software on their proprietary Internet of Things (IoT) platform, Thingworx.",
    link: {
      text: "PTC",
      url: "https://www.ptc.com/"
    }
  },
  {
    date: "Future?",
    title: "Working with YOU at YOUR Company",
    description: "I am currently looking for opportunities to expand my skills and knowledge, potentially with you and your team. If you are interested in learning more about my skills and experience, please don't hesitate to contact me on LinkedIn.",
    link: {
      text: "LinkedIn",
      url: "https://www.linkedin.com/in/michael-greene-ab59041b5/"
    }
  }
];

// Social media links
const socialLinks = [
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/michael-greene-ab59041b5/",
    icon: "linkedin"
  },
  {
    name: "GitHub",
    url: "https://github.com/swizzleshizzle",
    icon: "github"
  },
  {
    name: "Instagram",
    url: "https://www.instagram.com/swizzle_shizzle/",
    icon: "instagram"
  },
  {
    name: "Twitter",
    url: "https://x.com/ShizzleSwizzle",
    icon: "twitter"
  }
];

// Attributions for 3D models, icons, and other assets
const attributions = [
  {
    category: "3D Models",
    items: [
      {
        name: "Spaceship 1",
        author: "Liz Reddington",
        license: "CC-BY 4.0",
        url: "https://poly.pizza/m/6eRDOiTxvOo"
      },
      {
        name: "Spaceship 2",
        author: "Liz Reddington",
        license: "CC-BY 4.0",
        url: "https://poly.pizza/m/1GMsmYGqJad"
      },
      {
        name: "Spaceship 3",
        author: "Liz Reddington",
        license: "CC-BY 4.0",
        url: "https://poly.pizza/m/647DTebhyBD"
      },
      {
        name: "Spaceship 4",
        author: "Liz Reddington",
        license: "CC-BY 4.0",
        url: "https://poly.pizza/m/5nWeu4IQXVX"
      },
      {
        name: "Spaceship 5",
        author: "Liz Reddington",
        license: "CC-BY 4.0",
        url: "https://poly.pizza/m/dKFQSZCHQWf"
      }
    ]
  },
  {
    category: "Icons",
    items: [
      {
        name: "AI, Chart, and Cloud Icons",
        author: "Graficon",
        license: "Flaticon License",
        url: "https://www.flaticon.com/free-icons/"
      },
      {
        name: "Social Media Icons",
        author: "Font Awesome",
        license: "Font Awesome Free License",
        url: "https://fontawesome.com/"
      }
    ]
  },
  {
    category: "Libraries & Frameworks",
    items: [
      {
        name: "Three.js",
        author: "mrdoob",
        license: "MIT",
        url: "https://threejs.org/"
      },
      {
        name: "React Three Fiber",
        author: "Poimandres",
        license: "MIT",
        url: "https://github.com/pmndrs/react-three-fiber"
      },
      {
        name: "React",
        author: "Facebook",
        license: "MIT",
        url: "https://reactjs.org/"
      },
      {
        name: "Tailwind CSS",
        author: "Tailwind Labs",
        license: "MIT",
        url: "https://tailwindcss.com/"
      }
    ]
  }
];

export { skills, serviceCards, projects, experiences, socialLinks, attributions, heroTaglines };
