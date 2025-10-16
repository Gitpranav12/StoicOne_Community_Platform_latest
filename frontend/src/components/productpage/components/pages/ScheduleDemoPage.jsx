import { useState } from 'react';
import { Calendar, Clock, User, Mail, Building2, Phone, CheckCircle2, ArrowLeft, ArrowRight, Video, Globe, Users, Zap, Star, Award, TrendingUp } from 'lucide-react';

export function ScheduleDemoPage({ onNavigate }) {
  const [step, setStep] = useState(1); // 1: Select Expert, 2: Select Date & Time, 3: Enter Details, 4: Success
  const [selectedExpert, setSelectedExpert] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  
  const [formData, setFormData] = useState({
    fullName: '',
    workEmail: '',
    companyName: '',
    phoneNumber: '',
    message: ''
  });

  // Experts/Product Specialists
  const experts = [
    {
      id: 1,
      name: 'Sarah Mitchell',
      role: 'Senior Product Specialist',
      expertise: 'CRM & Sales Automation',
      avatar: 'SM',
      color: '#1E88E5',
      rating: 4.9,
      demos: 500,
      languages: ['English', 'Spanish']
    },
    {
      id: 2,
      name: 'Michael Chen',
      role: 'Enterprise Solutions Expert',
      expertise: 'Full Business Suite',
      avatar: 'MC',
      color: '#43A047',
      rating: 5.0,
      demos: 750,
      languages: ['English', 'Mandarin']
    },
    {
      id: 3,
      name: 'Emily Rodriguez',
      role: 'HR & Finance Specialist',
      expertise: 'HRM & Invoicing',
      avatar: 'ER',
      color: '#FB8C00',
      rating: 4.8,
      demos: 430,
      languages: ['English', 'French']
    }
  ];

  // Generate next 14 days
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip weekends
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date);
      }
    }
    return dates;
  };

  const dates = generateDates();

  // Available time slots
  const timeSlots = [
    '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
    '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
    '04:00 PM', '04:30 PM'
  ];

  const handleExpertSelect = (expert) => {
    setSelectedExpert(expert);
    setStep(2);
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleTimeSelect = (time) => {
    setSelectedTime(time);
  };

  const handleContinueToForm = () => {
    if (selectedDate && selectedTime) {
      setStep(3);
    }
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowSuccess(true);
    setStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getDayName = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getMonthDay = (date) => {
    return date.getDate();
  };

  return (
    <div style={{ background: 'linear-gradient(180deg, #f8fafb 0%, #ffffff 100%)', minHeight: '100vh' }}>
      {/* Header */}
      <section 
        className="position-relative"
        style={{ 
          background: 'linear-gradient(135deg, #1E88E5 0%, #1565C0 100%)',
          paddingTop: '100px',
          paddingBottom: '60px'
        }}
      >
        <div className="container">
          <button 
            onClick={() => onNavigate('home')}
            className="btn btn-link text-decoration-none mb-3 p-0 text-white d-inline-flex align-items-center"
            style={{ opacity: 0.95 }}
          >
            <ArrowLeft size={18} className="me-2" />
            Back to Home
          </button>

          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="d-inline-block mb-3">
                <span 
                  className="badge px-3 py-2"
                  style={{ 
                    background: 'rgba(255, 255, 255, 0.2)',
                    color: 'white',
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                    borderRadius: '8px'
                  }}
                >
                  <Video size={16} className="me-2" style={{ display: 'inline-block', verticalAlign: 'middle' }} />
                  30-Minute Live Demo
                </span>
              </div>
              
              <h1 className="display-4 fw-bold text-white mb-3">
                Schedule Your Personalized Demo
              </h1>
              
              <p className="lead text-white mb-4" style={{ opacity: 0.95 }}>
                See how our business suite transforms operations. Choose your expert, pick a time, and get started in minutes.
              </p>

              <div className="d-flex flex-wrap gap-4 text-white">
                <div className="d-flex align-items-center gap-2">
                  <CheckCircle2 size={20} />
                  <span>No credit card required</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <CheckCircle2 size={20} />
                  <span>Instant confirmation</span>
                </div>
                <div className="d-flex align-items-center gap-2">
                  <CheckCircle2 size={20} />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
            <div className="col-lg-5">
              <div 
                className="card border-0 shadow-lg p-4 mt-4 mt-lg-0"
                style={{ borderRadius: '20px', background: 'rgba(255, 255, 255, 0.95)' }}
              >
                <div className="d-flex align-items-center gap-3 mb-3">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '48px',
                      height: '48px',
                      background: step >= 1 ? 'linear-gradient(135deg, #1E88E5, #1565C0)' : '#e9ecef',
                      color: 'white'
                    }}
                  >
                    {step > 1 ? <CheckCircle2 size={24} /> : '1'}
                  </div>
                  <div className="flex-grow-1">
                    <small className="text-muted d-block">Step 1</small>
                    <h6 className="fw-bold mb-0 text-dark">Choose Expert</h6>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3 mb-3">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '48px',
                      height: '48px',
                      background: step >= 2 ? 'linear-gradient(135deg, #1E88E5, #1565C0)' : '#e9ecef',
                      color: step >= 2 ? 'white' : '#6c757d'
                    }}
                  >
                    {step > 2 ? <CheckCircle2 size={24} /> : '2'}
                  </div>
                  <div className="flex-grow-1">
                    <small className="text-muted d-block">Step 2</small>
                    <h6 className={`fw-bold mb-0 ${step >= 2 ? 'text-dark' : 'text-muted'}`}>Select Date & Time</h6>
                  </div>
                </div>

                <div className="d-flex align-items-center gap-3">
                  <div 
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{
                      width: '48px',
                      height: '48px',
                      background: step >= 3 ? 'linear-gradient(135deg, #1E88E5, #1565C0)' : '#e9ecef',
                      color: step >= 3 ? 'white' : '#6c757d'
                    }}
                  >
                    {step > 3 ? <CheckCircle2 size={24} /> : '3'}
                  </div>
                  <div className="flex-grow-1">
                    <small className="text-muted d-block">Step 3</small>
                    <h6 className={`fw-bold mb-0 ${step >= 3 ? 'text-dark' : 'text-muted'}`}>Enter Details</h6>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-5">
        <div className="container">
          {/* Step 1: Select Expert */}
          {step === 1 && (
            <div className="row justify-content-center">
              <div className="col-lg-10">
                <div className="text-center mb-5">
                  <h2 className="fw-bold text-dark mb-2">Choose Your Product Specialist</h2>
                  <p className="text-muted">All our experts are certified and ready to help you</p>
                </div>

                <div className="row g-4">
                  {experts.map((expert) => (
                    <div className="col-md-4" key={expert.id}>
                      <div 
                        className="card border-0 shadow-sm h-100"
                        style={{ 
                          borderRadius: '20px',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                          overflow: 'hidden'
                        }}
                        onClick={() => handleExpertSelect(expert)}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-8px)';
                          e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                        }}
                      >
                        <div 
                          className="p-4 text-center"
                          style={{
                            background: `linear-gradient(135deg, ${expert.color}15, ${expert.color}05)`
                          }}
                        >
                          <div 
                            className="rounded-circle d-inline-flex align-items-center justify-content-center fw-bold mb-3"
                            style={{
                              width: '100px',
                              height: '100px',
                              background: `linear-gradient(135deg, ${expert.color}, ${expert.color}dd)`,
                              color: 'white',
                              fontSize: '2rem',
                              border: '4px solid white',
                              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)'
                            }}
                          >
                            {expert.avatar}
                          </div>
                        </div>
                        
                        <div className="card-body text-center">
                          <h5 className="fw-bold text-dark mb-1">{expert.name}</h5>
                          <p className="text-muted mb-2" style={{ fontSize: '0.9rem' }}>
                            {expert.role}
                          </p>
                          
                          <div 
                            className="badge px-3 py-2 mb-3"
                            style={{
                              background: `${expert.color}15`,
                              color: expert.color,
                              borderRadius: '8px'
                            }}
                          >
                            {expert.expertise}
                          </div>

                          <div className="d-flex justify-content-center gap-3 mb-3 pt-3 border-top">
                            <div>
                              <div className="d-flex align-items-center gap-1 justify-content-center">
                                <Star size={14} className="text-warning" fill="currentColor" />
                                <span className="fw-bold text-dark">{expert.rating}</span>
                              </div>
                              <small className="text-muted">Rating</small>
                            </div>
                            <div className="border-start ps-3">
                              <div className="fw-bold text-dark">{expert.demos}+</div>
                              <small className="text-muted">Demos</small>
                            </div>
                          </div>

                          <div className="d-flex gap-2 justify-content-center flex-wrap mb-2">
                            {expert.languages.map((lang, idx) => (
                              <span 
                                key={idx}
                                className="badge bg-light text-dark"
                                style={{ fontSize: '0.75rem' }}
                              >
                                <Globe size={12} className="me-1" />
                                {lang}
                              </span>
                            ))}
                          </div>

                          <button 
                            className="btn btn-primary w-100 mt-3"
                            style={{ borderRadius: '10px' }}
                            onClick={() => handleExpertSelect(expert)}
                          >
                            Select {expert.name.split(' ')[0]}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Select Date & Time */}
          {step === 2 && selectedExpert && (
            <div className="row justify-content-center">
              <div className="col-lg-10">
                {/* Selected Expert Info */}
                <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px' }}>
                  <div className="card-body p-3">
                    <div className="d-flex align-items-center justify-content-between">
                      <div className="d-flex align-items-center gap-3">
                        <div 
                          className="rounded-circle d-flex align-items-center justify-content-center fw-bold"
                          style={{
                            width: '56px',
                            height: '56px',
                            background: `linear-gradient(135deg, ${selectedExpert.color}, ${selectedExpert.color}dd)`,
                            color: 'white',
                            fontSize: '1.2rem'
                          }}
                        >
                          {selectedExpert.avatar}
                        </div>
                        <div>
                          <h6 className="fw-bold text-dark mb-0">{selectedExpert.name}</h6>
                          <small className="text-muted">{selectedExpert.role}</small>
                        </div>
                      </div>
                      <button 
                        className="btn btn-link text-primary p-0"
                        onClick={() => setStep(1)}
                      >
                        Change
                      </button>
                    </div>
                  </div>
                </div>

                <div className="row g-4">
                  {/* Calendar - Date Selection */}
                  <div className="col-lg-6">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '20px' }}>
                      <div className="card-body p-4">
                        <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                          <Calendar size={24} style={{ color: '#1E88E5' }} />
                          Select a Date
                        </h5>
                        
                        <div className="row g-2">
                          {dates.slice(0, 10).map((date, idx) => {
                            const isSelected = selectedDate && 
                              date.toDateString() === selectedDate.toDateString();
                            
                            return (
                              <div className="col-6" key={idx}>
                                <button
                                  className="btn w-100 border"
                                  style={{
                                    borderRadius: '12px',
                                    padding: '16px 12px',
                                    background: isSelected ? 'linear-gradient(135deg, #1E88E5, #1565C0)' : 'white',
                                    color: isSelected ? 'white' : '#212529',
                                    borderColor: isSelected ? '#1E88E5' : '#dee2e6',
                                    transition: 'all 0.2s ease'
                                  }}
                                  onClick={() => handleDateSelect(date)}
                                  onMouseEnter={(e) => {
                                    if (!isSelected) {
                                      e.currentTarget.style.borderColor = '#1E88E5';
                                      e.currentTarget.style.background = '#E3F2FD';
                                    }
                                  }}
                                  onMouseLeave={(e) => {
                                    if (!isSelected) {
                                      e.currentTarget.style.borderColor = '#dee2e6';
                                      e.currentTarget.style.background = 'white';
                                    }
                                  }}
                                >
                                  <div className="fw-bold" style={{ fontSize: '0.875rem' }}>
                                    {getDayName(date)}
                                  </div>
                                  <div className="fw-bold" style={{ fontSize: '1.5rem' }}>
                                    {getMonthDay(date)}
                                  </div>
                                  <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>
                                    {date.toLocaleDateString('en-US', { month: 'short' })}
                                  </div>
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Time Slots */}
                  <div className="col-lg-6">
                    <div className="card border-0 shadow-sm" style={{ borderRadius: '20px' }}>
                      <div className="card-body p-4">
                        <h5 className="fw-bold text-dark mb-4 d-flex align-items-center gap-2">
                          <Clock size={24} style={{ color: '#1E88E5' }} />
                          Select a Time
                        </h5>

                        {!selectedDate ? (
                          <div className="text-center py-5">
                            <Calendar size={48} className="text-muted mb-3" />
                            <p className="text-muted mb-0">Please select a date first</p>
                          </div>
                        ) : (
                          <div className="row g-2" style={{ maxHeight: '400px', overflowY: 'auto' }}>
                            {timeSlots.map((time, idx) => {
                              const isSelected = selectedTime === time;
                              
                              return (
                                <div className="col-6" key={idx}>
                                  <button
                                    className="btn w-100 border"
                                    style={{
                                      borderRadius: '10px',
                                      padding: '12px',
                                      background: isSelected ? 'linear-gradient(135deg, #1E88E5, #1565C0)' : 'white',
                                      color: isSelected ? 'white' : '#212529',
                                      borderColor: isSelected ? '#1E88E5' : '#dee2e6',
                                      transition: 'all 0.2s ease'
                                    }}
                                    onClick={() => handleTimeSelect(time)}
                                    onMouseEnter={(e) => {
                                      if (!isSelected) {
                                        e.currentTarget.style.borderColor = '#1E88E5';
                                        e.currentTarget.style.background = '#E3F2FD';
                                      }
                                    }}
                                    onMouseLeave={(e) => {
                                      if (!isSelected) {
                                        e.currentTarget.style.borderColor = '#dee2e6';
                                        e.currentTarget.style.background = 'white';
                                      }
                                    }}
                                  >
                                    <Clock size={16} className="me-2" style={{ display: 'inline-block', verticalAlign: 'middle' }} />
                                    {time}
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Continue Button */}
                    {selectedDate && selectedTime && (
                      <div className="mt-4">
                        <button
                          className="btn btn-primary btn-lg w-100"
                          style={{ 
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #1E88E5, #1565C0)',
                            border: 'none'
                          }}
                          onClick={handleContinueToForm}
                        >
                          Continue to Details
                          <ArrowRight size={20} className="ms-2" style={{ display: 'inline-block', verticalAlign: 'middle' }} />
                        </button>
                        
                        <div className="text-center mt-3 p-3 rounded" style={{ background: '#E3F2FD' }}>
                          <small className="text-dark">
                            <strong>Selected:</strong> {formatDate(selectedDate)} at {selectedTime}
                          </small>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Enter Details */}
          {step === 3 && (
            <div className="row justify-content-center">
              <div className="col-lg-8">
                {/* Summary Card */}
                <div className="card border-0 shadow-sm mb-4" style={{ borderRadius: '16px', background: 'linear-gradient(135deg, #E3F2FD, #F3E5F5)' }}>
                  <div className="card-body p-4">
                    <h6 className="fw-bold text-dark mb-3">Your Demo Session</h6>
                    <div className="row g-3">
                      <div className="col-md-4">
                        <div className="d-flex align-items-center gap-2">
                          <User size={18} style={{ color: '#1E88E5' }} />
                          <div>
                            <small className="text-muted d-block">Expert</small>
                            <strong className="text-dark">{selectedExpert.name.split(' ')[0]}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="d-flex align-items-center gap-2">
                          <Calendar size={18} style={{ color: '#1E88E5' }} />
                          <div>
                            <small className="text-muted d-block">Date</small>
                            <strong className="text-dark">{selectedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</strong>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-4">
                        <div className="d-flex align-items-center gap-2">
                          <Clock size={18} style={{ color: '#1E88E5' }} />
                          <div>
                            <small className="text-muted d-block">Time</small>
                            <strong className="text-dark">{selectedTime}</strong>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button 
                      className="btn btn-sm btn-link p-0 mt-2"
                      onClick={() => setStep(2)}
                    >
                      Change schedule
                    </button>
                  </div>
                </div>

                {/* Form Card */}
                <div className="card border-0 shadow-lg" style={{ borderRadius: '20px' }}>
                  <div className="card-body p-4 p-lg-5">
                    <h4 className="fw-bold text-dark mb-4">Almost There! Tell Us About Yourself</h4>
                    
                    <form onSubmit={handleSubmit}>
                      <div className="row g-4">
                        <div className="col-md-6">
                          <label htmlFor="fullName" className="form-label fw-semibold text-dark">
                            Full Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            id="fullName"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleFormChange}
                            placeholder="John Doe"
                            required
                            style={{ borderRadius: '10px' }}
                          />
                        </div>

                        <div className="col-md-6">
                          <label htmlFor="workEmail" className="form-label fw-semibold text-dark">
                            Work Email <span className="text-danger">*</span>
                          </label>
                          <input
                            type="email"
                            className="form-control form-control-lg"
                            id="workEmail"
                            name="workEmail"
                            value={formData.workEmail}
                            onChange={handleFormChange}
                            placeholder="john@company.com"
                            required
                            style={{ borderRadius: '10px' }}
                          />
                        </div>

                        <div className="col-md-6">
                          <label htmlFor="companyName" className="form-label fw-semibold text-dark">
                            Company Name <span className="text-danger">*</span>
                          </label>
                          <input
                            type="text"
                            className="form-control form-control-lg"
                            id="companyName"
                            name="companyName"
                            value={formData.companyName}
                            onChange={handleFormChange}
                            placeholder="Your Company Inc."
                            required
                            style={{ borderRadius: '10px' }}
                          />
                        </div>

                        <div className="col-md-6">
                          <label htmlFor="phoneNumber" className="form-label fw-semibold text-dark">
                            Phone Number <span className="text-danger">*</span>
                          </label>
                          <input
                            type="tel"
                            className="form-control form-control-lg"
                            id="phoneNumber"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleFormChange}
                            placeholder="+1 (555) 123-4567"
                            required
                            style={{ borderRadius: '10px' }}
                          />
                        </div>

                        <div className="col-12">
                          <label htmlFor="message" className="form-label fw-semibold text-dark">
                            Anything specific you'd like to discuss? (Optional)
                          </label>
                          <textarea
                            className="form-control form-control-lg"
                            id="message"
                            name="message"
                            value={formData.message}
                            onChange={handleFormChange}
                            rows="4"
                            placeholder="E.g., I'm interested in learning more about CRM features..."
                            style={{ borderRadius: '10px' }}
                          ></textarea>
                        </div>

                        <div className="col-12">
                          <button
                            type="submit"
                            className="btn btn-primary btn-lg w-100"
                            style={{
                              borderRadius: '12px',
                              padding: '16px',
                              background: 'linear-gradient(135deg, #1E88E5, #1565C0)',
                              border: 'none',
                              fontWeight: '600'
                            }}
                          >
                            <CheckCircle2 size={20} className="me-2" style={{ display: 'inline-block', verticalAlign: 'middle' }} />
                            Confirm Demo Booking
                          </button>
                        </div>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && showSuccess && (
            <div className="row justify-content-center">
              <div className="col-lg-7">
                <div 
                  className="card border-0 shadow-lg text-center"
                  style={{ 
                    borderRadius: '24px',
                    background: 'linear-gradient(135deg, #ffffff, #f8f9fa)'
                  }}
                >
                  <div className="card-body p-5">
                    <div 
                      className="d-inline-flex align-items-center justify-content-center rounded-circle mb-4"
                      style={{
                        width: '120px',
                        height: '120px',
                        background: 'linear-gradient(135deg, #4CAF50, #43A047)',
                        boxShadow: '0 20px 40px rgba(76, 175, 80, 0.3)'
                      }}
                    >
                      <CheckCircle2 size={64} className="text-white" />
                    </div>

                    <h2 className="fw-bold text-dark mb-3">You're All Set!</h2>
                    <p className="lead text-muted mb-4">
                      Your demo session has been confirmed. Check your email for the meeting link and calendar invite.
                    </p>

                    <div 
                      className="p-4 rounded mb-4"
                      style={{ background: 'linear-gradient(135deg, #E3F2FD, #F3E5F5)' }}
                    >
                      <h5 className="fw-bold text-dark mb-3">Your Demo Details</h5>
                      <div className="row g-3 text-start">
                        <div className="col-md-6">
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <User size={18} style={{ color: '#1E88E5' }} />
                            <strong className="text-dark">Expert:</strong>
                          </div>
                          <p className="mb-0 ms-4">{selectedExpert.name}</p>
                        </div>
                        <div className="col-md-6">
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <Calendar size={18} style={{ color: '#1E88E5' }} />
                            <strong className="text-dark">Date:</strong>
                          </div>
                          <p className="mb-0 ms-4">{formatDate(selectedDate)}</p>
                        </div>
                        <div className="col-md-6">
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <Clock size={18} style={{ color: '#1E88E5' }} />
                            <strong className="text-dark">Time:</strong>
                          </div>
                          <p className="mb-0 ms-4">{selectedTime}</p>
                        </div>
                        <div className="col-md-6">
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <Mail size={18} style={{ color: '#1E88E5' }} />
                            <strong className="text-dark">Email:</strong>
                          </div>
                          <p className="mb-0 ms-4">{formData.workEmail}</p>
                        </div>
                      </div>
                    </div>

                    <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
                      <button
                        className="btn btn-primary btn-lg"
                        onClick={() => onNavigate('home')}
                        style={{ borderRadius: '10px' }}
                      >
                        Back to Home
                      </button>
                      <button
                        className="btn btn-outline-primary btn-lg"
                        onClick={() => {
                          setStep(1);
                          setSelectedExpert(null);
                          setSelectedDate(null);
                          setSelectedTime(null);
                          setShowSuccess(false);
                          setFormData({
                            fullName: '',
                            workEmail: '',
                            companyName: '',
                            phoneNumber: '',
                            message: ''
                          });
                        }}
                        style={{ borderRadius: '10px' }}
                      >
                        Schedule Another Demo
                      </button>
                    </div>
                  </div>
                </div>

                {/* What's Next */}
                <div className="row g-3 mt-4">
                  <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                      <div className="card-body text-center p-4">
                        <div 
                          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                          style={{
                            width: '56px',
                            height: '56px',
                            background: '#E3F2FD',
                            color: '#1E88E5'
                          }}
                        >
                          <Mail size={24} />
                        </div>
                        <h6 className="fw-bold text-dark mb-2">Check Your Email</h6>
                        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                          Meeting link and calendar invite sent
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                      <div className="card-body text-center p-4">
                        <div 
                          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                          style={{
                            width: '56px',
                            height: '56px',
                            background: '#E8F5E9',
                            color: '#43A047'
                          }}
                        >
                          <Video size={24} />
                        </div>
                        <h6 className="fw-bold text-dark mb-2">Join the Demo</h6>
                        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                          Click the link at your scheduled time
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="card border-0 shadow-sm h-100" style={{ borderRadius: '16px' }}>
                      <div className="card-body text-center p-4">
                        <div 
                          className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                          style={{
                            width: '56px',
                            height: '56px',
                            background: '#FFF3E0',
                            color: '#FB8C00'
                          }}
                        >
                          <Zap size={24} />
                        </div>
                        <h6 className="fw-bold text-dark mb-2">Start Your Trial</h6>
                        <p className="text-muted mb-0" style={{ fontSize: '0.9rem' }}>
                          Get 14 days free after the demo
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Social Proof Section - Show on steps 1-3 */}
      {step < 4 && (
        <section className="py-5 bg-light">
          <div className="container">
            <div className="row g-4 text-center">
              <div className="col-md-3">
                <div className="d-flex flex-column align-items-center">
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{
                      width: '64px',
                      height: '64px',
                      background: 'linear-gradient(135deg, #1E88E5, #1565C0)',
                      color: 'white'
                    }}
                  >
                    <Users size={32} />
                  </div>
                  <h3 className="fw-bold text-dark mb-1">10,000+</h3>
                  <p className="text-muted mb-0">Demos Completed</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="d-flex flex-column align-items-center">
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{
                      width: '64px',
                      height: '64px',
                      background: 'linear-gradient(135deg, #FB8C00, #F57C00)',
                      color: 'white'
                    }}
                  >
                    <Star size={32} />
                  </div>
                  <h3 className="fw-bold text-dark mb-1">4.9/5</h3>
                  <p className="text-muted mb-0">Customer Rating</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="d-flex flex-column align-items-center">
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{
                      width: '64px',
                      height: '64px',
                      background: 'linear-gradient(135deg, #43A047, #2E7D32)',
                      color: 'white'
                    }}
                  >
                    <Award size={32} />
                  </div>
                  <h3 className="fw-bold text-dark mb-1">98%</h3>
                  <p className="text-muted mb-0">Satisfaction Rate</p>
                </div>
              </div>
              <div className="col-md-3">
                <div className="d-flex flex-column align-items-center">
                  <div 
                    className="d-flex align-items-center justify-content-center rounded-circle mb-3"
                    style={{
                      width: '64px',
                      height: '64px',
                      background: 'linear-gradient(135deg, #8E24AA, #7B1FA2)',
                      color: 'white'
                    }}
                  >
                    <TrendingUp size={32} />
                  </div>
                  <h3 className="fw-bold text-dark mb-1">85%</h3>
                  <p className="text-muted mb-0">Convert to Trial</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      <style>
        {`
          .form-control:focus {
            border-color: #1E88E5;
            box-shadow: 0 0 0 0.2rem rgba(30, 136, 229, 0.15);
          }
          
          .btn-primary:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 24px rgba(30, 136, 229, 0.3);
          }
        `}
      </style>
    </div>
  );
}
