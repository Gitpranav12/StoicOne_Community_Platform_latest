import { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ProductDropdown } from './components/ProductDropdown';
import { UseCases } from './components/UseCases';
import { Features } from './components/Features';
import { Customers } from './components/Customers';
import { Pricing } from './components/Pricing';
import { CTA } from './components/CTA';
import { Footer } from './components/Footer';
import { CRMPage } from './components/pages/CRMPage';
import { HRMPage } from './components/pages/HRMPage';
import { InvoicingPage } from './components/pages/InvoicingPage';
import { SuitePage } from './components/pages/SuitePage';
import { ScheduleDemoPage } from './components/pages/ScheduleDemoPage';

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');

  useEffect(() => {
    // Bootstrap JS
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js';
    script.async = true;
    document.body.appendChild(script);

    // Smooth scrolling for anchor links
    const handleAnchorClick = (e) => {
      const target = e.target;
      if (target.tagName === 'A' && target.getAttribute('href')?.startsWith('#')) {
        e.preventDefault();
        const id = target.getAttribute('href').substring(1);
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
          });
        }
      }
    };

    document.addEventListener('click', handleAnchorClick);

    return () => {
      if (script.parentNode) {
        document.body.removeChild(script);
      }
      document.removeEventListener('click', handleAnchorClick);
    };
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'crm':
        return <CRMPage onNavigate={setCurrentPage} />;
      case 'hrm':
        return <HRMPage onNavigate={setCurrentPage} />;
      case 'invoicing':
        return <InvoicingPage onNavigate={setCurrentPage} />;
      case 'suite':
        return <SuitePage onNavigate={setCurrentPage} />;
      case 'schedule-demo':
        return <ScheduleDemoPage onNavigate={setCurrentPage} />;
      default:
        return (
          <>
            <Hero onNavigate={setCurrentPage} />
            <ProductDropdown onNavigate={setCurrentPage} />
            <UseCases />
            <Features />
            <Customers />
            <Pricing />
            <CTA onNavigate={setCurrentPage} />
            <Footer />
          </>
        );
    }
  };

  return (
    <div className="min-vh-100 bg-white">
      <Navbar onNavigate={setCurrentPage} currentPage={currentPage} />
      {renderPage()}
    </div>
  );
}
