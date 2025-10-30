import { Zap, Settings, BarChart3, Users, Shield, Layers, CheckCircle, ArrowRight } from 'lucide-react';
import React from 'react';
export function SuitePage({ onNavigate }) {
  const [selected, setSelected] = React.useState(null);
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
    { name: 'Professional CRM', description: 'Enhanced customer relationships with professional network integration', icon: 'bi-people', color: 'primary' },
    { name: 'HRM Professional Suite', description: 'Comprehensive human resources with professional development tools', icon: 'bi-person-badge', color: 'success' },
    { name: 'Financial Hub', description: 'Professional invoicing, billing, and financial management', icon: 'bi-currency-dollar', color: 'warning' },
    { name: 'Analytics Professional', description: 'Advanced insights for professional business intelligence', icon: 'bi-bar-chart-line', color: 'info' }
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
      <section
        className="text-black py-5"
        style={{
          background: 'radial-gradient(circle at top left, #ede7f6 0%, #d1c4e9 50%, #7e57c2 100%)',
          boxShadow: 'inset 0 0 80px rgba(123, 31, 162, 0.25)',
          minHeight: '100vh',
          width: '100%',
          padding: '40px 0',
        }}
      >
        <div className="container-fluid px-4 px-md-5 my-5">
          <div className="row align-items-center">
            <div className="col-12 col-lg-6 mb-4 mb-lg-0 text-center text-lg-start">
              <div className="mb-4">
                <span
                  className="badge rounded-pill px-4 py-2"
                  style={{
                    backgroundColor: '#F3E5F5',
                    color: '#8E24AA',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    border: '2px solid #8E24AA50',
                    borderRadius: '8px',
                  }}
                >
                  Professional Business Suite
                </span>
              </div>
              <h1 className="display-5 fw-bold mb-4">
                Enhance Productivity with Professional Integration
              </h1>
              <p className="lead mb-4">
                Complete business suite designed to enhance productivity through integrated tools and seamless connections with professionals across your industry ecosystem.
              </p>
              <div className="d-flex gap-3 mb-4">
                <button
                  className="btn btn-lg d-flex align-items-center justify-content-center gap-2 shadow-lg"
                  onClick={() => onNavigate("schedule-demo")}
                  style={{
                    background: "linear-gradient(135deg, #8E24AA)",
                    color: "white",
                    border: "none",
                    borderRadius: "12px",
                    padding: "14px 32px",
                    fontWeight: "600",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-3px)";
                    e.currentTarget.style.boxShadow =
                      "0 15px 35px rgba(30, 136, 229, 0.4)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow =
                      "0 10px 25px rgba(0, 0, 0, 0.2)";
                  }}
                >
                  Book a Free Demo
                  <ArrowRight size={20} />
                </button>
              </div>
              <div className="d-flex flex-column flex-sm-row gap-4 pt-3 text-center text-sm-start">
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
                style={{ maxWidth: '90%', borderRadius: '16px' }}
              />
            </div>
          </div>
        </div>
      </section>
      <section className="py-5 bg-light">
        <div className="container-fluid px-4 px-md-5 py-5">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold mb-3">Professional Business Modules</h2>
            <p className="lead text-muted">
              Integrated tools designed to enhance productivity and professional connections
            </p>
          </div>
          <div className="row g-4 justify-content-center">
            {modules.map((module, idx) => (
              <div className="col-12 col-sm-6 col-lg-3" key={idx}>
                <div
                  className={`card h-100 border-${module.color} shadow-sm`}
                  style={{
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.05)';
                  }}
                >
                  <div className="card-body p-4 text-center">
                    <div className={`text-${module.color} mb-3`} style={{ fontSize: '3rem' }}>
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
      <section className="py-5 bg-light">
        <div className="container-fluid px-4 px-md-5 py-5">
          <div className="row align-items-center">
            <div className="col-12 col-lg-6 mb-4 mb-lg-0 text-center text-lg-start">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800"
                alt="Professional Team Collaboration"
                className="img-fluid rounded shadow"
              />
            </div>
            <div className="col-12 col-lg-6">
              <h2 className="display-6 fw-bold mb-4">Why Choose Our Professional Suite?</h2>
              <p className="lead text-muted mb-4">
                Trusted by professional organizations to enhance productivity and connect with industry experts.
              </p>
              <ul className="list-unstyled">
                {benefits.map((benefit, idx) => (
                  <li key={idx} className="d-flex align-items-center mb-3">
                    <CheckCircle size={22} className="me-3 flex-shrink-0" style={{ color: '#6f42c1' }} />
                    <span className="fs-6">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>
    <section className="py-5 bg-light">
                 <div className="container-fluid px-3 px-md-5 py-5">
                   <div className="text-center mb-5">
                     <h2 className="display-5 fw-bold mb-3">Simple Pricing</h2>
                     <p className="lead text-muted">
                       Choose the perfect plan for your organization
                     </p>
                   </div>
                   <div className="row g-4">
                     {pricing.map((plan, idx) => (
                       <div className="col-md-6 col-lg-4" key={idx}>
                         <div
                           className={`card h-100 pricing-card ${
                             plan.popular ? "border-success shadow-lg" : "border-0 shadow-sm"
                           } ${selected === idx ? "selected-card" : ""}`}
                           onClick={() => setSelected(idx)}
                         >
                         {plan.popular && (
  <div className="card-header text-center py-2" style={{ backgroundColor: '#8B5CF6', color: 'white' }}>
    Most Popular
  </div>
)}
                           <div className="card-body p-4 text-center">
                             <h4 className="fw-bold mb-3">{plan.name}</h4>
                             <div className="mb-4">
                               <h2 className="display-4 fw-bold">{plan.price}</h2>
                               <small className="text-muted">{plan.period}</small>
                             </div>
                             <ul className="list-unstyled mb-4 text-start">
                               {plan.features.map((feature, i) => (
                                 <li key={i} className="mb-2">
                                   <CheckCircle
                                     size={18}
                                     className="text-success me-2"
                                   />
                                   {feature}
                                 </li>
                               ))}
                             </ul>
                           <button
  className={`btn ${
    plan.popular ? "" : "btn-outline-success"
  } w-100`}
  style={plan.popular ? { backgroundColor: '#8B5CF6', borderColor: '#8B5CF6', color: 'white' } : {}}
>
  Get Started
</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
      <section className="py-5 text-white" style={{ background: "#a47cedff" }}>
        <div className="container-fluid px-4 px-md-5 py-5 text-center">
          <div className="col-lg-8 mx-auto">
            <h2 className="display-6 fw-bold mb-4">
              Ready to Enhance Professional Productivity?
            </h2>
            <p className="lead mb-4">
                         Start your 14-day free trial today. No credit card required.
                       </p>
                       <div className="d-flex flex-wrap gap-3 justify-content-center">
                         <button
                           className="btn btn-light btn-lg d-flex align-items-center justify-content-center gap-2"
                           onClick={() => onNavigate("schedule-demo")}
                           style={{
                             color: "#1E88E5",
                             fontWeight: "600",
                             borderRadius: "10px",
                             transition: "all 0.3s ease",
                           }}
                           onMouseEnter={(e) => {
                             e.currentTarget.style.transform = "translateY(-2px)";
                             e.currentTarget.style.boxShadow =
                               "0 10px 25px rgba(0, 0, 0, 0.2)";
                           }}
                           onMouseLeave={(e) => {
                             e.currentTarget.style.transform = "translateY(0)";
                             e.currentTarget.style.boxShadow = "none";
                           }}
                         >
                           Let’s Schedule a Demo Together
                           <ArrowRight size={20} />
                         </button>
                         <button
                           className="btn btn-outline-light btn-lg"
                           onClick={() => onNavigate("home")}
                         >
                           Back to Home
                         </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
