import React from "react";

export default function SignUp() {
  return (
    <section className="flex items-center justify-center py-16">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-soft">
        <h1 className="mb-6 text-2xl font-bold text-foreground">Create an account</h1>
        <form className="space-y-4">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Name
            </label>
            <input
              type="text"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/30"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:border-primary-green focus:ring-2 focus:ring-primary-green/30"
            />
          </div>
          <button
            type="submit"
            className="mt-2 flex w-full items-center justify-center rounded-2xl bg-primary-green px-4 py-2 text-sm font-bold text-white shadow-soft hover:bg-primary-green-hover"
          >
            Sign up
          </button>
        </form>
      </div>
    </section>
  );
}
