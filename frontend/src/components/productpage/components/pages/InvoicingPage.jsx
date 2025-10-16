import { FileText, DollarSign, BarChart3, Zap, CreditCard, Globe, CheckCircle, ArrowRight } from 'lucide-react';

export function InvoicingPage({ onNavigate }) {
  const features = [
    {
      icon: <FileText size={48} />,
      title: 'Professional Invoice Creation',
      description: 'Generate polished, branded invoices with customizable templates and automated client details.'
    },
    {
      icon: <DollarSign size={48} />,
      title: 'Payment Management',
      description: 'Track payment statuses, monitor overdue accounts, and automate payment reminder notifications.'
    },
    {
      icon: <BarChart3 size={48} />,
      title: 'Financial Analytics',
      description: 'Gain valuable insights with comprehensive financial reporting and revenue performance metrics.'
    },
    {
      icon: <Zap size={48} />,
      title: 'Workflow Automation',
      description: 'Automate recurring billing, payment follow-ups, and client communication workflows.'
    },
    {
      icon: <CreditCard size={48} />,
      title: 'Integrated Payment Processing',
      description: 'Seamlessly accept online payments through multiple secure payment gateways.'
    },
    {
      icon: <Globe size={48} />,
      title: 'Global Currency Support',
      description: 'Handle international clients with multi-currency support and real-time exchange rate integration.'
    }
  ];

  const benefits = [
    'Accelerate payment cycles by 50% through automation',
    'Achieve 95% reduction in billing discrepancies',
    'Save 10+ hours weekly on administrative tasks',
    'Deliver consistently branded professional invoices',
    'Access real-time financial performance dashboards',
    'Automate tax compliance and reporting requirements'
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
        'Email support response within 24 hours',
        'Up to 3 team members'
      ]
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
        'Priority support with 4-hour response',
        'Unlimited team collaboration'
      ]
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'Tailored pricing',
      features: [
        'All Professional features included',
        'Multi-currency and international tax support',
        'Custom API integrations',
        'Dedicated account management',
        'Full API access and developer support',
        'White-label solution available',
        '99.9% uptime SLA guarantee'
      ]
    }
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="text-white py-5" style={{ backgroundColor: '#f9c968ff' }}>
        <div className="container py-5 my-5">
          <div className="row align-items-center">
            <div className="col-12 col-lg-6 mb-4 mb-lg-0">
              <div className="badge bg-white text-warning mb-3 px-3 py-2">
                Enterprise Invoicing Platform
              </div>
              <h1 className="display-4 display-lg-3 fw-bold mb-4">
                Streamline Your Financial Operations
              </h1>
              <p className="lead mb-4">
                Advanced invoicing and payment management platform designed to optimize your cash flow, 
                automate billing processes, and provide comprehensive financial visibility.
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
            <div className="col-12 col-lg-6 text-center">
              <img
                src="https://www.bestinfohub.com/wp-content/uploads/2024/01/demystifying-account-planning.jpg"
                alt="Hands using invoicing software on desktop"
                className="img-fluid rounded shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

    {/* Features Section */}
<section className="py-5 bg-light">
  <div className="container py-5">
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
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'scale(1.05)';
              e.currentTarget.style.boxShadow = '0 12px 24px rgba(0,0,0,0.2)';
            }}
            onMouseLeave={e => {
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

      {/* Benefits Section */}
      <section className="py-5">
        <div className="container py-5">
          <div className="row align-items-center">
            <div className="col-12 col-lg-6 mb-4 mb-lg-0 text-center text-lg-start">
              <img
                src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=800"
                alt="Financial Team Collaboration"
                className="img-fluid rounded shadow"
              />
            </div>
            <div className="col-12 col-lg-6">
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

     {/* Pricing Section */}
<section className="py-5 bg-light">
  <div className="container py-5">
    <div className="text-center mb-5">
      <h2 className="display-5 fw-bold mb-3">Flexible Enterprise Plans</h2>
      <p className="lead text-muted">
        Scalable solutions designed to grow with your business
      </p>
    </div>
    <div className="row g-4">
      {pricing.map((plan, idx) => (
        <div className="col-12 col-md-6 col-lg-4" key={idx}>
          <div
            className={`card h-100 ${plan.popular ? 'border-warning shadow-lg' : 'border-0 shadow-sm'}`}
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
            {plan.popular && (
              <div className="card-header bg-warning text-dark text-center py-2 fw-bold">
                Most Popular
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
                    <CheckCircle size={18} className="text-warning me-2" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                className={`btn ${plan.popular ? 'btn-warning' : 'btn-outline-warning'} w-100`}
                style={{
                  transition: '0.3s',
                }}
                onMouseEnter={e => {
                  if (!plan.popular) {
                    e.target.style.backgroundColor = '#ffc107';
                    e.target.style.color = '#212529';
                  }
                }}
                onMouseLeave={e => {
                  if (!plan.popular) {
                    e.target.style.backgroundColor = '';
                    e.target.style.color = '';
                  }
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
      <section className="py-5 text-white" style={{ background:"#f9c968ff" }}>
        <div className="container py-5">
          <div className="row justify-content-center text-center">
            <div className="col-12 col-lg-8">
              <h2 className="display-5 fw-bold mb-4">
                Ready to Optimize Your Billing Process?
              </h2>
              <p className="lead mb-4">
                Experience the platform with our 30-day enterprise trial. No commitment required.
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
