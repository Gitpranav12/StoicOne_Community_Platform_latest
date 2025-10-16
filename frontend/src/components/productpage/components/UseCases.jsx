import { useState } from 'react';
import { TrendingUp, Megaphone, HeadphonesIcon, BarChart2, Users, FileText, Building2, Zap } from 'lucide-react';

export function UseCases() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const useCases = [
    {
      icon: <TrendingUp size={32} />,
      title: 'Sales Team',
      description: 'Accelerate your sales cycle with intelligent lead scoring, pipeline management, and automated follow-ups.',
      benefits: ['Lead prioritization', 'Deal tracking', 'Sales forecasting'],
      color: '#1E88E5',
      image: 'https://images.unsplash.com/photo-1590649849991-e9af438ea77d?w=400'
    },
    {
      icon: <Users size={32} />,
      title: 'HR Department',
      description: 'Manage your workforce efficiently with employee records, leave management, and performance tracking.',
      benefits: ['Employee database', 'Leave tracking', 'Performance reviews'],
      color: '#43A047',
      image: 'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400'
    },
    {
      icon: <FileText size={32} />,
      title: 'Finance Team',
      description: 'Handle invoicing, payments, and financial reporting with automated tools and real-time insights.',
      benefits: ['Invoice automation', 'Payment tracking', 'Financial reports'],
      color: '#FB8C00',
      image: 'https://images.unsplash.com/photo-1735825764457-ffdf0b5aa5dd?w=400'
    },
    {
      icon: <Megaphone size={32} />,
      title: 'Marketing',
      description: 'Create targeted campaigns, track ROI, and convert more leads with marketing automation tools.',
      benefits: ['Campaign management', 'Email marketing', 'Lead nurturing'],
      color: '#E91E63',
      image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400'
    },
    {
      icon: <HeadphonesIcon size={32} />,
      title: 'Support',
      description: 'Deliver exceptional customer service with a 360° view of customer interactions and ticket management.',
      benefits: ['Ticket system', 'Customer history', 'SLA tracking'],
      color: '#9C27B0',
      image: 'https://images.unsplash.com/photo-1596524430615-b46475ddff6e?w=400'
    },
    {
      icon: <Building2 size={32} />,
      title: 'Operations',
      description: 'Streamline business operations with integrated tools for project management and resource allocation.',
      benefits: ['Project tracking', 'Resource planning', 'Task management'],
      color: '#00ACC1',
      image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=400'
    },
    {
      icon: <BarChart2 size={32} />,
      title: 'Analytics',
      description: 'Make data-driven decisions with comprehensive reporting, custom dashboards, and real-time insights.',
      benefits: ['Custom reports', 'KPI tracking', 'Data visualization'],
      color: '#5E35B1',
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400'
    },
    {
      icon: <Zap size={32} />,
      title: 'Automation',
      description: 'Save time with powerful workflow automation across all business processes and departments.',
      benefits: ['Workflow builder', 'Automated tasks', 'Integration hub'],
      color: '#F57C00',
      image: 'https://images.unsplash.com/photo-1704655295066-681e61ecca6b?w=400'
    }
  ];

  return (
    <section id="use-cases" className="py-5" style={{ background: 'linear-gradient(135deg, #f8f9fa 0%, #e3f2fd 50%, #ffffff 100%)' }}>
      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-dark mb-3">
            Built for Every Team
          </h2>
          <p className="text-muted lead">
            Whether you're in sales, HR, finance, or operations, our suite adapts to your workflow
          </p>
        </div>

        <div className="row g-4">
          {useCases.map((useCase, index) => (
            <div className="col-12 col-md-6 col-lg-3" key={index}>
              <div 
                className="card h-100 border-0 overflow-hidden position-relative"
                style={{ 
                  borderRadius: '20px',
                  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  boxShadow: hoveredIndex === index 
                    ? `0 20px 40px ${useCase.color}40` 
                    : '0 4px 12px rgba(0, 0, 0, 0.08)'
                }}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Background Image */}
                <div 
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{
                    backgroundImage: `url(${useCase.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    opacity: hoveredIndex === index ? 0.15 : 0.08,
                    transition: 'opacity 0.4s ease'
                  }}
                ></div>

                {/* Gradient Overlay */}
                <div 
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{
                    background: hoveredIndex === index 
                      ? `linear-gradient(135deg, ${useCase.color}15, transparent)`
                      : 'transparent',
                    transition: 'background 0.4s ease'
                  }}
                ></div>

                <div className="card-body p-4 position-relative" style={{ zIndex: 10 }}>
                  {/* Icon */}
                  <div 
                    className="d-flex align-items-center justify-content-center rounded mb-4"
                    style={{
                      width: '72px',
                      height: '72px',
                      background: hoveredIndex === index
                        ? `linear-gradient(135deg, ${useCase.color}, ${useCase.color}dd)`
                        : `${useCase.color}20`,
                      color: hoveredIndex === index ? 'white' : useCase.color,
                      transition: 'all 0.4s ease',
                      transform: hoveredIndex === index ? 'scale(1.1) rotate(5deg)' : 'scale(1)'
                    }}
                  >
                    {useCase.icon}
                  </div>
                  
                  <h5 className="fw-bold text-dark mb-3">
                    {useCase.title}
                  </h5>
                  
                  <p className="text-muted mb-4" style={{ fontSize: '0.95rem' }}>
                    {useCase.description}
                  </p>

                  {/* Benefits List */}
                  <ul className="list-unstyled mb-0">
                    {useCase.benefits.map((benefit, idx) => (
                      <li 
                        key={idx} 
                        className="d-flex align-items-center mb-2"
                        style={{
                          transform: hoveredIndex === index ? 'translateX(5px)' : 'translateX(0)',
                          transition: `transform 0.3s ease ${idx * 0.1}s`
                        }}
                      >
                        <svg 
                          className="me-2" 
                          width="18" 
                          height="18" 
                          fill="none" 
                          stroke={useCase.color} 
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        <small className="text-dark fw-semibold">{benefit}</small>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Bottom Color Bar */}
                <div 
                  className="position-absolute bottom-0 start-0 w-100"
                  style={{
                    height: hoveredIndex === index ? '6px' : '3px',
                    background: `linear-gradient(90deg, ${useCase.color}, ${useCase.color}dd)`,
                    transition: 'height 0.3s ease'
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-5 pt-4">
          <p className="text-muted mb-3">
            See how our tools can transform your workflow
          </p>
          {/* <button 
            className="btn btn-lg"
            style={{
              background: 'linear-gradient(135deg, #1E88E5, #1565C0)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 32px',
              fontWeight: '600',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 15px 30px rgba(30, 136, 229, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            Start Free Trial
          </button> */}
        </div>
      </div>
    </section>
  );
}
