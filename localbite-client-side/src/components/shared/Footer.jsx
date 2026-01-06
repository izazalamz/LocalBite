import React from "react";
import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { Link } from "react-router";

const Footer = () => {
  return (
    <footer className="bg-card border-t border-border pt-14 pb-10 mt-16">
      <div className="fix-alignment">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-extrabold text-neutral">
                LocalBite
              </h2>
            </div>
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              Bringing neighborhoods together through homemade food, one meal at
              a time.
            </p>
          </div>

          {/* Navigation Groups */}
          <div className="grid grid-cols-2 gap-10 md:col-span-3 lg:grid-cols-3">
            {/* Product */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-neutral">Product</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    className="hover:text-primary transition-colors"
                    to="/all-foods"
                  >
                    Browse Meals
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-primary transition-colors"
                    to="/pricing"
                  >
                    Pricing
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-primary transition-colors"
                    to="/signup"
                  >
                    Become a Cook
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-primary transition-colors"
                    to="/business"
                  >
                    For Businesses
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-neutral">Company</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    className="hover:text-primary transition-colors"
                    to="/about"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-primary transition-colors"
                    to="/contact"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-primary transition-colors"
                    to="/features"
                  >
                    Features
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-primary transition-colors"
                    to="/careers"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-neutral">Resources</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link
                    className="hover:text-primary transition-colors"
                    to="/help"
                  >
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-primary transition-colors"
                    to="/demo"
                  >
                    Book a Demo
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-primary transition-colors"
                    to="/status"
                  >
                    Server Status
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-primary transition-colors"
                    to="/blog"
                  >
                    Blog
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-14 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 md:flex-row">
          {/* Legal */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>© {new Date().getFullYear()} LocalBite</span>
            <span className="text-neutral/20">•</span>
            <Link className="hover:text-primary transition-colors" to="/terms">
              Terms
            </Link>
            <span className="text-neutral/20">•</span>
            <Link
              className="hover:text-primary transition-colors"
              to="/privacy"
            >
              Privacy
            </Link>
          </div>

          {/* Social icons */}
          <div className="flex items-center gap-4">
            {[Facebook, Twitter, Instagram, Linkedin].map((Icon, idx) => (
              <a
                key={idx}
                href="#"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Icon className="h-5 w-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
