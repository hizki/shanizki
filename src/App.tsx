import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Processes from './pages/Processes';
import Process from './pages/Process';
import Contact from './pages/Contact';
import Admin from './pages/Admin';
import WeddingPhotos from './pages/WeddingPhotos';
import Cats from './pages/Cats';
import NotFound from './pages/NotFound';
import StagingBanner from './components/StagingBanner';
import './index.css';

function App() {
  return (
    <Router>
      <StagingBanner />
      <div className="flex flex-col min-h-screen" dir="rtl">
        <Header />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/processes" element={<Processes />} />
            <Route path="/process/:id" element={<Process />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/wedding-photos" element={<WeddingPhotos />} />
            <Route path="/cats" element={<Cats />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;