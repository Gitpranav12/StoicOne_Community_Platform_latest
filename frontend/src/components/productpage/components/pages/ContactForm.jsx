<<<<<<< Updated upstream
import React, { useState } from "react";
import { Container, Row, Col, Image, Form, Button, Alert} from "react-bootstrap";
=======
import React, { useState, useEffect } from "react";
import { Container, Row, Col, Image, Form, Button, Alert } from "react-bootstrap";
>>>>>>> Stashed changes

export default function SecureContactForm() {
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

  // ✅ Prevent Clickjacking
  useEffect(() => {
    if (window.top !== window.self) {
      window.top.location = window.location;
    }
  }, []);

  // ✅ Simple XSS Sanitizer
  const sanitizeInput = (input) => input.replace(/[<>]/g, "");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : sanitizeInput(value),
    });

    if (errors[name]) setErrors({ ...errors, [name]: "" });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.salutation) newErrors.salutation = "Salutation is required";
    if (!formData.first_name.trim()) newErrors.first_name = "First name is required";
    if (!formData.last_name.trim()) newErrors.last_name = "Last name is required";
    if (!formData.phone_prefix) newErrors.phone_prefix = "Phone prefix is required";
    if (!/^\d{10}$/.test(formData.phone)) newErrors.phone = "Phone must be 10 digits";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.country) newErrors.country = "Country is required";
    if (formData.message.length > 50) newErrors.message = "Message must be 50 characters or less";
    if (!formData.legal_consent) newErrors.legal_consent = "You must agree to the legal terms";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const sanitizedData = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, typeof value === "string" ? sanitizeInput(value) : value])
      );

      const response = await fetch("https://formsubmit.co/office@stoicsalamander.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _subject: "Secure Contact Form Submission",
          _template: "table",
          _captcha: "false",
          ...sanitizedData,
        }),
      });

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
<<<<<<< Updated upstream
    <Container fluid className="bg-light min-vh-100 d-flex align-items-center py-3">
        <Row className="align-items-center">
          <Col md={6} className="ps-md-5">
                <h3 className="text-primary mb-4 fw-semibold py-5 text-end">Connect with us</h3>
=======
    <div
      style={{
        minHeight: "100vh",
        width: "100vw",
        background: "linear-gradient(135deg, #e3f2fd, #bbdefb)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      }}
    >
      <Container fluid className="py-5 mt-5">
        <Row
          className="shadow-lg bg-white rounded overflow-hidden mx-auto"
          style={{
            maxWidth: "1150px",
            width: "96%",
            height: "auto",
            minHeight: "80vh",
            transition: "all 0.3s ease",
          }}
        >
          {/* ✅ Left - Form Section */}
          <Col
            md={7}
            className="d-flex flex-column justify-content-center"
            style={{
              padding: "3rem 2rem",
              height: "100%",
              flex: 1,
            }}
          >
            <h3 className="fw-bold text-primary mb-3 text-center">
             Contact Our Team
            </h3>
>>>>>>> Stashed changes


<<<<<<< Updated upstream
                {submitError && (
                  <Alert variant="danger" className="mb-4">
                    There was an error sending your message. Please try again or
                    contact us directly.
                  </Alert>
                )}
                {!isSubmitted && (
                  <Form id="contact-form" onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Salutation *</Form.Label>
                      <div className="d-flex gap-3">
                        <Form.Check
                          type="radio"
                          name="salutation"
                          value="Mrs/Ms"
                          checked={formData.salutation === "Mrs/Ms"}
                          onChange={handleChange}
                          label="Mrs/Ms"
                          id="salutation-mrs"
                          isInvalid={!!errors.salutation}
                        />
                        <Form.Check
                          type="radio"
                          name="salutation"
                          value="Mr"
                          checked={formData.salutation === "Mr"}
                          onChange={handleChange}
                          label="Mr"
                          id="salutation-mr"
                          isInvalid={!!errors.salutation}
                        />
                      </div>
                      {errors.salutation && (
                        <Form.Control.Feedback type="invalid" className="d-block">
                          {errors.salutation}
                        </Form.Control.Feedback>
                      )}
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">First name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleChange}
                        maxLength="40"
                        isInvalid={!!errors.first_name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.first_name}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Last name *</Form.Label>
                      <Form.Control
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleChange}
                        maxLength="40"
                        isInvalid={!!errors.last_name}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.last_name}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Row className="mb-3">
                      <Col sm={6}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">Phone prefix *</Form.Label>
                          <Form.Select
                            name="phone_prefix"
                            value={formData.phone_prefix}
                            onChange={handleChange}
                            isInvalid={!!errors.phone_prefix}
                          >
                            <option value="">Select</option>
                            <option value="+91">+91 (India)</option>
                            <option value="+44">+44 (UK)</option>
                            <option value="+1">+1 (USA)</option>
                          </Form.Select>
                          <Form.Control.Feedback type="invalid">
                            {errors.phone_prefix}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col sm={6}>
                        <Form.Group>
                          <Form.Label className="fw-semibold">Phone *</Form.Label>
                          <Form.Control
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            maxLength="10"
                            placeholder="Enter 10-digit phone number"
                            isInvalid={!!errors.phone}
                          />
                          <Form.Control.Feedback type="invalid">
                            {errors.phone}
                          </Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Email *</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.email}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Country/Region *</Form.Label>
                      <Form.Select
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        isInvalid={!!errors.country}
                      >
                        <option value="">Select</option>
                        <option value="India">India</option>
                        <option value="United Kingdom">United Kingdom</option>
                        <option value="United States">United States</option>
                      </Form.Select>
                      <Form.Control.Feedback type="invalid">
                        {errors.country}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Tell us more about your needs (Optional)</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        maxLength="50"
                        rows={3}
                        isInvalid={!!errors.message}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.message}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group className="mb-4">
                      <Form.Check
                        type="checkbox"
                        name="legal_consent"
                        checked={formData.legal_consent}
                        onChange={handleChange}
                        label={
                          <span className="small">
                            Legal confirmation * <br />
                            I agree to Stoic contacting me by phone or email for
                            marketing purposes. I acknowledge the legal note and
                            understand that I can revoke my consent at any time.
                          </span>
                        }
                        isInvalid={!!errors.legal_consent}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.legal_consent}
                      </Form.Control.Feedback>
                    </Form.Group>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      className="px-4 py-2 fw-semibold"
                    >
                      Submit
                    </Button>
                  </Form>
                )}
          </Col>
          <Col md={6} className="text-center">
=======
            {isSubmitted ? (
              <Alert variant="success">Thank you! We’ll get back to you soon.</Alert>
            ) : submitError ? (
              <Alert variant="danger"> Something went wrong. Please try again later.</Alert>
            ) : (
              <Form onSubmit={handleSubmit} noValidate>
                {/* Salutation */}
                <Form.Group className="mb-3">
                  <Form.Label>Salutation *</Form.Label>
                  <div className="d-flex gap-3">
                    <Form.Check type="radio" name="salutation" value="Mrs/Ms" checked={formData.salutation === "Mrs/Ms"} onChange={handleChange} label="Mrs/Ms" />
                    <Form.Check type="radio" name="salutation" value="Mr" checked={formData.salutation === "Mr"} onChange={handleChange} label="Mr" />
                  </div>
                  {errors.salutation && <div className="text-danger small">{errors.salutation}</div>}
                </Form.Group>

                <Row className="mb-3">
                  <Col sm={6}>
                    <Form.Label>First Name *</Form.Label>
                    <Form.Control type="text" name="first_name" value={formData.first_name} onChange={handleChange} isInvalid={!!errors.first_name} />
                    <Form.Control.Feedback type="invalid">{errors.first_name}</Form.Control.Feedback>
                  </Col>
                  <Col sm={6}>
                    <Form.Label>Last Name *</Form.Label>
                    <Form.Control type="text" name="last_name" value={formData.last_name} onChange={handleChange} isInvalid={!!errors.last_name} />
                    <Form.Control.Feedback type="invalid">{errors.last_name}</Form.Control.Feedback>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col sm={5}>
                    <Form.Label>Prefix *</Form.Label>
                    <Form.Select name="phone_prefix" value={formData.phone_prefix} onChange={handleChange} isInvalid={!!errors.phone_prefix}>
                      <option value="">Select</option>
                      <option value="+91">+91 (India)</option>
                      <option value="+44">+44 (UK)</option>
                      <option value="+1">+1 (USA)</option>
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">{errors.phone_prefix}</Form.Control.Feedback>
                  </Col>
                  <Col sm={7}>
                    <Form.Label>Phone *</Form.Label>
                    <Form.Control type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="10-digit number" isInvalid={!!errors.phone} />
                    <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Email *</Form.Label>
                  <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} isInvalid={!!errors.email} />
                  <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Country *</Form.Label>
                  <Form.Select name="country" value={formData.country} onChange={handleChange} isInvalid={!!errors.country}>
                    <option value="">Select Country</option>
                    <option value="India">India</option>
                    <option value="United States">United States</option>
                    <option value="United Kingdom">United Kingdom</option>
                  </Form.Select>
                  <Form.Control.Feedback type="invalid">{errors.country}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Message (Optional, Max 50 chars)</Form.Label>
                  <Form.Control as="textarea" name="message" rows={3} maxLength="50" value={formData.message} onChange={handleChange} isInvalid={!!errors.message} />
                  <Form.Control.Feedback type="invalid">{errors.message}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-4">
                  <Form.Check
                    type="checkbox"
                    name="legal_consent"
                    checked={formData.legal_consent}
                    onChange={handleChange}
                    label={
                      <span className="small">
                        I agree to Stoic contacting me by phone or email for marketing purposes.
                        I understand I can revoke my consent anytime.
                      </span>
                    }
                    isInvalid={!!errors.legal_consent}
                  />
                  <Form.Control.Feedback type="invalid">{errors.legal_consent}</Form.Control.Feedback>
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100 fw-semibold py-2">
                  Submit 
                </Button>
              </Form>
            )}
          </Col>

          {/* ✅ Right - GIF Section */}
          <Col md={5} className="p-0 d-none d-md-block position-relative">
>>>>>>> Stashed changes
            <Image
              src="https://cdn.dribbble.com/users/1162077/screenshots/3848914/programmer.gif"
              alt="Contact Illustration"
              fluid
              style={{
                height: "100%",
                width: "100%",
                objectFit: "cover",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "30px",
                left: "30px",
                background: "rgba(0,0,0,0.5)",
                color: "#fff",
                padding: "15px 25px",
                borderRadius: "10px",
                backdropFilter: "blur(5px)",
              }}
            >
              <h5 className="mb-0">We’re Just a Message Away ✉️</h5>
              <small>Our team replies within 24 hours!</small>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
}
