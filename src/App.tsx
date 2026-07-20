import { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Statistics from './components/Statistics';
import LoadingScreen from './components/LoadingScreen';
import FloatingWA from './components/FloatingWA';
import Footer from './components/Footer';
import About from './sections/About';
import Activities from './sections/Activities';
import Schedule from './sections/Schedule';
import Committee from './sections/Committee';
import Gallery from './sections/Gallery';
import Sponsor from './sections/Sponsor';
import Register from './sections/Register';
import Dashboard from './sections/Dashboard';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Preload critical assets
    const preloadImages = () => {
      // Add any critical image preloading here
    };
    preloadImages();
  }, []);

  if (isLoading) {
    return <LoadingScreen onFinish={() => setIsLoading(false)} />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <Hero />
        <Statistics />
        <Dashboard />
        <About />
        <Activities />
        <Schedule />
        <Committee />
        <Sponsor />
        <Gallery />
        <Register />
      </main>
      <Footer />
      <FloatingWA />
    </div>
  );
}

export default App;
