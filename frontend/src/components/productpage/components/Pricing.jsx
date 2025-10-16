import { Check, Sparkles } from 'lucide-react';
import './Pricing.css'; 

export function Pricing() {
  const plans = [
    {
      name: 'Starter',
      price: '$29',
      period: 'per user/month',
      description: 'Perfect for small teams getting started',
      features: [
        'Up to 5 users',
        '1,000 contacts',
        'Basic pipeline management',
        'Email integration',
        'Mobile app access',
        'Community support'
      ],
      cta: 'Start Free Trial',
      highlighted: false
    },
    {
      name: 'Pro',
      price: '$79',
      period: 'per user/month',
      description: 'Best for growing teams',
      features: [
        'Up to 50 users',
        'Unlimited contacts',
        'Advanced pipeline & automation',
        'Email & calendar sync',
        'Custom reports & dashboards',
        'Priority support',
        'API access',
        'Sales forecasting'
      ],
      cta: 'Start Free Trial',
      highlighted: true,
      badge: 'Most Popular'
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: 'contact us',
      description: 'For large organizations',
      features: [
        'Unlimited users',
        'Unlimited contacts',
        'Everything in Pro',
        'Dedicated account manager',
        'Custom integrations',
        'Advanced security & compliance',
        'SLA guarantee',
        'Custom training'
      ],
      cta: 'Contact Sales',
      highlighted: false
    }
  ];

  return (
    <section
      id="pricing"
      className="section-padding bg-white"
      style={{
        paddingTop: '120px',
        paddingBottom: '120px',
        scrollMarginTop: '80px'
      }}
    >
      <div className="container">
        {/* Section Header */}
        <div className="text-center mb-5">
          <h2 className="h1 fw-semibold text-dark mb-3">
            Simple, Transparent Pricing
          </h2>
          <p className="lead text-muted">
            Choose the perfect plan for your team. All plans include a 14-day free trial.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="row g-4 justify-content-center">
          {plans.map((plan) => (
            <div key={plan.name} className="col-12 col-md-6 col-lg-4">
              <div className="card pricing-card h-100 position-relative">
                {plan.badge && (
                  <div className="position-absolute top-0 start-50 translate-middle">
                    <div className="badge bg-warning text-dark d-flex align-items-center gap-1 px-3 py-2">
                      <Sparkles size={16} />
                      <span>{plan.badge}</span>
                    </div>
                  </div>
                )}

                <div className="card-body text-center p-4" style={{ paddingTop: plan.badge ? '3rem' : '2rem' }}>
                  <h3 className="h4 fw-semibold mb-2 text-dark">{plan.name}</h3>
                  <div className="mb-2">
                    <span className="h2 fw-bold text-dark">{plan.price}</span>
                    <span className="text-muted">/{plan.period}</span>
                  </div>
                  <p className="mb-4 text-muted">{plan.description}</p>

                  <ul className="list-unstyled mb-4">
                    {plan.features.map((feature) => (
                      <li key={feature} className="d-flex align-items-start gap-2 mb-3">
                        <div className="d-flex align-items-center justify-content-center rounded-circle flex-shrink-0 bg-primary bg-opacity-10"
                             style={{ width: '20px', height: '20px' }}>
                          <Check size={14} className="text-primary" />
                        </div>
                        <span className="text-dark">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className="btn btn-primary w-100 btn-lg">{plan.cta}</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Section Footer */}
        <div className="text-center mt-5">
          <p className="text-muted">
            All plans include a 14-day free trial. No credit card required.
          </p>
        </div>
      </div>
    </section>
  );
}
