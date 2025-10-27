import { useState } from 'react';
import { Star, Quote, Rocket, BarChart3, Cloud, Save, Lightbulb, CircleDollarSign } from 'lucide-react';

export function Customers() {
  const [hoveredTestimonial, setHoveredTestimonial] = useState(null);
  const [hoveredClient, setHoveredClient] = useState(null);

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'VP of Sales, TechFlow Inc',
      content:
        "The CRM module transformed how our sales team operates. We've seen a 45% increase in productivity and our close rates have never been better. The visual pipeline is a game-changer!",
      rating: 5,
      product: 'CRM',
      color: '#1E88E5',
      image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop',
    },
    {
      name: 'Michael Chen',
      role: 'HR Director, GrowthLabs',
      content:
        'The HRM features are exceptional. We\'ve streamlined our recruitment process and employee management has become effortless. Time saved on admin work is incredible!',
      rating: 5,
      product: 'HRM',
      color: '#43A047',
      image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    },
    {
      name: 'Emily Rodriguez',
      role: 'Finance Manager, CloudServe',
      content:
        'Invoicing automation has saved us countless hours. Professional invoices, automated reminders, and excellent financial reporting. Our cash flow has improved by 35%!',
      rating: 5,
      product: 'Invoicing',
      color: '#FB8C00',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
    },
    {
      name: 'David Kumar',
      role: 'CEO, InnovateCo',
      content:
        "The complete suite integration is outstanding. All our business operations in one place with seamless data flow. It's like having a digital command center for our entire company.",
      rating: 5,
      product: 'Suite',
      color: '#8E24AA',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    },
    {
      name: 'Lisa Wang',
      role: 'Marketing Director, DataPro',
      content:
        'Best business software we\'ve ever used. The interface is intuitive, support team is amazing, and analytics help us make better decisions every single day.',
      rating: 5,
      product: 'Suite',
      color: '#8E24AA',
      image: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
    },
    {
      name: 'James Wilson',
      role: 'Operations Manager, FinanceHub',
      content:
        'Incredible value for money. The automation features alone have paid for the entire suite multiple times over. ROI was visible within the first month!',
      rating: 5,
      product: 'Suite',
      color: '#8E24AA',
      image: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=200&h=200&fit=crop',
    },
  ];

  const clients = [
    { name: 'TechFlow', logo: <Rocket className="text-primary" size={28} /> },
    { name: 'GrowthLabs', logo: <BarChart3 className="text-primary" size={28} /> },
    { name: 'CloudServe', logo: <Cloud className="text-primary" size={28} /> },
    { name: 'DataPro', logo: <Save className="text-primary" size={28} /> },
    { name: 'InnovateCo', logo: <Lightbulb className="text-primary" size={28} /> },
    { name: 'FinanceHub', logo: <CircleDollarSign className="text-primary" size={28} /> },
  ];

  return (
    <section
      id="customers"
      className="py-5 position-relative overflow-hidden"
      style={{
        background: 'linear-gradient(135deg, #E3F2FD 0%, #F3E5F5 50%, #ffffff 100%)',
      }}
    >
      {/* Decorative Blur Circle */}
      <div className="position-absolute top-0 start-0 opacity-10">
        <div
          className="rounded-circle"
          style={{
            width: '300px',
            height: '300px',
            background: 'linear-gradient(135deg, #1E88E5, #9C27B0)',
            filter: 'blur(80px)',
          }}
        ></div>
      </div>

      {/* Use container-fluid for less side spacing */}
      <div
        className="container-fluid py-5 px-4 px-md-5 position-relative"
        style={{ zIndex: 10, maxWidth: '96%' }}
      >
        {/* Client Logos */}
        <div className="text-center mb-5">
          <p className="text-muted lead mb-4 fw-semibold">
            Trusted by innovative companies worldwide
          </p>
          <div className="row g-3 g-md-4 justify-content-center align-items-center">
            {clients.map((client, idx) => (
              <div className="col-6 col-md-4 col-lg-2" key={idx}>
                <div
                  className="card border-0 h-100 d-flex align-items-center justify-content-center p-4"
                  style={{
                    borderRadius: '16px',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    backgroundColor: hoveredClient === idx ? '#f8f9fa' : 'white',
                    boxShadow:
                      hoveredClient === idx
                        ? '0 10px 30px rgba(0,0,0,0.1)'
                        : '0 2px 8px rgba(0,0,0,0.05)',
                  }}
                  onMouseEnter={() => setHoveredClient(idx)}
                  onMouseLeave={() => setHoveredClient(null)}
                >
                  <span
                    style={{
                      fontSize: '2.5rem',
                      transform: hoveredClient === idx ? 'scale(1.2)' : 'scale(1)',
                      transition: 'transform 0.3s ease',
                    }}
                  >
                    {client.logo}
                  </span>
                  <small
                    className="text-dark fw-bold mt-2"
                    style={{
                      fontSize: '0.9rem',
                    }}
                  >
                    {client.name}
                  </small>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="text-center mb-5 mt-5 pt-4">
          <h2 className="display-6 fw-bold text-dark mb-2">Loved by Teams Everywhere</h2>
          <p className="text-muted lead">See what our customers have to say</p>
        </div>

        <div className="row g-4">
          {testimonials.map((testimonial, index) => (
            <div className="col-12 col-md-6 col-lg-4" key={index}>
              <div
                className="card border-0 h-100 position-relative overflow-hidden"
                style={{
                  borderRadius: '20px',
                  transition: 'all 0.4s ease',
                  cursor: 'pointer',
                  backgroundColor:
                    hoveredTestimonial === index ? `${testimonial.color}05` : 'white',
                  boxShadow:
                    hoveredTestimonial === index
                      ? `0 20px 50px ${testimonial.color}40`
                      : '0 4px 15px rgba(0, 0, 0, 0.08)',
                  transform:
                    hoveredTestimonial === index ? 'translateY(-10px)' : 'translateY(0)',
                }}
                onMouseEnter={() => setHoveredTestimonial(index)}
                onMouseLeave={() => setHoveredTestimonial(null)}
              >
                {/* Quote Icon */}
                <div
                  className="position-absolute d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    top: '-20px',
                    left: '30px',
                    width: '56px',
                    height: '56px',
                    background: `linear-gradient(135deg, ${testimonial.color}, ${testimonial.color}dd)`,
                    color: 'white',
                    boxShadow: `0 8px 20px ${testimonial.color}50`,
                    transform:
                      hoveredTestimonial === index
                        ? 'rotate(12deg) scale(1.1)'
                        : 'rotate(0deg) scale(1)',
                    transition: 'transform 0.4s ease',
                  }}
                >
                  <Quote size={28} />
                </div>

                <div className="card-body p-4 pt-5">
                  <div className="d-flex mb-3 mt-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        size={18}
                        className="text-warning me-1"
                        fill="currentColor"
                      />
                    ))}
                  </div>

                  <p className="text-dark mb-4" style={{ fontSize: '1rem', lineHeight: '1.7' }}>
                    "{testimonial.content}"
                  </p>

                  <div className="d-flex align-items-center gap-3">
                    <div
                      className="rounded-circle overflow-hidden flex-shrink-0"
                      style={{
                        width: '56px',
                        height: '56px',
                        border: `3px solid ${testimonial.color}`,
                        boxShadow: `0 4px 12px ${testimonial.color}30`,
                      }}
                    >
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-100 h-100 object-fit-cover"
                      />
                    </div>
                    <div className="flex-grow-1">
                      <h6 className="fw-bold mb-1 text-dark">{testimonial.name}</h6>
                      <small className="text-muted d-block mb-2">{testimonial.role}</small>
                      <span
                        className="badge rounded-pill px-3 py-1"
                        style={{
                          backgroundColor: `${testimonial.color}15`,
                          color: testimonial.color,
                          fontWeight: '600',
                          fontSize: '0.75rem',
                        }}
                      >
                        {testimonial.product}
                      </span>
                    </div>
                  </div>
                </div>

                <div
                  className="position-absolute bottom-0 start-0 w-100"
                  style={{
                    height: '4px',
                    background: `linear-gradient(90deg, ${testimonial.color}, ${testimonial.color}80)`,
                    transform:
                      hoveredTestimonial === index ? 'scaleY(2)' : 'scaleY(1)',
                    transformOrigin: 'bottom',
                    transition: 'transform 0.3s ease',
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-5 pt-4">
          <p className="text-muted mb-3 lead">Join thousands of satisfied customers</p>
        </div>
      </div>
    </section>
  );
}
