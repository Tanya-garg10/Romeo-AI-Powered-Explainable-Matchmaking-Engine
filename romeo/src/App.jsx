/**
 * Romeo App Root
 * Routing, providers, and layout setup
 */
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider, useApp } from './context/AppContext';
import ParticleBackground from './components/ParticleBackground';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Dataset from './pages/Dataset';
import Matches from './pages/Matches';
import CompatibilityReport from './pages/CompatibilityReport';
import ParallelHearts from './pages/ParallelHearts';
import About from './pages/About';

function AppLayout() {
  const { theme } = useApp();

  return (
    <div className={theme}>
      <ParticleBackground />
      <Navbar />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/dataset" element={<Dataset />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/compatibility-report" element={<CompatibilityReport />} />
          <Route path="/parallel-hearts" element={<ParallelHearts />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
      <Toaster
        position="bottom-right"
        toastOptions={{
          style: {
            background: 'rgba(15,15,26,0.95)',
            color: '#fff',
            border: '1px solid rgba(233,30,140,0.3)',
            borderRadius: 12,
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppLayout />
      </AppProvider>
    </BrowserRouter>
  );
}
