import { Eye, EyeOff } from "lucide-react";
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
import axios from "axios";

const SignUp = () => {
  const { createUser, updateUser } = useContext(AuthContext);
  const initialForm = {
    fullName: "",
    email: "",
    password: "",
    role: "",
  };
  const [formData, setFormData] = useState(initialForm);
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    try {
      // Create user in Firebase
      const userCredential = await createUser(
        formData.email,
        formData.password
      );
      const user = userCredential.user;

      // Update user profile with display name
      await updateUser({
        displayName: formData.fullName,
      });

      // user data for backend
      const userData = {
        fullName: formData.fullName,
        email: formData.email,
        role: formData.role,
        uid: user.uid,
      };

      await axios.post("http://localhost:3000/users", userData);
      setFormData(initialForm);
      navigate("/dashboard");
    } catch (err) {
      console.error("Signup error:", err);

      setError("Signup failed");
    }
  };

  return (
    <section className="relative min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-0 left-12 hidden h-72 w-72 rotate-12 rounded-3xl bg-secondary/20 blur-3xl md:block" />
      </div>

      <div className="relative mx-auto flex min-h-screen max-w-screen-xl flex-col-reverse items-center justify-center gap-12 px-6 py-16 lg:flex-row lg:gap-20">
        <article className="max-w-xl text-center lg:text-left">
          <p className="text-sm font-semibold uppercase tracking-[0.4em] text-primary/80">
            Join LocalBite
          </p>
          <h1 className="mt-4 text-4xl font-bold text-neutral sm:text-5xl">
            Cook, share, and enjoy fresh food from your community.
          </h1>
          <p className="mt-6 text-base text-muted-foreground">
            Create an account to discover homemade dishes from local cooks or to
            start offering your culinary creations. Bring neighbors together one
            meal at a time.
          </p>

          <dl className="mt-10 grid grid-cols-2 gap-6 text-left text-sm text-neutral/70 sm:text-base">
            <div className="rounded-2xl border border-white/40 bg-white/50 p-5 shadow-lg backdrop-blur">
              <dt className="text-4xl font-bold text-primary">2k+</dt>
              <dd className="mt-2 font-medium">Home cooks sharing recipes</dd>
            </div>
            <div className="rounded-2xl border border-white/40 bg-white/50 p-5 shadow-lg backdrop-blur">
              <dt className="text-4xl font-bold text-secondary">15k+</dt>
              <dd className="mt-2 font-medium">Food lovers in the community</dd>
            </div>
          </dl>
        </article>

        <div className="w-full max-w-xl">
          <div className="rounded-3xl border border-white/40 bg-white/80 p-8 shadow-2xl backdrop-blur">
            <header className="mb-8 text-center">
              <h2 className="text-xl md:text-2xl font-semibold text-neutral">
                Your Food Journey Starts Here
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Fill in your details and start with LocalBite.
              </p>
            </header>

            <form className="space-y-3" onSubmit={handleSubmit}>
              {/* Full Name */}
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-neutral-700">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full rounded-xl border border-input bg-white/70 px-4 py-3 
                 shadow-sm outline-none backdrop-blur transition 
                 focus:border-primary focus:ring-2 focus:ring-primary/30"
                  placeholder="Enter your name"
                />
              </div>

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

              {/* Role Selector */}
              <div className="flex flex-col space-y-1">
                <label className="text-sm font-medium text-neutral-700">
                  Select Role
                </label>
                <select
                  name="role"
                  value={formData.role}
                  onChange={(e) =>
                    setFormData({ ...formData, role: e.target.value })
                  }
                  className="w-full rounded-xl border border-input bg-white/70 px-4 py-3 
                 shadow-sm outline-none backdrop-blur transition 
                 focus:border-primary focus:ring-2 focus:ring-primary/30"
                >
                  <option value="" disabled>
                    Select your role
                  </option>
                  <option value="foodie">Food Lover</option>
                  <option value="cook">Home Cook</option>
                </select>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full rounded-xl bg-primary px-6 py-3 text-center text-white 
               font-semibold shadow-lg transition hover:bg-primary-hover 
               focus:ring-4 focus:ring-primary/40"
              >
                Sign Up
              </button>
            </form>

            <p className="mt-8 text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                className="font-semibold text-primary hover:text-primary-hover"
                to="/login"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUp;
