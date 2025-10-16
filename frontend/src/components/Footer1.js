import React from "react";
import { Container, Row, Col } from "react-bootstrap";
export default function Footer() {
  return (
    <footer
      className="text-light pt-5 pb-3"
      style={{ backgroundColor: "#0A1F44" }}
    >
      <Container>
        <Row className="gy-4">
          {/* About Section */}
          <Col xs={12} md={6} lg={3}>
            <h4>Stoic &amp; Salamander Global Corporation Pvt. Ltd.</h4>
            <p className="small text-light">
              We are dedicated to driving business innovation with enterprise
              solutions, strategic consulting, and transformative technologies
              for sustainable growth and operational excellence.
            </p>
          </Col>
          {/* Quick Links */}
          <Col xs={12} md={6} lg={3}>
            <h5 className="mb-3 border-start border-3 ps-2">Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <a href="/about" className="text-decoration-none text-light small">
                  About Us
                </a>
              </li>
              <li>
                <a href="/certification" className="text-decoration-none text-light small">
                  Certifications
                </a>
              </li>
              <li>
                <a href="/careers" className="text-decoration-none text-light small">
                  Careers
                </a>
              </li>
              <li>
                <a href="/roadmap" className="text-decoration-none text-light small">
                  Roadmap
                </a>
              </li>
              <li>
                <a href="/contact" className="text-decoration-none text-light small">
                  Contact Us
                </a>
              </li>
            </ul>
          </Col>
          {/* Expertise */}
          <Col xs={12} md={6} lg={3}>
            <h5 className="mb-3 border-start border-3 ps-2">Expertise</h5>
            <ul className="list-unstyled">
              <li className="small">Business Consulting</li>
              <li className="small">Enterprise Applications</li>
              <li className="small">Cloud Solutions</li>
              <li className="small">Data Management</li>
              <li className="small">Digital Transformation</li>
            </ul>
          </Col>
          {/* Contact Info */}
          <Col xs={12} md={6} lg={3}>
            <h5 className="mb-3 border-start border-3 ps-2">Get in Touch</h5>
            <ul className="list-unstyled small">
              <li>
                Corporate Office: Level 6, Tower A, Business Bay, Yerwada,
                Pune, Maharashtra, India 411006
              </li>
              <li>
                Operations 1: Office 01, Level 8, Wing B, City Vista, Kharadi,
                Pune, Maharashtra, India 411014
              </li>
              <li>
                Operations 2: 95/06, Near PMPML Charging Station, Lohagaon,
                Pune, Maharashtra, India 411047
              </li>
              <li className="mt-2">
                <strong>Email:</strong>{" "}
                <a
                  href="mailto:office@stoicsalamander.com"
                  className="text-decoration-none text-light"
                >
                  office@stoicsalamander.com
                </a>
              </li>
              <li>
                <strong>Phone:</strong>{" "}
                <a
                  href="tel:+02068280688"
                  className="text-decoration-none text-light"
                >
                  020-68280688
                </a>
              </li>
            </ul>
          </Col>
        </Row>
        {/* Bottom Section */}
        <div className="text-center mt-4 pt-3 border-top border-secondary">
          <small className="d-block">
            © 2019 - {new Date().getFullYear()} Stoic &amp; Salamander Global
            Corporation Pvt. Ltd. All Rights Reserved.
          </small>
          <small className="text-secondary">
            All third-party trademarks, service marks, logos, and company names
            are the property of their respective owners and are used strictly
            for reference purposes.
          </small>
        </div>
      </Container>
    </footer>
  );
}
