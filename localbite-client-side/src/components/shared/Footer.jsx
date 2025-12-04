// src/components/shared/Footer.jsx
import React from "react";

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            <div className="flex items-center gap-4 text-deep-accent-green">
              <span className="material-symbols-outlined !text-4xl text-primary-green">
                local_dining
              </span>
              <h2 className="text-2xl font-bold">LocalBite</h2>
            </div>
            <div className="space-y-2 text-sm text-gray-600">
              <p>© 2024 LocalBite by Community Bites, Inc.</p>
              <p>All Rights Reserved</p>
            </div>
            <div className="flex gap-2">
              <a className="text-sm text-gray-600 hover:text-primary-green" href="#">
                Terms of Service
              </a>
              <span>|</span>
              <a className="text-sm text-gray-600 hover:text-primary-green" href="#">
                Privacy Policy
              </a>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:col-span-3">
            <div className="space-y-4">
              <h3 className="font-bold text-foreground">Products</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <a className="hover:text-primary-green" href="#">
                    Browse Meals
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary-green" href="#">
                    Pricing
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary-green" href="#">
                    Become a Cook
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary-green" href="#">
                    For Businesses
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-foreground">About us</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <a className="hover:text-primary-green" href="#">
                    About LocalBite
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary-green" href="#">
                    Contact us
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary-green" href="#">
                    Features
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary-green" href="#">
                    Careers
                  </a>
                </li>
              </ul>
            </div>

            <div className="space-y-4">
              <h3 className="font-bold text-foreground">Resources</h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li>
                  <a className="hover:text-primary-green" href="#">
                    Help center
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary-green" href="#">
                    Book a demo
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary-green" href="#">
                    Server status
                  </a>
                </li>
                <li>
                  <a className="hover:text-primary-green" href="#">
                    Blog
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-gray-200 pt-8">
          <div className="flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
            <div className="flex flex-col gap-2">
              <h3 className="font-bold text-foreground">Get in touch</h3>
              <p className="text-sm text-gray-600">
                Questions or feedback?
                <br />
                We’d love to hear from you
              </p>
            </div>

            <div className="flex items-center gap-4 text-gray-600">
              <a className="hover:text-deep-accent-green" href="#">
                <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                  />
                </svg>
              </a>
              <a className="hover:text-deep-accent-green" href="#">
                <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.71v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              <a className="hover:text-deep-accent-green" href="#">
                <svg aria-hidden="true" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    clipRule="evenodd"
                    fillRule="evenodd"
                    d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.206v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-3.096 0 1.548 1.548 0 013.096 0zM6.55 16.338H3.45V7.748h3.1v8.59zM17.64 3H6.36C4.512 3 3 4.512 3 6.36v11.28C3 19.488 4.512 21 6.36 21h11.28C19.488 21 21 19.488 21 17.64V6.36C21 4.512 19.488 3 17.64 3z"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
