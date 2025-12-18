import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Hero from './components/Hero';
import Features from './components/Features';
import Products from './components/Products';
import Footer from './components/Footer';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import Chatbot from './components/Chatbot';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Features />
                <Products />
                <Footer />
              </>
            }
          />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/orders" element={<OrdersPage />} />
        </Routes>
        <Chatbot />
      </div>
    </BrowserRouter>
  );
}

export default App;
