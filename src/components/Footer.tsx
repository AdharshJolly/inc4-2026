import { Mail, Phone, MapPin, Linkedin, Twitter, Youtube } from "lucide-react";
import { Link } from "react-router-dom";

const footerLinks = {
  quickLinks: [
    { name: "Home", href: "/" },
    { name: "About", href: "/about" },
    { name: "Speakers", href: "/speakers" },
    { name: "Schedule", href: "/schedule" },
    { name: "Contact", href: "/contact" },
  ],
  resources: [
    { name: "Call for Papers", href: "/call-for-papers" },
    { name: "Registration", href: "/registration" },
    { name: "Important Dates", href: "/important-dates" },
    { name: "CRC Submissions", href: "/crc-submissions" },
    { name: "Committee", href: "/committee" },
  ],
};

export const Footer = () => {
  return (
    <footer id="contact" className="gradient-dark border-t border-dark-border pt-20">
      <div className="container mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/images/InC4 Logo White.png"
                alt="InC4 Logo"
                className="h-12 w-12"
              />
              <div>
                <span className="font-display font-bold text-lg text-primary-foreground">
                  IEEE InC4 2026
                </span>
                <p className="text-primary-foreground/60 text-xs">
                  Bengaluru, India
                </p>
              </div>
            </div>
            <p className="text-primary-foreground/60 text-sm leading-relaxed mb-6">
              International Conference on Contemporary Computing and
              Communications, organized by IEEE Computer Society Bangalore
              Chapter.
            </p>
            <div className="flex gap-3">
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
              >
                <Twitter className="w-4 h-4 text-primary-foreground" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
              >
                <Linkedin className="w-4 h-4 text-primary-foreground" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-lg bg-dark-card border border-dark-border flex items-center justify-center hover:border-primary hover:text-primary transition-colors"
              >
                <Youtube className="w-4 h-4 text-primary-foreground" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-bold text-primary-foreground mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              {footerLinks.quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/60 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-display font-bold text-primary-foreground mb-6">
              Resources
            </h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-primary-foreground/60 hover:text-primary transition-colors text-sm"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="bg-primary/5 rounded-2xl p-6 border border-primary/10">
            <h4 className="font-display font-bold text-primary-foreground mb-6">
              Contact Us
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-primary-foreground/60 text-sm">
                  CHRIST University, Kengeri Campus, Bengaluru, India
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="mailto:inc4@christuniversity.in"
                  className="text-primary-foreground/60 hover:text-primary transition-colors text-sm"
                >
                  inc4@christuniversity.in
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <a
                  href="tel:+918040129100"
                  className="text-primary-foreground/60 hover:text-primary transition-colors text-sm"
                >
                  +91 80 4012 9100
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-dark-border pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-primary-foreground/40 text-sm">
            © 2026 IEEE InC4. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-primary-foreground/40 hover:text-primary transition-colors text-sm"
            >
              Privacy Policy
            </a>
            <a
              href="#"
              className="text-primary-foreground/40 hover:text-primary transition-colors text-sm"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
