import {
  Users,
  Target,
  Mail,
  Calendar,
  BarChart3,
  TrendingUp,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import CrmImage from "../../../../assets/CRM1.jpg";

export function CRMPage({ onNavigate }) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState(null);

  const features = [
    {
      icon: <Target size={48} />,
      title: "Lead Management",
      description:
        "Capture new leads from all your marketing channels automatically, then organize and prioritize prospects for optimal follow-up and stronger conversions. Manage your outreach from a single, simple dashboard.",
    },
    {
      icon: <Users size={48} />,
      title: "Contact Database",
      description:
        "Build and maintain an organized customer database with advanced segmentation, customizable fields, and an easy-to-navigate history of all touchpoints to improve relationships and communications.",
    },
    {
      icon: <Calendar size={48} />,
      title: "Sales Pipeline",
      description:
        "Visualize every stage of your sales process with an intuitive drag-and-drop pipeline. Custom stages and automation help drive deals forward, letting your team track progress and close opportunities efficiently.",
    },
    {
      icon: <Mail size={48} />,
      title: "Email Integration",
      description:
        "Connect your Gmail and Outlook accounts for seamless syncing and automatic email logging. Stay on top of every conversation, track opens and clicks, and ensure transparent communications.",
    },
    {
      icon: <BarChart3 size={48} />,
      title: "Analytics & Reports",
      description:
        "Monitor performance in real-time with dynamic dashboards and tailored reports. Leverage smart AI tools for sales forecasts and insights, helping you make data-driven decisions every day.",
    },
    {
      icon: <TrendingUp size={48} />,
      title: "Sales Automation",
      description:
        "Automate repetitive tasks, set reminders for follow-ups, and streamline your daily workflows. Free your team to focus on building client relationships and closing more deals faster.",
    },
  ];

  const benefits = [
    "Increase sales productivity by 40%",
    "Reduce sales cycle time by 30%",
    "Improve customer retention by 25%",
    "Boost conversion rates by 35%",
    "Save 10+ hours per week on admin tasks",
    "Get 360° view of customer interactions",
  ];

  const pricing = [
    {
      name: "Starter",
      price: "$29",
      period: "/user/month",
      features: [
        "Up to 5 users",
        "1,000 contacts",
        "Basic pipeline",
        "Email integration",
        "Mobile app",
        "Community support",
      ],
    },
    {
      name: "Professional",
      price: "$79",
      period: "/user/month",
      popular: true,
      features: [
        "Up to 50 users",
        "Unlimited contacts",
        "Advanced pipeline",
        "Automation workflows",
        "Custom reports",
        "Priority support",
        "API access",
      ],
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "Contact us",
      features: [
        "Unlimited users",
        "Unlimited contacts",
        "Everything in Pro",
        "Dedicated manager",
        "Custom integrations",
        "SLA guarantee",
        "White-label options",
      ],
    },
  ];

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section
        className="py-5 text-black"
        style={{
          background:
            "linear-gradient(135deg, #ffffff 0%, #e3f2fd 30%, #bbdefb 70%, #ffffff 100%)",
          boxShadow: "inset 0 0 80px rgba(123, 31, 162, 0.25)",
          minHeight: "100vh",
          width: "100%",
          padding: "40px 0",
        }}
      >
        <div className="container-fluid px-4 my-5">
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="mb-4">
                <span
                  className="badge rounded-pill px-4 py-2"
                  style={{
                    backgroundColor: "#E3F2FD",
                    color: "#1E88E5",
                    fontSize: "0.9rem",
                    fontWeight: "600",
                    border: "2px solid #1E88E550",
                  }}
                >
                  CRM Solution
                </span>
              </div>
              <h1 className="display-4 fw-bold mb-3">
                Empower Your Team Win More Deals
              </h1>
              <p className="lead mb-4">
                Transform your sales process with our intelligent CRM platform.
                Track leads, manage contacts, and close deals faster with
                powerful automation and insights.
              </p>

              <div className="d-flex gap-3 mb-4">
                <button
                  className="btn btn-lg d-flex align-items-center justify-content-center gap-2 shadow-lg"
                  onClick={() => onNavigate("schedule-demo")}
                  style={{
                    background: "linear-gradient(135deg, #1E88E5, #1565C0)",
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

              <div className="d-flex gap-4 pt-3">
                <div>
                  <h3 className="fw-bold mb-0">40%</h3>
                  <small>More Conversions</small>
                </div>
                <div>
                  <h3 className="fw-bold mb-0">3x</h3>
                  <small>Faster Sales</small>
                </div>
                <div>
                  <h3 className="fw-bold mb-0">99.9%</h3>
                  <small>Uptime</small>
                </div>
              </div>
            </div>

            <div className="col-lg-6">
              <img
                src={CrmImage}
                alt="CRM Dashboard"
                className="img-fluid rounded shadow-lg"
                style={{ maxWidth: "95%", marginLeft: "auto" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-5 bg-light">
        <div className="container-fluid px-4 py-5">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold mb-3">Powerful CRM Features</h2>
            <p className="lead text-muted">
              Everything you need to manage customer relationships and grow your
              business
            </p>
          </div>
          <div className="row g-4">
            {features.map((feature, idx) => (
              <div className="col-md-6 col-lg-4" key={idx}>
                <div className="card h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div className="text-primary mb-3">{feature.icon}</div>
                    <h5 className="card-title fw-bold">{feature.title}</h5>
                    <p className="card-text text-muted">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-5">
        <div className="container-fluid px-4 py-5">
          <div className="row align-items-center">
            <div className="col-lg-6 mb-4 mb-lg-0">
              <img
                src="https://images.unsplash.com/photo-1590649849991-e9af438ea77d?w=800"
                alt="Sales Team"
                className="img-fluid rounded shadow"
              />
            </div>
            <div className="col-lg-6">
              <h2 className="display-6 fw-bold mb-4">Why Choose Our CRM?</h2>
              <p className="lead text-muted mb-4">
                Join thousands of sales teams who have transformed their process
                with our CRM platform.
              </p>
              <ul className="list-unstyled">
                {benefits.map((benefit, idx) => (
                  <li
                    key={idx}
                    className="d-flex align-items-center mb-3 fs-5"
                  >
                    <CheckCircle
                      size={22}
                      className="text-success me-3 flex-shrink-0"
                    />
                    {benefit}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-5 bg-light">
        <div className="container-fluid px-4 py-5">
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold mb-3">Simple Pricing</h2>
            <p className="lead text-muted">
              Choose the perfect plan for your team
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
                    <div className="card-header bg-primary text-white text-center py-2">
                      Most Popular
                    </div>
                  )}
                  <div className="card-body p-4 text-center">
                    <h4 className="fw-bold mb-3">{plan.name}</h4>
                    <div className="mb-4">
                      <h2 className="display-5 fw-bold">{plan.price}</h2>
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
                        plan.popular ? "btn-primary" : "btn-outline-success"
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

      {/* CTA Section */}
      <section className="py-5 bg-primary text-white">
        <div className="container-fluid px-4 py-5">
          <div className="row justify-content-center text-center">
            <div className="col-lg-8">
              <h2 className="display-6 fw-bold mb-4">
                Ready to Transform Your Sales?
              </h2>
              <p className="lead mb-4">
                Start your 14-day free trial today. No credit card required.
              </p>
              <div className="d-flex gap-3 justify-content-center">
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
                  onClick={() => navigate("/home")}
                >
                  Back to Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
