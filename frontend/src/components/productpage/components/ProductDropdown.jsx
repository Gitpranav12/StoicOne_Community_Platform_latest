import { useState } from 'react';
import { Users, Target, BarChart3, Zap, Mail, Calendar, DollarSign, FileText, Briefcase, Settings, ArrowRight } from 'lucide-react';
import HRMS from './Images/HRMS.jpg'
export function ProductDropdown({ onNavigate }) {
  const [hoveredProduct, setHoveredProduct] = useState(null);

  const products = [
    {
      id: 'crm',
      category: 'STOIC CRM',
      page: 'crm',
      color: '#1E88E5',
      tagline: 'Grow Your Customer Relationships',
      description: 'Complete customer relationship management to track leads, manage contacts, and close more deals.',
      image: 'https://www.shutterstock.com/image-photo/businessman-using-crm-on-smartphone-600nw-2629431153.jpg',
      tools: [
        { icon: <Target size={20} />, title: 'Lead Management', description: 'Track and nurture leads' },
        { icon: <Users size={20} />, title: 'Contact Database', description: 'Centralized customer data' },
        { icon: <Calendar size={20} />, title: 'Sales Pipeline', description: 'Visual deal tracking' },
        { icon: <Mail size={20} />, title: 'Email Integration', description: 'Sync Gmail & Outlook' }
      ]
    },
    {
      id: 'hrm',
      category: 'STOIC HRM',
      page: 'hrm',
      color: '#43A047',
      tagline: 'Empower Your Workforce',
      description: 'Human resource management system to handle employees, payroll, and performance tracking.',
      image: HRMS,
      tools: [
        { icon: <Briefcase size={20} />, title: 'Employee Records', description: 'Complete HR profiles' },
        { icon: <Calendar size={20} />, title: 'Leave Management', description: 'Track time off requests' },
        { icon: <BarChart3 size={20} />, title: 'Performance', description: 'Evaluate employee work' },
        { icon: <Users size={20} />, title: 'Recruitment', description: 'Hire and onboard staff' }
      ]
    },
    {
      id: 'invoicing',
      category: 'STOIC Invoicing',
      page: 'invoicing',
      color: '#FB8C00',
      tagline: 'Streamline Your Billing',
      description: 'Professional invoicing and billing software to manage payments and financial records.',
      image: 'https://images.unsplash.com/photo-1735825764457-ffdf0b5aa5dd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpbnZvaWNlJTIwYmlsbGluZyUyMHNvZnR3YXJlfGVufDF8fHx8MTc2MDA3NDYwOHww&ixlib=rb-4.1.0&q=80&w=1080',
      tools: [
        { icon: <FileText size={20} />, title: 'Invoice Builder', description: 'Create invoices instantly' },
        { icon: <DollarSign size={20} />, title: 'Payment Tracking', description: 'Monitor all payments' },
        { icon: <BarChart3 size={20} />, title: 'Financial Reports', description: 'Comprehensive analytics' },
        { icon: <Zap size={20} />, title: 'Auto Invoicing', description: 'Recurring invoices' }
      ]
    },
    {
      id: 'suite',
      category: 'STOIC Suite',
      page: 'suite',
      color: '#8E24AA',
      tagline: 'All-in-One Business Solution',
      description: 'Complete business suite integrating CRM, HRM, Invoicing with unified analytics and automation.',
      image: 'https://images.unsplash.com/photo-1704655295066-681e61ecca6b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxidXNpbmVzcyUyMHN1aXRlJTIwZGFzaGJvYXJkfGVufDF8fHx8MTc2MDA3NDYwOXww&ixlib=rb-4.1.0&q=80&w=1080',
      tools: [
        { icon: <Settings size={20} />, title: 'Unified Platform', description: 'Everything in one place' },
        { icon: <BarChart3 size={20} />, title: 'Analytics Hub', description: 'Cross-module insights' },
        { icon: <Zap size={20} />, title: 'Automation', description: 'Workflow automation' },
        { icon: <Users size={20} />, title: 'Collaboration', description: 'Team productivity tools' }
      ]
    }
  ];

  return (
    <section className="py-5 bg-white" id="products">
      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-dark mb-3">
            Complete Suite of Business Tools
          </h2>
          <p className="text-muted lead">
            Everything you need to manage and grow your business in one powerful platform
          </p>
        </div>

        <div className="row g-4">
          {products.map((product) => (
            <div className="col-12 col-lg-6" key={product.id}>
              <div 
                className="card border-0 shadow-sm h-100 overflow-hidden"
                style={{ 
                  borderRadius: '20px',
                  transition: 'all 0.4s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-10px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                  setHoveredProduct(product.id);
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.1)';
                  setHoveredProduct(null);
                }}
              >
                {/* Image Section */}
                <div className="position-relative overflow-hidden" style={{ height: '240px' }}>
                  <img
                    src={product.image}
                    alt={product.category}
                    className="w-100 h-100 object-fit-cover"
                    style={{
                      transition: 'transform 0.4s ease',
                      transform: hoveredProduct === product.id ? 'scale(1.1)' : 'scale(1)'
                    }}
                  />
                  <div 
                    className="position-absolute top-0 start-0 w-100 h-100"
                    style={{
                      background: `linear-gradient(135deg, ${product.color}40, transparent)`,
                    }}
                  ></div>
                  <div 
                    className="position-absolute top-0 end-0 m-3 badge rounded-pill px-3 py-2"
                    style={{
                      backgroundColor: product.color,
                      color: 'white',
                      fontSize: '0.85rem'
                    }}
                  >
                    {product.category}
                  </div>
                </div>

                {/* Content Section */}
                <div className="card-body p-4">
                  <h4 className="fw-bold text-dark mb-2">{product.tagline}</h4>
                  <p className="text-muted mb-4">{product.description}</p>

                  {/* Tools Grid */}
                  <div className="row g-3 mb-3">
                    {product.tools.map((tool, idx) => (
                      <div className="col-6" key={idx}>
                        <div 
                          className="d-flex align-items-start gap-2 p-2 rounded"
                          style={{
                            backgroundColor: `${product.color}08`,
                            transition: 'all 0.3s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = `${product.color}15`;
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = `${product.color}08`;
                          }}
                        >
                          <div 
                            className="d-flex align-items-center justify-content-center rounded flex-shrink-0"
                            style={{
                              width: '32px',
                              height: '32px',
                              backgroundColor: `${product.color}20`,
                              color: product.color
                            }}
                          >
                            {tool.icon}
                          </div>
                          <div>
                            <h6 className="mb-0" style={{ fontSize: '0.85rem', fontWeight: '600' }}>
                              {tool.title}
                            </h6>
                            <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                              {tool.description}
                            </small>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <button 
                    className="btn w-100 d-flex align-items-center justify-content-center gap-2"
                    style={{
                      backgroundColor: product.color,
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '12px',
                      fontWeight: '600',
                      transition: 'all 0.3s ease'
                    }}
                    onClick={() => onNavigate(product.page)}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateX(5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    Learn More
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
