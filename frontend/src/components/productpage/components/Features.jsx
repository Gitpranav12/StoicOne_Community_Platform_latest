import { useState } from 'react';
import { Users, FileText, Briefcase, Zap, ArrowRight } from 'lucide-react';
import HRMS from './Images/HRMS.jpg';
import CRM2 from './Images/CRM2.png';

export function Features() {
  const [activeTab, setActiveTab] = useState('crm');

  const features = {
    crm: {
      label: 'CRM',
      icon: <Users size={24} />,
      title: 'Customer Relationship Management',
      description: 'Manage your entire sales process with an intuitive interface. Track deals through every stage, nurture leads, and close more deals with intelligent insights.',
      image: CRM2,
      points: [
        'Visual sales pipeline with drag-and-drop interface',
        'Intelligent lead scoring and prioritization',
        'Email integration with Gmail and Outlook',
        'Complete customer interaction history',
        'Automated deal rotation and assignment',
        'Advanced win/loss analysis and forecasting'
      ],
      color: '#1E88E5',
      stats: [
        { value: '40%', label: 'More Conversions' },
        { value: '3x', label: 'Faster Sales Cycle' }
      ]
    },
    hrm: {
      label: 'HRM',
      icon: <Briefcase size={24} />,
      title: 'Human Resource Management',
      description: 'Complete HR solution for managing employees, tracking performance, streamlining recruitment, and handling all your workforce needs.',
      image: HRMS,
      points: [
        'Comprehensive employee database and profiles',
        'Automated leave and attendance management',
        'Performance evaluation and review system',
        'Streamlined recruitment and onboarding',
        'Payroll integration and management',
        'Training and development tracking'
      ],
      color: '#43A047',
      stats: [
        { value: '60%', label: 'Time Saved' },
        { value: '85%', label: 'Employee Satisfaction' }
      ]
    },
    invoicing: {
      label: 'Invoicing',
      icon: <FileText size={24} />,
      title: 'Invoice & Billing System',
      description: 'Generate professional invoices, track payments, and manage your finances with automated tools and comprehensive reporting.',
      image: 'https://images.unsplash.com/photo-1735825764457-ffdf0b5aa5dd?w=800',
      points: [
        'Professional invoice templates and customization',
        'Automated recurring invoices and scheduling',
        'Real-time payment tracking and reminders',
        'Multi-currency and tax calculation support',
        'Automated tax compliance and reporting',
        'Comprehensive financial analytics dashboard'
      ],
      color: '#FB8C00',
      stats: [
        { value: '50%', label: 'Faster Payments' },
        { value: '95%', label: 'Accuracy Rate' }
      ]
    },
    suite: {
      label: 'Business Suite',
      icon: <Zap size={24} />,
      title: 'Complete Business Suite',
      description: 'All-in-one solution with cross-module automation, unified analytics, seamless integration, and enterprise-grade security.',
      image: 'https://images.unsplash.com/photo-1704655295066-681e61ecca6b?w=800',
      points: [
        'Unified dashboard for all business modules',
        'Cross-module workflow automation engine',
        'Real-time analytics and business insights',
        'Custom integration and API capabilities',
        'Advanced role-based access control',
        'Enterprise security and compliance features'
      ],
      color: '#8E24AA',
      stats: [
        { value: '70%', label: 'Productivity Boost' },
        { value: '100%', label: 'Data Sync' }
      ]
    }
  };

  return (
    <section id="features" className="py-5 bg-white">
      <div className="container py-5">
        <div className="text-center mb-5">
          <h2 className="display-5 fw-bold text-dark mb-3">
            Powerful Features for Modern Teams
          </h2>
          <p className="text-muted lead">
            Everything you need to manage your business and grow efficiently
          </p>
        </div>

        {/* Tabs Navigation */}
        <div className="mb-5">
          <div className="d-flex justify-content-center flex-wrap gap-3">
            {Object.keys(features).map((key) => (
              <button
                key={key}
                className={`btn d-flex align-items-center gap-2`}
                onClick={() => setActiveTab(key)}
                style={{
                  borderRadius: '12px',
                  padding: '12px 28px',
                  transition: 'all 0.3s ease',
                  backgroundColor: activeTab === key ? features[key].color : 'transparent',
                  color: activeTab === key ? 'white' : '#6c757d',
                  border: activeTab === key ? 'none' : '2px solid #dee2e6',
                  fontWeight: '600',
                  transform: activeTab === key ? 'scale(1.05)' : 'scale(1)',
                  boxShadow: activeTab === key ? `0 8px 20px ${features[key].color}40` : 'none'
                }}
              >
                {features[key].icon}
                <span>{features[key].label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {Object.keys(features).map((key) => (
            <div 
              key={key}
              className={activeTab === key ? 'd-block' : 'd-none'}
            >
              <div className="row align-items-center g-5">
                {/* Content */}
                <div className="col-lg-6">
                  <div 
                    className="d-inline-flex align-items-center justify-content-center rounded mb-4"
                    style={{
                      width: '80px',
                      height: '80px',
                      background: `linear-gradient(135deg, ${features[key].color}, ${features[key].color}dd)`,
                      color: 'white',
                      boxShadow: `0 10px 25px ${features[key].color}40`
                    }}
                  >
                    {features[key].icon}
                  </div>
                  
                  <h3 className="fw-bold text-dark mb-3 display-6">
                    {features[key].title}
                  </h3>
                  
                  <p className="text-muted lead mb-4">
                    {features[key].description}
                  </p>

                  {/* Feature Points */}
                  <ul className="list-unstyled mb-4">
                    {features[key].points.map((point, idx) => (
                      <li key={idx} className="d-flex align-items-start mb-3">
                        <svg 
                          className="me-3 mt-1 flex-shrink-0" 
                          width="24" 
                          height="24" 
                          fill="none" 
                          stroke={features[key].color} 
                          viewBox="0 0 24 24"
                        >
                          <path 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            strokeWidth={2.5} 
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" 
                          />
                        </svg>
                        <span className="text-dark">{point}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Stats */}
                  <div className="d-flex gap-4 mb-4">
                    {features[key].stats.map((stat, idx) => (
                      <div 
                        key={idx}
                        className="p-3 rounded border"
                        style={{
                          backgroundColor: `${features[key].color}10`,
                          borderColor: `${features[key].color}30`
                        }}
                      >
                        <h4 className="fw-bold mb-0" style={{ color: features[key].color }}>
                          {stat.value}
                        </h4>
                        <small className="text-muted">{stat.label}</small>
                      </div>
                    ))}
                  </div>

                </div>

                {/* Visual */}
                <div className="col-lg-6">
                  <div className="rounded shadow-lg overflow-hidden">
                    <img
                      src={features[key].image}
                      alt={features[key].title}
                      className="img-fluid w-100"
                      style={{
                        maxHeight: '500px',
                        objectFit: 'cover'
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
