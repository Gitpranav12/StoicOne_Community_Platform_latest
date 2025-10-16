import { Github, Twitter, Linkedin, Facebook } from 'lucide-react';

export function Footer() {
  const socialLinks = [
    { icon: <Twitter size={20} />, href: '#twitter', label: 'Twitter' },
    { icon: <Linkedin size={20} />, href: '#linkedin', label: 'LinkedIn' },
    { icon: <Facebook size={20} />, href: '#facebook', label: 'Facebook' },
    { icon: <Github size={20} />, href: '#github', label: 'GitHub' }
  ];

  return (
    <footer className="bg-dark text-light py-3">
      <div className="container d-flex justify-content-between align-items-center">
        {/* Social Icons - Left */}
        <div className="d-flex gap-3">
          {socialLinks.map((social) => (
            <a
              key={social.label}
              href={social.href}
              className="text-light"
              aria-label={social.label}
            >
              {social.icon}
            </a>
          ))}
        </div>

        {/* Brand Name - Right */}
        <div>
          <span className="fw-bold">Stoic & Salamander © 2025</span>
        </div>
      </div>
    </footer>
  );
}
