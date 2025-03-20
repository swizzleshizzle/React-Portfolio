# ReactPortfolio

## 🚀 Interactive 3D Portfolio Website

A modern, responsive portfolio website built with React and Three.js, featuring immersive 3D animations, interactive elements, and a sleek design to showcase professional skills and projects.

![Portfolio Preview](public/preview.png)

## ✨ Features

- **3D Interactive Hero Section**: Featuring animated spaceships that respond to user scrolling
- **Dynamic Word Cloud**: Interactive 3D visualization of skills and technologies
- **Responsive Design**: Optimized for all device sizes from mobile to desktop
- **Smooth Animations**: Scroll-based animations and transitions throughout the site
- **Modern UI**: Clean, professional interface with consistent design language
- **Performance Optimized**: Fast loading and smooth rendering even with complex 3D elements

## 🛠️ Technologies

- **Frontend**: React 19, Vite
- **3D Rendering**: Three.js, React Three Fiber, React Three Drei
- **Styling**: CSS, Tailwind CSS
- **Animation**: Custom Three.js animations, CSS transitions
- **Performance**: Optimized asset loading, code splitting
- **Development**: ESLint, Babel

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## 🔧 Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ReactPortfolio.git
   cd ReactPortfolio
   ```

2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   # or
   yarn install
   ```

3. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Building for Production

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## 📁 Project Structure

```
ReactPortfolio/
├── public/             # Public assets
├── src/                # Source files
│   ├── assets/         # Static assets (models, images)
│   ├── components/     # React components
│   │   ├── HeroThree.jsx  # 3D hero section with spaceships
│   │   ├── WordCloud.jsx  # Interactive 3D skill cloud
│   │   └── ...
│   ├── constants/      # Application constants
│   ├── hoc/            # Higher-order components
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main App component
│   └── main.jsx        # Entry point
├── .gitignore          # Git ignore file
├── index.html          # HTML entry point
├── package.json        # Project dependencies
├── README.md           # Project documentation
└── vite.config.js      # Vite configuration
```

## 🎮 Usage and Interaction

- **Hero Section**: Scroll down to see the spaceships react to your movement
- **Word Cloud**: Hover over skills to see them highlight and animate
- **Projects**: Click on project cards to see more details
- **Navigation**: Smooth scrolling navigation between sections

## 🔮 Future Enhancements

- [ ] Add more interactive 3D elements
- [ ] Implement dark/light theme toggle
- [ ] Add internationalization support
- [ ] Enhance accessibility features
- [ ] Add more project showcases with interactive demos

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/swizzleshizzle/React-Portfolio/issues).

## 📝 License

This project is [MIT](LICENSE) licensed.

## 👨‍💻 Author

**Michael Greene**

- Portfolio: [swizzleshizzle.com](https://swizzleshizzle.com)
- GitHub: [swizzleshizzle](https://github.com/swizzleshizzle)
- LinkedIn: [michael-greene](https://www.linkedin.com/in/michael-greene-ab59041b5/)

---

Made with ❤️ and React + Three.js
