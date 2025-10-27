import { useState, useEffect } from 'react';
import { ArrowRight, Check, ChartLine, ZapIcon } from 'lucide-react';
import CRM1 from './Images/CRM1.jpg';

export function Hero({ onNavigate }) {
  const [currentImage, setCurrentImage] = useState(0);

  const images = [
    CRM1,
    'https://t4.ftcdn.net/jpg/05/39/08/33/360_F_539083351_DbZXB3Q3xjDXWwvpOu1SFDCXpV0OS7VX.jpg',
    'https://images.unsplash.com/photo-1735825764457-ffdf0b5aa5dd?w=800',
    'https://images.unsplash.com/photo-1704655295066-681e61ecca6b?w=800',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    'Complete CRM System',
    'HR Management Tools',
    'Professional Invoicing',
    'Integrated Business Suite',
  ];

  return (
    <section
      className="position-relative d-flex align-items-center justify-content-center overflow-hidden text-center"
      style={{
        background:
          'linear-gradient(135deg, #ffffff 0%, #e3f2fd 30%, #bbdefb 70%, #ffffff 100%)',
        minHeight: '100vh',
        width: '100%',
        padding: '40px 0', // reduced top/bottom padding
      }}
    >
      {/* Animated background circles */}
      <div className="position-absolute" style={{ top: '10%', left: '8%', opacity: 0.1 }}>
        <div
          className="rounded-circle"
          style={{
            width: '20vw',
            height: '20vw',
            background: 'linear-gradient(135deg, #1E88E5, #1565C0)',
            filter: 'blur(4vw)',
            animation: 'float 6s ease-in-out infinite',
          }}
        ></div>
      </div>

      <div className="position-absolute" style={{ bottom: '10%', right: '8%', opacity: 0.1 }}>
        <div
          className="rounded-circle"
          style={{
            width: '18vw',
            height: '18vw',
            background: 'linear-gradient(135deg, #43A047, #2E7D32)',
            filter: 'blur(4vw)',
            animation: 'float 8s ease-in-out infinite',
          }}
        ></div>
      </div>

      <div
        className="container-fluid position-relative"
        style={{
          zIndex: 10,
          maxWidth: '100%',
          paddingLeft: '2rem',
          paddingRight: '2rem',
        }}
      >
        <div className="row align-items-center g-4 py-4">
          {/* Left Content */}
          <div className="col-lg-6 text-start px-2">
            <div className="mb-4">
              <span
                className="badge rounded-pill px-4 py-2"
                style={{
                  backgroundColor: '#E3F2FD',
                  color: '#1E88E5',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  border: '2px solid #1E88E550',
                }}
              >
                ✨ Trusted by 10,000+ teams worldwide
              </span>
            </div>

            <h1 className="display-5 fw-bold text-dark mb-3" style={{ lineHeight: '1.2' }}>
              Our Enterprise Business Solution Suite
            </h1>

            <p className="lead text-muted mb-4" style={{ fontSize: '1.05rem' }}>
              Streamline your operations with our integrated suite of CRM, HRM, Invoicing,
              and Business Management tools. Increase productivity by 40% and grow faster.
            </p>

            <div className="mb-4">
              <div className="row g-2">
                {features.map((feature, idx) => (
                  <div className="col-6" key={idx}>
                    <div className="d-flex align-items-center gap-2">
                      <div
                        className="d-flex align-items-center justify-content-center rounded-circle"
                        style={{
                          width: '24px',
                          height: '24px',
                          backgroundColor: '#1E88E5',
                          color: 'white',
                        }}
                      >
                        <Check size={14} />
                      </div>
                      <span className="text-dark fw-semibold" style={{ fontSize: '0.95rem' }}>
                        {feature}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="d-flex flex-column flex-sm-row gap-3 mb-4">
              <button
                className="btn btn-lg d-flex align-items-center justify-content-center gap-2 shadow-lg"
                onClick={() => onNavigate('schedule-demo')}
                style={{
                  background: 'linear-gradient(135deg, #1E88E5, #1565C0)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  padding: '12px 28px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 15px 35px rgba(30, 136, 229, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
                }}
              >
                Book a Free Demo
                <ArrowRight size={20} />
              </button>
            </div>

            <div className="d-flex gap-4 pt-3 border-top justify-content-start flex-wrap">
              <div>
                <h4 className="fw-bold text-dark mb-0">99.9%</h4>
                <small className="text-muted">Uptime</small>
              </div>
              <div>
                <h4 className="fw-bold text-dark mb-0">10K+</h4>
                <small className="text-muted">Active Users</small>
              </div>
              <div>
                <h4 className="fw-bold text-dark mb-0">4.9/5</h4>
                <small className="text-muted">Rating</small>
              </div>
            </div>
          </div>

          {/* Right Content */}
          <div className="col-lg-6 text-center px-2">
            <div className="position-relative mx-auto" style={{ maxWidth: '700px' }}>
              <div
                className="rounded shadow-lg border overflow-hidden position-relative"
                style={{ borderRadius: '20px' }}
              >
                <div className="position-relative" style={{ height: '400px' }}>
                  {images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      alt={`Dashboard ${idx + 1}`}
                      className="position-absolute top-0 start-0 w-100 h-100 object-fit-cover"
                      style={{
                        opacity: currentImage === idx ? 1 : 0,
                        transition: 'opacity 1s ease-in-out',
                      }}
                    />
                  ))}
                  <div
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      background: 'linear-gradient(45deg, rgba(30,136,229,0.1), transparent)',
                      pointerEvents: 'none',
                    }}
                  ></div>
                </div>

                <div className="position-absolute bottom-0 start-0 w-100 p-3">
                  <div className="d-flex justify-content-center gap-2">
                    {images.map((_, idx) => (
                      <button
                        key={idx}
                        className="border-0 rounded-pill"
                        style={{
                          width: currentImage === idx ? '28px' : '8px',
                          height: '8px',
                          backgroundColor:
                            currentImage === idx ? '#1E88E5' : 'rgba(255, 255, 255, 0.5)',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                        }}
                        onClick={() => setCurrentImage(idx)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <div
                className="position-absolute bg-white rounded shadow-lg p-3 border"
                style={{
                  top: '-20px',
                  right: '-20px',
                  borderRadius: '16px',
                  animation: 'float 3s ease-in-out infinite',
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="d-flex align-items-center justify-content-center rounded"
                    style={{
                      width: '48px',
                      height: '48px',
                      background: 'linear-gradient(135deg, #4CAF50, #2E7D32)',
                    }}
                  >
                    <ChartLine className="text-white" size={28} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0 text-dark">+28%</h5>
                    <small className="text-muted">Sales Growth</small>
                  </div>
                </div>
              </div>

              <div
                className="position-absolute bg-white rounded shadow-lg p-3 border"
                style={{
                  bottom: '-20px',
                  left: '-20px',
                  borderRadius: '16px',
                  animation: 'float 3s ease-in-out infinite 1.5s',
                }}
              >
                <div className="d-flex align-items-center gap-3">
                  <div
                    className="d-flex align-items-center justify-content-center rounded"
                    style={{
                      width: '48px',
                      height: '48px',
                      background: 'linear-gradient(135deg, #1E88E5, #1565C0)',
                    }}
                  >
                    <ZapIcon className="text-white" size={28} />
                  </div>
                  <div>
                    <h5 className="fw-bold mb-0 text-dark">2.5x</h5>
                    <small className="text-muted">Faster Response</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
