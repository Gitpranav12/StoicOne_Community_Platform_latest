import React, { useState } from "react";
import { Container, Row, Col, Image } from "react-bootstrap";
import "./ContactForm.css";

export default function ContactForm() {
  const [formData, setFormData] = useState({
    salutation: "",
    first_name: "",
    last_name: "",
    phone_prefix: "",
    phone: "",
    email: "",
    country: "",
    message: "",
    legal_consent: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.salutation) newErrors.salutation = "Salutation is required";
    if (!formData.first_name.trim())
      newErrors.first_name = "First name is required";
    if (!formData.last_name.trim())
      newErrors.last_name = "Last name is required";
    if (!formData.phone_prefix)
      newErrors.phone_prefix = "Phone prefix is required";
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be exactly 10 digits";
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    if (!formData.country) newErrors.country = "Country is required";
    if (formData.message.length > 50)
      newErrors.message = "Message must be 50 characters or less";
    if (!formData.legal_consent)
      newErrors.legal_consent = "You must agree to the legal terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch(
        "https://formsubmit.co/office@stoicsalamander.com",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            _subject: "New Contact Form Submission",
            _template: "table",
            _captcha: "false",
            ...formData,
          }),
        }
      );

      if (response.ok) {
        setIsSubmitted(true);
        setSubmitError(false);
      } else {
        throw new Error("Submission failed");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setSubmitError(true);
    }
  };

  return (
    <div className="contact-page">
      <Container fluid className="py-5">
        <Row className="align-items-center">
          {/* Left Column - Form */}
          <Col md={6} className="ps-md-5">
            <h1 className="heading">Connect with us</h1>

            {isSubmitted && (
              <div className="success-message">
                Thank you for your message! We'll get back to you soon.
              </div>
            )}

            {submitError && (
              <div className="error-message">
                There was an error sending your message. Please try again or
                contact us directly.
              </div>
            )}

            {!isSubmitted && (
              <form id="contact-form" onSubmit={handleSubmit}>
                <label>Salutation *</label>
                <div className="radio-group">
                  <label>
                    <input
                      type="radio"
                      name="salutation"
                      value="Mrs/Ms"
                      checked={formData.salutation === "Mrs/Ms"}
                      onChange={handleChange}
                    />
                    Mrs/Ms
                  </label>
                  <label>
                    <input
                      type="radio"
                      name="salutation"
                      value="Mr"
                      checked={formData.salutation === "Mr"}
                      onChange={handleChange}
                    />
                    Mr
                  </label>
                </div>
                {errors.salutation && (
                  <div className="error-message-field">
                    {errors.salutation}
                  </div>
                )}

                <label>First name *</label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  maxLength="40"
                />
                {errors.first_name && (
                  <div className="error-message-field">
                    {errors.first_name}
                  </div>
                )}

                <label>Last name *</label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  maxLength="40"
                />
                {errors.last_name && (
                  <div className="error-message-field">
                    {errors.last_name}
                  </div>
                )}

                <div className="form-row d-flex gap-3">
                  <div>
                    <label>Phone prefix *</label>
                    <select
                      name="phone_prefix"
                      value={formData.phone_prefix}
                      onChange={handleChange}
                    >
                      <option value="">Select</option>
                      <option value="+91">+91 (India)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+1">+1 (USA)</option>
                    </select>
                    {errors.phone_prefix && (
                      <div className="error-message-field">
                        {errors.phone_prefix}
                      </div>
                    )}
                  </div>
                  <div>
                    <label>Phone *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength="10"
                      placeholder="Enter 10-digit phone number"
                    />
                    {errors.phone && (
                      <div className="error-message-field">{errors.phone}</div>
                    )}
                  </div>
                </div>

                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <div className="error-message-field">{errors.email}</div>
                )}

                <label>Country/Region *</label>
                <select
                  name="country"
                  value={formData.country}
                  onChange={handleChange}
                >
                  <option value="">Select</option>
                  <option value="India">India</option>
                  <option value="United Kingdom">United Kingdom</option>
                  <option value="United States">United States</option>
                </select>
                {errors.country && (
                  <div className="error-message-field">{errors.country}</div>
                )}

                <label>Tell us more about your needs (Optional)</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  maxLength="50"
                />
                {errors.message && (
                  <div className="error-message-field">{errors.message}</div>
                )}

                <div className="legal-note">
                  <label>
                    <input
                      type="checkbox"
                      name="legal_consent"
                      checked={formData.legal_consent}
                      onChange={handleChange}
                    />
                    Legal confirmation * <br />
                    I agree to Stoic contacting me by phone or email for
                    marketing purposes. I acknowledge the legal note and
                    understand that I can revoke my consent at any time.
                  </label>
                </div>
                {errors.legal_consent && (
                  <div className="error-message-field">
                    {errors.legal_consent}
                  </div>
                )}

                <button type="submit" className="submit-btn mt-3">
                  Submit
                </button>
              </form>
            )}
          </Col>

          {/* Right Column - Image */}
          <Col md={6} className="text-center">
            <Image
              src="https://devmagz.com/wp-content/uploads/2025/05/email-marketing.png"
              alt="Contact"
              fluid
              className="rounded shadow-sm contact-image"
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
}
