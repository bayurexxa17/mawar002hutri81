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
import PanitiaAdmin from './sections/PanitiaAdmin';
import DonationBank from './sections/DonationBank';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAdminMode, setIsAdminMode] = useState(false);

  useEffect(() => {
    // Cek apakah ada ?admin= di URL
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') !== null) {
      setIsAdminMode(true);
    }
  }, []);

  if (isLoading) {
    return <LoadingScreen onFinish={() => setIsLoading(false)} />;
  }

  // Jika mode admin, tampilkan admin panel saja
  if (isAdminMode) {
    return <PanitiaAdmin />;
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
        <DonationBank />
        <Committee />
        <Sponsor />
        <Gallery />
        <Register />
      </main>
      <Footer />
      <FloatingWA />
      
      {/* Hidden Admin Access - klik logo 5x untuk buka admin */}
      <div className="fixed bottom-2 left-2 opacity-20 hover:opacity-100 transition text-xs">
        <a href="?admin=mawar81" className="bg-black text-white px-2 py-1 rounded">🔐 Panitia</a>
      </div>
    </div>
  );
}

export default App;
