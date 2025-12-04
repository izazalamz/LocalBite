// src/pages/Home.jsx
import React from "react";

const PrimaryButton = ({ children }) => (
  <button className="flex h-12 items-center justify-center rounded-full bg-primary-green px-6 text-sm sm:text-base font-semibold text-white shadow-soft transition-colors hover:bg-primary-green-hover">
    <span className="truncate">{children}</span>
  </button>
);

const OutlineButton = ({ children }) => (
  <button className="flex h-12 items-center justify-center rounded-full border border-slate-200 bg-surface px-6 text-sm sm:text-base font-semibold text-slate-700 transition-colors hover:bg-slate-100">
    <span className="truncate">{children}</span>
  </button>
);

const HowItWorksCard = ({ icon, title, children }) => (
  <div className="flex flex-col gap-4 rounded-[var(--radius-card)] bg-surface p-6 sm:p-8 shadow-soft">
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-green/10 text-primary-green">
      <span className="material-symbols-outlined text-xl">{icon}</span>
    </div>
    <div className="flex flex-col gap-1.5">
      <h3 className="text-base sm:text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted">{children}</p>
    </div>
  </div>
);

const WhyCard = ({ icon, title, children }) => (
  <div className="flex flex-col gap-4 rounded-[var(--radius-card)] bg-surface p-6 sm:p-8 shadow-soft">
    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-primary-green">
      <span className="material-symbols-outlined text-xl">{icon}</span>
    </div>
    <div className="flex flex-col gap-1.5">
      <h3 className="text-base sm:text-lg font-semibold text-foreground">{title}</h3>
      <p className="text-sm leading-relaxed text-muted">{children}</p>
    </div>
  </div>
);

export default function Home() {
  return (
    <>
    <section className="bg-gradient-to-b from-white via-background to-background/80">
      <div className="mx-auto max-w-6xl rounded-[2rem] bg-white/70 px-4 pb-16 pt-10 shadow-soft-lg backdrop-blur-sm sm:px-8 sm:pb-20 sm:pt-12 lg:mt-8"></div>
      {/* Hero */}
      <section className="bg-surface">
        <div className="mx-auto flex max-w-6xl flex-col gap-16 px-4 pb-20 pt-16 sm:px-6 sm:pb-24 sm:pt-20 lg:flex-row lg:items-center lg:gap-20 lg:pb-28 lg:pt-24">
          {/* Left */}
          <div className="flex flex-1 flex-col gap-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-primary-green">
  <span className="h-1.5 w-1.5 rounded-full bg-primary-green" />
  Fresh homemade meals near you
</div>

<h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl ...">
  Share Meals. <br /> …
</h1>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground">
                Share Meals.
                <br />
                Reduce Waste.
                <br />
                Connect Locally.
              </h1>
              <p className="max-w-xl text-sm sm:text-base text-muted">
                LocalBite connects home cooks with their neighbors, offering a
                platform to share authentic, homemade meals and build community.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <PrimaryButton>Join as Cook</PrimaryButton>
              <OutlineButton>Browse Meals</OutlineButton>
            </div>
          </div>

          {/* Right image */}
          <div className="flex flex-1 justify-center">
            <div
              className="aspect-square w-full max-w-md rounded-[2rem] bg-cover bg-center shadow-soft-lg"
              style={{
                backgroundImage:
                  "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBoh68j8ANBlfOT5CzRccLdc_3BEFIkCXdrrV3qGIrhXPO1lNQVqbiArCW7HTk1o88i_ncbm3bRpwRXvq69DfrPH-m8Jm1RFthHUxdUx-1NcDQ1vuIA6vKGeHNJJSJGAk_rhuzxBcdo781kd0E-kjRcvIrPwNAvdm6DJBq--uxSJIk5LLMQ8ISv4E7uSRTgFbE6laylf6Ptei1EA-DTLJPp6AoGgR6sX8aLOoRZKk-hhGnxEsudgwNRUq6ch_GCrd9qP5DVAZy_C-k')",
              }}
            />
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="bg-background py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="space-y-3 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              How It Works
            </h2>
            <p className="mx-auto max-w-2xl text-sm sm:text-base text-muted-soft">
              Getting started is simple. Share your culinary creations or discover
              delicious homemade food in your neighborhood in just a few steps.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:gap-8 md:grid-cols-3">
            <HowItWorksCard icon="soup_kitchen" title="Cooks Post Meals">
              Sign up as a cook and easily list your homemade meals for your
              community to discover.
            </HowItWorksCard>

            <HowItWorksCard icon="map" title="Eaters Browse Nearby">
              Explore a map of available meals in your area and find the perfect
              dish for your craving.
            </HowItWorksCard>

            <HowItWorksCard icon="reviews" title="Order &amp; Review Easily">
              Securely place an order, enjoy your meal, and leave a review to
              support local cooks.
            </HowItWorksCard>
          </div>
        </div>
      </section>

      {/* Why LocalBite */}
      <section
        id="why-localbite"
        className="bg-surface-muted/40 py-16 sm:py-20 lg:py-24"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="space-y-3 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
              Why LocalBite Works
            </h2>
            <p className="mx-auto max-w-2xl text-sm sm:text-base text-muted-soft">
              We believe in the power of food to bring people together, reduce
              waste, and support local economies.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:gap-8 md:grid-cols-3">
            <WhyCard icon="groups" title="Community-Driven">
              Build meaningful connections with your neighbors over the shared
              love of great food.
            </WhyCard>

            <WhyCard icon="eco" title="Sustainable">
              Help reduce food waste by sharing surplus meals and supporting a
              more sustainable food system.
            </WhyCard>

            <WhyCard icon="payments" title="Affordable Homemade Food">
              Enjoy the authentic taste of homemade food at fair prices,
              directly from cooks in your area.
            </WhyCard>
          </div>
        </div>
      </section>

      {/* CTA strip */}
      <section className="bg-background py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="rounded-[2rem] bg-deep-accent-green px-6 py-12 text-center text-white shadow-soft-lg sm:px-10 sm:py-16 lg:px-16 lg:py-18">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
              Join the LocalBite Community Today!
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-sm sm:text-base text-white/80">
              Whether you&apos;re a passionate cook or a hungry neighbor, there&apos;s
              a place for you at our table.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button className="flex h-12 items-center justify-center rounded-full bg-primary-green px-6 text-sm sm:text-base font-semibold text-white shadow-soft hover:bg-primary-green-hover">
                Join as Cook
              </button>
              <button className="flex h-12 items-center justify-center rounded-full border border-white/50 bg-transparent px-6 text-sm sm:text-base font-semibold text-white hover:bg-white/10">
                Browse Meals
              </button>
            </div>
          </div>
        </div>
      </section>
    </section>
      
    </>
  );
}
