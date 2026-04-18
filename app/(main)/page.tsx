import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CU Helper",
  description: "Your helpful companion",
};

export default function HomePage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-10 md:px-6 md:py-16">
      {/* Hero */}
      <section className="mb-12 text-center md:mb-16 md:text-left">
        <h1 className="mb-4 text-3xl font-bold leading-tight tracking-tight text-zinc-900 dark:text-zinc-50 md:text-5xl">
          Welcome to CU Helper
        </h1>
        <p className="mx-auto mb-8 max-w-xl text-base leading-relaxed text-zinc-600 dark:text-zinc-400 md:mx-0 md:text-lg">
          Your all-in-one companion. Explore features and get started today.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
          <a
            href="#features"
            className="inline-flex h-11 items-center justify-center rounded-full bg-zinc-900 px-6 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-50 dark:text-zinc-900 dark:hover:bg-zinc-200"
          >
            Get Started
          </a>
          <a
            href="#about"
            className="inline-flex h-11 items-center justify-center rounded-full border border-zinc-300 px-6 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="mb-12 md:mb-16">
        <h2 className="mb-6 text-xl font-semibold text-zinc-900 dark:text-zinc-50 md:text-2xl">
          Features
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {[
            { title: "Fast", desc: "Optimized for performance on any device." },
            { title: "Reliable", desc: "Built with stability and consistency in mind." },
            { title: "Simple", desc: "Clean UI that just works." },
          ].map(({ title, desc }) => (
            <div
              key={title}
              className="rounded-xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-zinc-900"
            >
              <h3 className="mb-2 font-semibold text-zinc-900 dark:text-zinc-50">{title}</h3>
              <p className="text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about">
        <h2 className="mb-4 text-xl font-semibold text-zinc-900 dark:text-zinc-50 md:text-2xl">
          About
        </h2>
        <p className="max-w-2xl text-sm leading-relaxed text-zinc-600 dark:text-zinc-400 md:text-base">
          CU Helper is designed to make your daily tasks easier. We are committed to privacy,
          transparency, and providing the best user experience possible.
        </p>
      </section>
    </div>
  );
}
