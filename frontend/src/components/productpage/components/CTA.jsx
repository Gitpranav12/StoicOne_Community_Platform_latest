import { ArrowRight } from 'lucide-react';

export function CTA({ onNavigate }) {
  return (
    <section 
      className="py-3 position-relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, #1E88E5 0%, #1976D2 50%, #1565C0 100%)'
      }}
    >
      {/* Background decoration */}
      <div className="position-absolute top-0 start-0 w-100 h-100" style={{ opacity: 0.1 }}>
        <div 
          className="position-absolute rounded-circle"
          style={{
            top: 0,
            left: 0,
            width: '150px',
            height: '150px',
            background: 'white',
            filter: 'blur(70px)'
          }}
        ></div>
        <div 
          className="position-absolute rounded-circle"
          style={{
            bottom: 0,
            right: 0,
            width: '300px',
            height: '150px',
            background: 'white',
            filter: 'blur(70px)'
          }}
        ></div>
      </div>

      <div className="container-fluid px-4 py-4 position-relative" style={{ zIndex: 10 }}>
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <h2 className="fw-bold text-white mb-3" style={{ fontSize: '1.9rem' }}>
              Ready to Transform Your Business?
            </h2>
            
            <p className="text-white opacity-90 mb-4" style={{ fontSize: '1rem', lineHeight: '1.6' }}>
              Join 10,000+ teams already using our complete suite to build better customer 
              relationships, manage employees efficiently, streamline invoicing, and grow faster.
            </p>

            <div className="d-flex flex-column flex-sm-row gap-2 justify-content-center">
              <button 
                className="btn btn-light btn-lg d-flex align-items-center justify-content-center gap-2 px-4 py-2"
                onClick={() => onNavigate('schedule-demo')}
                style={{ 
                  color: '#1E88E5',
                  fontWeight: '600',
                  borderRadius: '10px',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Let’s Schedule a Demo Together
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
