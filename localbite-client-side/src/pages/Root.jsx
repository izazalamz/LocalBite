// src/pages/Root.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/shared/Navbar.jsx";
import Footer from "../components/shared/Footer.jsx";

export default function Root() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
