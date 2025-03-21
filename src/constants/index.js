import reactjs from "../assets/tech/reactjs.png"
import nodejs from "../assets/tech/nodejs.png"
import threejs from "../assets/tech/threejs.webp"
import aws from "../assets/tech/aws.png"
import ai from "../assets/tech/ai.png"
import stocks from "../assets/tech/stocks2.png"
import fma from "../assets/projectScreens/fma.png"
import portfolio from "../assets/projectScreens/portfolio.png"

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
    description: "I build responsive, interactive front-end experiences using React and a variety of modern frameworks. My experience with both open-source and proprietary tools allows me to adapt quickly, implement scalable solutions, and align seamlessly with design and development standards.",
    icon: reactjs, 
  },
  {
    id: 2,
    title: "Data Visualization",
    description: "I create interactive data visualizations and dashboards using tools like D3.js, Three.js, Vue.js. My approach combines technical precision with visual storytelling to transform complex data into intuitive, engaging user experiences.",
    icon: threejs,
  },
  {
    id: 3,
    title: "Backend Development",
    description: "I develop robust server-side applications and APIs using Node.js, Python, and other backend frameworks. My experience extends to SQL database design and management, including hands-on work with Oracle and other relational systems.",
    icon: nodejs,
  },
  {
    id: 4,
    title: "Cloud Solutions",
    description: "I deploy and manage cloud-hosted applications on AWS, Azure, and other platforms—provisioning and maintaining scalable infrastructure with Docker, and streamlining release workflows using GitHub Actions and CI/CD best practices.",
    icon: aws,
  },
  {
    id: 5,
    title: "AI Integration",
    description: "I incorporate AI and machine learning into web and mobile applications, using tools like TensorFlow, Python, and cloud-based ML services to deliver intelligent, adaptive user experiences.",
    icon: ai,
  },
  {
    id: 6,
    title: "Trading Systems",
    description: "I develop reliable, high-performance algorithmic trading systems and financial analysis tools. Currently my focus is on QuantConnect’s Python framework for strategy development and backtesting.",
    icon: stocks,
  }
];

// Projects data for the projects section
const projects = [
  {
    id: 1,
    title: "Fibonacci Moving Average Indicator",
    description: "A sophisticated technical indicator that employs the first 15 numbers of the Fibonacci sequence to create dynamic moving average channels.",
    image: fma,
    technologies: ["Pinescript", "API", "Algorithmic Trading"],
    link: "https://www.tradingview.com/script/GPSApq2E-Fibonacci-Moving-Average-Plus/",
    longDescription: "The Fibonacci Moving Average Indicator is a powerful technical analysis tool that leverages the mathematical properties of the Fibonacci sequence to create dynamic support and resistance levels. By utilizing the first 15 numbers of the sequence as weighting factors, this indicator generates moving average channels that adapt to market volatility. The indicator helps traders identify potential trend reversals, continuation patterns, and optimal entry/exit points. It includes customizable parameters for timeframe selection, color schemes, and alert conditions.\n\nThe source code for this indicator is available on Tradingview via Pinecode, allowing traders to modify and adapt the indicator to their specific needs."
  },
  {
    id: 2,
    title: "Personal Portfolio Webpage",
    description: "The website youre looking at! I really wanted to experiment and test my skills with this project using modern React frameworks and best practices, here we are!",
    image: portfolio,
    technologies: ["React", "Three.js", "TailwindCSS", "Framer Motion"],
    link: "https://github.com/swizzleshizzle/React-Portfolio/",
    longDescription: "This portfolio website represents my journey into modern web development, combining cutting-edge technologies to create an engaging and interactive experience. I built it from scratch using React and Vite for lightning-fast performance, while leveraging Three.js to create immersive 3D elements that make the site stand out. The responsive design is powered by TailwindCSS, allowing for a clean, professional appearance across all devices.\n\nThe site features interactive elements like the 3D word cloud of skills, tilt-effect cards that respond to mouse movement, and this modal system for project details. I've implemented smooth animations using Framer Motion to enhance the user experience, and organized the codebase with best practices for maintainability and scalability.\n\nThis project wasn't just about showcasing my work—it was an opportunity to push my technical boundaries and create something that reflects both my skills and personality as a developer. The entire codebase is available on GitHub, demonstrating my commitment to clean, well-structured code and modern development practices."
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

export { skills, serviceCards, projects, experiences, socialLinks, attributions };
