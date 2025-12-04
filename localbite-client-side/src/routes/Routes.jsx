// src/routes/Routes.jsx
import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Root from "../pages/Root.jsx";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import SignUp from "../pages/SignUp.jsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "signup", element: <SignUp /> },
    ],
  },
]);

export default function Routes() {
  return <RouterProvider router={router} />;
}
