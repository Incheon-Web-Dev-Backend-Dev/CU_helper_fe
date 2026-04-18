import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-6 text-center md:flex-row md:justify-between md:py-8 md:text-left">
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          © {year} CU Helper. All rights reserved.
        </p>
        <nav className="flex gap-4">
          <Link
            href="/privacy"
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-sm text-zinc-500 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
          >
            Terms of Service
          </Link>
        </nav>
      </div>
    </footer>
  );
}
