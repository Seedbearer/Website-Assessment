"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/assessment", label: "Assessment" },
  { href: "/reading", label: "Reading" },
  { href: "/coaching", label: "Coaching" },
  { href: "/honour-framework", label: "Honour Framework" },
  { href: "/blog", label: "Blog" },
];

export default function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-deep-green text-linen">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 leading-none"
          onClick={() => setOpen(false)}
        >
          <Image src="/logo.svg" alt="" width={28} height={28} className="h-7 w-auto" />
          <span className="flex flex-col">
            <span className="font-lora text-lg text-linen">Seedbearer</span>
            <span className="text-[10px] tracking-widest text-straw">FAMILY</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-4 lg:flex lg:gap-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="whitespace-nowrap text-sm hover:text-straw transition"
            >
              {link.label}
            </Link>
          ))}
          <Link href="/login" className="whitespace-nowrap text-sm hover:text-straw transition">
            Sign In
          </Link>
          <Link
            href="/assessment"
            className="whitespace-nowrap rounded bg-linen px-5 py-2.5 text-sm font-medium text-deep-green transition hover:bg-off-white"
          >
            Take the Assessment
          </Link>
        </nav>

        <button
          type="button"
          className="flex shrink-0 flex-col gap-1.5 lg:hidden"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className={`h-0.5 w-6 bg-linen transition ${open ? "translate-y-2 rotate-45" : ""}`} />
          <span className={`h-0.5 w-6 bg-linen transition ${open ? "opacity-0" : ""}`} />
          <span className={`h-0.5 w-6 bg-linen transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
        </button>
      </div>

      {open && (
        <div className="fixed inset-0 top-[60px] z-40 flex flex-col items-center gap-6 bg-deep-green px-4 py-12 lg:hidden">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-lg hover:text-straw transition"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/assessment"
            className="rounded bg-linen px-8 py-4 text-lg font-medium text-deep-green transition hover:bg-off-white"
            onClick={() => setOpen(false)}
          >
            Take the Assessment
          </Link>
          <Link href="/login" className="text-sm hover:text-straw transition" onClick={() => setOpen(false)}>
            Sign In
          </Link>
        </div>
      )}
    </header>
  );
}
