
// Skills for the 3D word cloud
const skills = [
  // Programming Languages
  "JavaScript", "Python", "Java", "PHP", "SQL", "TypeScript", "HTML", "CSS", "Pinescript","QISKIT",

  // Frameworks & Libraries
  "React", "Node.js", "Express", "Vue.js", "Angular","Django", "Flask",
  "jQuery", "Bootstrap", "Tailwind CSS", "Three.js", "D3.js", "TensorFlow",
  "Redux", "Next.js", "Spring Boot", "ASP.NET",

  // Tools & Technologies
  "Git", "Docker", "AWS", "Azure", "GraphQL", "RESTful APIs", "Webpack", "Vite",
  "npm", "yarn", "Babel", "ESLint", "Jest", "Cypress", "Blender", "Canva", "Miro", "Figma",

  // Methodologies
  "Agile", "Scrum", "TDD", "CI/CD", "DevOps",

  // Industry Specific
  "FinTech", "Algorithmic Trading", "Data Analysis", "Automation", "Blockchain", "Web3", "AI/ML"
];

// Services/expertise cards for the main content
const serviceCards = [
  {
    id: 1,
    title: "Web Development",
    description: "Building interactive and responsive front-end interfaces with React and robust backend systems with Node.js and PHP.",
    icon: "code", // Could be used for an icon class if you add icons later
  },
  {
    id: 2,
    title: "Trading Systems",
    description: "Developing algorithmic trading systems and financial analysis tools with a focus on performance and reliability.",
    icon: "chart-line",
  },
  {
    id: 3,
    title: "Data Visualization",
    description: "Creating interactive data visualizations and dashboards using D3.js, Three.js, and other modern visualization libraries.",
    icon: "chart-bar",
  },
  {
    id: 4,
    title: "Cloud Solutions",
    description: "Designing and implementing scalable cloud-based applications on AWS, Azure, and other cloud platforms.",
    icon: "cloud",
  },
  {
    id: 5,
    title: "AI Integration",
    description: "Incorporating artificial intelligence and machine learning capabilities into web and mobile applications.",
    icon: "brain",
  },
  {
    id: 6,
    title: "FinTech Development",
    description: "Specialized development for financial technology applications with a focus on security and compliance.",
    icon: "dollar-sign",
  }
];

export { skills, serviceCards };
