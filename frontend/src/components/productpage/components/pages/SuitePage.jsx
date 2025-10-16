import { Zap, Settings, BarChart3, Users, Shield, Layers, CheckCircle, ArrowRight } from 'lucide-react';

export function SuitePage({ onNavigate }) {
  const features = [
    {
      icon: <Settings size={48} />,
      title: 'Unified Business Platform',
      description: 'Seamlessly integrate CRM, HRM, and financial tools to enhance productivity and connect teams with professionals.'
    },
    {
      icon: <BarChart3 size={48} />,
      title: 'Cross-Functional Analytics',
      description: 'Unified business intelligence with real-time insights across all departments and professional networks.'
    },
    {
      icon: <Zap size={48} />,
      title: 'Intelligent Automation',
      description: 'Automate workflows across modules to enhance productivity and streamline professional collaboration.'
    },
    {
      icon: <Users size={48} />,
      title: 'Professional Network Integration',
      description: 'Connect with industry professionals and enhance team collaboration across business functions.'
    },
    {
      icon: <Shield size={48} />,
      title: 'Enterprise-Grade Security',
      description: 'Advanced security protocols to protect professional data and ensure compliance across all modules.'
    },
    {
      icon: <Layers size={48} />,
      title: 'Professional Ecosystem',
      description: 'Connect with industry tools and professional networks through comprehensive integration capabilities.'
    }
  ];

  const benefits = [
    'Enhance team productivity by 60% through integrated workflows',
    'Connect seamlessly with professional networks and partners',
    'Unified data ecosystem enhances decision-making by 45%',
    'Single platform for all professional business operations',
    'Real-time collaboration with internal and external professionals',
    'Enterprise security for professional data protection'
  ];

  const modules = [
  {
    name: 'Professional CRM',
    description: 'Enhanced customer relationships with professional network integration',
    icon: 'bi-people', // Bootstrap icon class
    color: 'primary'
  },
  {
    name: 'HRM Professional Suite',
    description: 'Comprehensive human resources with professional development tools',
    icon: 'bi-person-badge',
    color: 'success'
  },
  {
    name: 'Financial Hub',
    description: 'Professional invoicing, billing, and financial management',
    icon: 'bi-currency-dollar',
    color: 'warning'
  },
  {
    name: 'Analytics Professional',
    description: 'Advanced insights for professional business intelligence',
    icon: 'bi-bar-chart-line',
    color: 'info'
  }
];

  const pricing = [
    {
      name: 'Professional Business',
      price: '$199',
      period: '/user/month',
      features: [
        'All professional modules included',
        'Up to 75 professional users',
        'Advanced professional analytics',
        'Cross-module workflow automation',
        'Professional network integration',
        'API access for professional tools',
        'Custom professional reports'
      ]
    },
    {
      name: 'Enterprise Professional',
      price: '$299',
      period: '/user/month',
      popular: true,
      features: [
        'All Professional Business features',
        'Unlimited professional users',
        'Dedicated professional manager',
        'Custom professional integrations',
        'Advanced professional security',
        'Professional SLA guarantee',
        'White-label professional portal',
        'Professional deployment options'
      ]
    },
    {
      name: 'Professional Elite',
      price: 'Custom Quote',
      period: 'Professional consultation',
      features: [
        'All Enterprise Professional features',
        'Custom professional development',
        'Dedicated professional team',
        'Professional training programs',
        'Professional migration support',
        'Custom professional SLA',
        'Premium professional support',
        'Professional ecosystem access'
      ]
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="text-white py-5" style={{ backgroundColor: '#a47cedff' }}>
        <div className="container py-5 my-5">
          <div className="row align-items-center">
            <div className="col-12 col-lg-6 mb-4 mb-lg-0 text-center text-lg-start">
              <div className="badge bg-white mb-3 px-3 py-2" style={{ color: '#8c56f1' }}>
                Professional Business Suite
              </div>
              <h1 className="display-5 display-lg-3 fw-bold mb-4">
                Enhance Productivity with Professional Integration
              </h1>
              <p className="lead mb-4">
                Complete business suite designed to enhance productivity through integrated tools and 
                seamless connections with professionals across your industry ecosystem.
              </p>
               <div className="d-flex flex-column flex-sm-row gap-2 gap-sm-3 mb-4">
                <button className="btn btn-dark btn-lg w-100 w-sm-auto">
                  Begin 30-Day Trial
                </button>
                <button className="btn btn-outline-dark btn-lg w-100 w-sm-auto">
                  Schedule Demo
                </button>
              </div>
              <div className="d-flex flex-column flex-sm-row gap-3 pt-3 text-center text-sm-start">
                <div>
                  <h3 className="fw-bold mb-0">60%</h3>
                  <small>Productivity Gain</small>
                </div>
                <div>
                  <h3 className="fw-bold mb-0">45%</h3>
                  <small>Better Decisions</small>
                </div>
                <div>
                  <h3 className="fw-bold mb-0">24/7</h3>
                  <small>Professional Support</small>
                </div>
              </div>
            </div>
            <div className="col-12 col-lg-6 text-center">
              <img
                src="https://static.wixstatic.com/media/c05a3f_4805301e35d143cb9e1d03d08f6539c6~mv2.jpg/v1/fill/w_2500,h_1618,al_c/c05a3f_4805301e35d143cb9e1d03d08f6539c6~mv2.jpg"
                alt="Integrated Business Platform"
                className="img-fluid rounded shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section className="py-5 bg-light">
        <div className="container py-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Professional Business Modules</h2>
            <p className="lead text-muted">
              Integrated tools designed to enhance productivity and professional connections
            </p>
          </div>
      <div className="row g-4">
  {modules.map((module, idx) => (
    <div className="col-12 col-md-6 col-lg-3" key={idx}>
      <div
        className={`card h-100 border-${module.color} shadow-sm`}
        style={{
          transition: 'transform 0.3s ease, box-shadow 0.3s ease',
          cursor: 'pointer',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.2)';
        }}
        onMouseLeave={e => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        }}
      >
        <div className="card-body p-4 text-center">
          <div
            className={`text-${module.color} mb-3`}
            style={{ fontSize: '3rem' }}
          >
            <i className={`bi ${module.icon}`}></i>
          </div>
          <h5 className="card-title fw-bold">{module.name}</h5>
          <p className="card-text text-muted">{module.description}</p>
          <button className={`btn btn-${module.color} btn-sm w-100`}>
            Explore Module
          </button>
        </div>
      </div>
    </div>
  ))}
</div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-5 bg-light">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-12 col-lg-6 mb-4 mb-lg-0 text-center text-lg-start">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
                alt="Professional Team Collaboration"
                className="img-fluid rounded shadow"
              />
            </div>
            <div className="col-12 col-lg-6">
              <h2 className="display-5 fw-bold mb-4">
                Why Choose Our Professional Suite?
              </h2>
              <p className="lead text-muted mb-4">
                Trusted by professional organizations to enhance productivity and connect with industry experts.
              </p>
              <ul className="list-unstyled">
                {benefits.map((benefit, idx) => (
                  <li key={idx} className="d-flex align-items-center mb-3">
                    <CheckCircle size={24} className="me-3 flex-shrink-0" style={{ color: '#6f42c1' }} />
                    <span className="fs-5">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
<section className="py-5">
  <div className="container py-5">
    <div className="text-center mb-5">
      <h2 className="display-5 fw-bold mb-3">Professional Suite Pricing</h2>
      <p className="lead text-muted">
        Choose the perfect professional plan for your organization
      </p>
    </div>
    <div className="row g-4">
      {pricing.map((plan, idx) => (
        <div className="col-12 col-md-6 col-lg-4" key={idx}>
          <div
            className={`card h-100 ${plan.popular ? 'shadow-lg' : 'border-0 shadow-sm'}`}
            style={{
              transition: 'transform 0.3s ease, box-shadow 0.3s ease',
              cursor: 'pointer',
              borderColor: plan.popular ? '#6f42c1' : undefined,
              borderWidth: plan.popular ? '2px' : undefined,
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
            }}
          >
            {plan.popular && (
              <div className="card-header text-white text-center py-2" style={{ backgroundColor: '#6f42c1' }}>
                Professional Choice
              </div>
            )}
            <div className="card-body p-4 text-center text-md-start">
              <h4 className="fw-bold mb-3">{plan.name}</h4>
              <div className="mb-4">
                <h2 className="display-4 fw-bold">{plan.price}</h2>
                <small className="text-muted">{plan.period}</small>
              </div>
              <ul className="list-unstyled mb-4">
                {plan.features.map((feature, i) => (
                  <li key={i} className="mb-2 d-flex align-items-center">
                    <CheckCircle size={18} className="me-2" style={{ color: '#6f42c1' }} />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className="btn w-100"
                style={{
                  backgroundColor: plan.popular ? '#6f42c1' : 'transparent',
                  border: '2px solid #6f42c1',
                  color: plan.popular ? 'white' : '#6f42c1',
                  transition: '0.3s',
                }}
                onMouseEnter={e => {
                  e.target.style.backgroundColor = '#5a32a3';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={e => {
                  e.target.style.backgroundColor = plan.popular ? '#6f42c1' : 'transparent';
                  e.target.style.color = plan.popular ? 'white' : '#6f42c1';
                }}
              >
                Select Plan
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>

      {/* CTA Section */}
      <section className="py-5 text-white" style={{ background:"#a47cedff" }}>
        <div className="container py-5">
          <div className="row justify-content-center text-center">
            <div className="col-12 col-lg-8">
              <h2 className="display-5 fw-bold mb-4">
                Ready to Enhance Professional Productivity?
              </h2>
              <p className="lead mb-4">
                Start your 21-day professional trial today. Connect with experts and transform your business operations.
              </p>
               <div className="d-flex gap-3 justify-content-center">
                              <button className="btn btn-light btn-lg">
                                Start Enterprise Trial
                                <ArrowRight size={20} className="ms-2" />
                              </button>
                               <button
                                className="btn btn-outline-light btn-lg"
                              >
                                Return to Home
                              </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
