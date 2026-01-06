import React, { useContext, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { Eye, EyeOff } from "lucide-react";
import { AuthContext } from "../contexts/AuthContext";

const Login = () => {
  const initialForm = {
    email: "",
    password: "",
  };

  const { signInUser } = useContext(AuthContext);
  const [formData, setFormData] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signInUser(formData.email, formData.password);
      alert("Login Successfull!!");
      setTimeout(() => {
        navigate(location?.state || "/");
      }, 1000); // Delay navigation to allow toast to show
    } catch (error) {
      console.error("Sign-in failed:", error);
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 left-12 hidden h-72 w-72 rotate-12 rounded-3xl bg-secondary/20 blur-3xl md:block" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-screen-xl flex-col-reverse items-center justify-center gap-12 px-6 py-16 lg:flex-row lg:gap-20">
        {/* Left Info Section */}
        <article className="max-w-xl text-center lg:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary/80">
            Welcome Back
          </p>
          <h1 className="mt-4 text-4xl font-bold text-neutral sm:text-5xl">
            Log in to enjoy delicious homemade meals nearby.
          </h1>
          <p className="mt-6 text-base text-muted-foreground">
            Access your LocalBite account to connect with local cooks, discover
            affordable meals, and experience the taste of community.
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-6 text-left text-sm text-neutral/70 sm:text-base">
            <div className="rounded-2xl border border-white/40 bg-white/50 p-5 shadow-lg backdrop-blur">
              <dt className="text-4xl font-bold text-primary">500+</dt>
              <dd className="mt-2 font-medium">New meals shared this week</dd>
            </div>
            <div className="rounded-2xl border border-white/40 bg-white/50 p-5 shadow-lg backdrop-blur">
              <dt className="text-4xl font-bold text-secondary">10k+</dt>
              <dd className="mt-2 font-medium">Active daily users</dd>
            </div>
          </dl>
        </article>

        {/* Right Login Card */}
        <div className="w-full max-w-xl">
          <div className="rounded-3xl border border-white/40 bg-white/80 p-8 shadow-2xl backdrop-blur">
            {/* Header */}
            <header className="mb-8 text-center">
              <h2 className="text-xl md:text-2xl font-semibold text-neutral">
                Taste the Community Again
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter your credentials to access your LocalBite account.
              </p>
            </header>

            {/* Form */}
            <form className="space-y-3" onSubmit={handleSubmit}>
              {/* Email */}
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-neutral-700">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full rounded-xl border border-input bg-white/70 px-4 py-3 
                    shadow-sm outline-none backdrop-blur transition 
                    focus:border-primary focus:ring-2 focus:ring-primary/30"
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-neutral-700">
                  Password
                </label>
                <div
                  className="flex items-center border border-input bg-white/70 rounded-xl px-4 shadow-sm 
                    focus-within:ring-2 focus-within:ring-primary/30 focus-within:border-primary"
                >
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full py-3 bg-transparent outline-none"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-neutral-600 hover:text-primary transition"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-xl bg-primary px-6 py-3 text-center text-white 
                  font-semibold shadow-lg transition hover:bg-primary-hover 
                  focus:ring-4 focus:ring-primary/40"
              >
                Log In
              </button>
            </form>

            {/* Footer */}
            <p className="mt-8 text-center text-sm text-muted-foreground">
              Don’t have an account?{" "}
              <Link
                className="font-semibold text-primary hover:text-primary-hover"
                to="/signup"
              >
                Create account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Login;
