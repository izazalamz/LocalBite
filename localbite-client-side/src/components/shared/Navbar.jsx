// src/components/shared/Navbar.jsx
import React from "react";
import { Link, NavLink } from "react-router-dom";

const linkBase =
  "text-sm font-medium text-gray-700 hover:text-primary-green transition-colors";

const activeLink = "text-primary-green";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-gray-50/80 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-20 items-center justify-between">
          <Link to="/" className="flex items-center gap-4 text-deep-accent-green">
            <span className="material-symbols-outlined !text-4xl text-primary-green">
              local_dining
            </span>
            <h2 className="text-2xl font-bold">LocalBite</h2>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `${linkBase} ${isActive ? activeLink : ""}`
              }
            >
              Home
            </NavLink>
            <a href="#how-it-works" className={linkBase}>
              About
            </a>
            <a href="#why-localbite" className={linkBase}>
              All Foods
            </a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              to="/login"
              className="flex h-10 items-center justify-center rounded-2xl px-4 text-sm font-bold text-gray-700 hover:bg-gray-200"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="flex h-10 min-w-[84px] items-center justify-center rounded-2xl bg-primary-green px-4 text-sm font-bold text-white shadow-soft transition-colors hover:bg-primary-green-hover"
            >
              Join as Cook
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
