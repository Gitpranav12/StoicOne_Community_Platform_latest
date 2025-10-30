import { FileText, DollarSign, BarChart3, Zap, CreditCard, Globe, CheckCircle, ArrowRight } from 'lucide-react';
import React from "react";
export function InvoicingPage({ onNavigate }) {
   const [selected, setSelected] = React.useState(null);
  const features = [
    { icon: <FileText size={48} />, title: 'Professional Invoice Creation', description: 'Generate polished, branded invoices with customizable templates and automated client details.' },
    { icon: <DollarSign size={48} />, title: 'Payment Management', description: 'Track payment statuses, monitor overdue accounts, and automate payment reminder notifications.' },
    { icon: <BarChart3 size={48} />, title: 'Financial Analytics', description: 'Gain valuable insights with comprehensive financial reporting and revenue performance metrics.' },
    { icon: <Zap size={48} />, title: 'Workflow Automation', description: 'Automate recurring billing, payment follow-ups, and client communication workflows.' },
    { icon: <CreditCard size={48} />, title: 'Integrated Payment Processing', description: 'Seamlessly accept online payments through multiple secure payment gateways.' },
    { icon: <Globe size={48} />, title: 'Global Currency Support', description: 'Handle international clients with multi-currency support and real-time exchange rate integration.' },
  ];

  const benefits = [
    'Accelerate payment cycles by 50% through automation',
    'Achieve 95% reduction in billing discrepancies',
    'Save 10+ hours weekly on administrative tasks',
    'Deliver consistently branded professional invoices',
    'Access real-time financial performance dashboards',
    'Automate tax compliance and reporting requirements',
  ];

  const pricing = [
    {
      name: 'Essential',
      price: '$29',
      period: '/month',
      features: [
        'Up to 50 invoices monthly',
        'Professional template library',
        'Payment status tracking',
        'Basic financial reporting',
        'Email support within 24h',
        'Up to 3 team members',
      ],
    },
    {
      name: 'Professional',
      price: '$79',
      period: '/month',
      popular: true,
      features: [
        'Unlimited invoice generation',
        'Custom branding and logo integration',
        'Automated recurring billing',
        'Advanced analytics and reporting',
        'Integrated payment processing',
        'Priority support (4-hour response)',
        'Unlimited team collaboration',
      ],
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'Tailored pricing',
      features: [
        'All Professional features',
        'Multi-currency & tax support',
        'Custom API integrations',
        'Dedicated account manager',
        'Full API access & developer support',
        'White-label solution',
        '99.9% uptime SLA guarantee',
      ],
    },
  ];

  return (
    <div className="bg-white">
      <section
        className="text-dark py-5"
        style={{
          background:
            'radial-gradient(circle at top left, #fff8e1 0%, #ffe082 50%, #ffc108 90%)',
          boxShadow: 'inset 0 0 80px rgba(123, 31, 162, 0.25)',
          minHeight: '100vh',
          width: '100%',
          padding: '40px 0',
        }}
      >
        <div className="container-fluid px-3 px-md-4 px-lg-5 my-5">
          <div className="row align-items-center">
            <div className="col-lg-6 text-start">
              <div className="mb-4">
                <span
                  className="badge rounded-pill px-4 py-2"
                  style={{
                    backgroundColor: '#faefccff',
                    color: '#fcb000ff',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    border: '2px solid #f5bd06c9',
                  }}
                >
                  CRM Solution
                </span>
              </div>
              <h1 className="display-4 fw-bold mb-4">
                Streamline Your Financial Operations
              </h1>
              <p className="lead mb-4">
                Advanced invoicing and payment management platform designed to
                optimize your cash flow, automate billing processes, and provide
                comprehensive financial visibility.
              </p>
              <div className="d-flex gap-3 mb-4">
                <button
                  className="btn btn-lg d-flex align-items-center justify-content-center gap-2 shadow-lg"
                  onClick={() => onNavigate("schedule-demo")}
                  style={{
                    background: "linear-gradient(135deg, #fcb000ff)",
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
              <div className="d-flex flex-column flex-sm-row gap-3 pt-3 text-center text-sm-start">
                <div>
                  <h3 className="fw-bold mb-0">50%</h3>
                  <small>Faster Payment Processing</small>
                </div>
                <div>
                  <h3 className="fw-bold mb-0">95%</h3>
                  <small>Reduced Billing Errors</small>
                </div>
                <div>
                  <h3 className="fw-bold mb-0">24/7</h3>
                  <small>Platform Availability</small>
                </div>
              </div>
            </div>
            <div className="col-lg-6 text-center mt-4 mt-lg-0">
              <img
                src="https://www.bestinfohub.com/wp-content/uploads/2024/01/demystifying-account-planning.jpg"
                alt="Hands using invoicing software"
                className="img-fluid rounded shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>
      <section className="py-5 bg-light">
        <div className="container-fluid px-3 px-md-4 px-lg-5 py-5">
          <div className="text-center mb-5">
            <h2 className="display-5 fw-bold mb-3">Comprehensive Billing Solutions</h2>
            <p className="lead text-muted">
              Enterprise-grade features to optimize your entire billing lifecycle
            </p>
          </div>
          <div className="row g-4">
            {features.map((feature, idx) => (
              <div className="col-12 col-md-6 col-lg-4" key={idx}>
                <div
                  className="card h-100 border-0 shadow-sm"
                  style={{
                    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.05)';
                    e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
                  }}
                >
                  <div className="card-body p-4 text-center text-md-start">
                    <div className="text-warning mb-3">{feature.icon}</div>
                    <h5 className="card-title fw-bold">{feature.title}</h5>
                    <p className="card-text text-muted">{feature.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="py-5">
        <div className="container-fluid px-3 px-md-4 px-lg-5 py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0 text-center text-lg-start">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800"
                alt="Financial Team Collaboration"
                className="img-fluid rounded shadow"
              />
            </div>
            <div className="col-lg-6">
              <h2 className="display-5 fw-bold mb-4">
                Transform Your Financial Operations
              </h2>
              <p className="lead text-muted mb-4">
                Trusted by finance professionals worldwide to enhance efficiency and drive revenue growth.
              </p>
              <ul className="list-unstyled">
                {benefits.map((benefit, idx) => (
                  <li key={idx} className="d-flex align-items-center mb-3">
                    <CheckCircle size={24} className="text-warning me-3 flex-shrink-0" />
                    <span className="fs-5">{benefit}</span>
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
                         <div className="card-header bg-warning text-white text-center py-2">
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
                             plan.popular ? "btn-warning" : "btn-outline-success"
                           } w-100`}
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
      <section className="py-5 text-white" style={{ background: '#f9c968ff' }}>
        <div className="container-fluid px-3 px-md-4 px-lg-5 py-5 text-center">
          <h2 className="display-5 fw-bold mb-4">
            Ready to Optimize Your Billing Process?
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
      </section>
    </div>
  );
}
