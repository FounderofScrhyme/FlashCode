"use client";

import { useState } from "react";
import ModeToggle from "../ModeToggle";
import {
  SignInButton,
  SignOutButton,
  SignUpButton,
  useUser,
} from "@clerk/nextjs";

const navLinks = [
  {
    label: "Dashboard",
    href: "/dashboard",
  },
  {
    label: "Make card",
    href: "/dashboard/cards",
  },
  {
    label: "Card queue",
    href: "/dashboard/queue",
  },
  {
    label: "Contact",
    href: "/contact",
  },
];

export default function Navbar() {
  const { isSignedIn, user, isLoaded } = useUser();
  const [openMenu, setOpenMenu] = useState(false);
  const handleMenuOpen = () => {
    setOpenMenu(!openMenu);
  };
  return (
    // bg-white/10 backdrop-blur-md後で使いたければ
    <div className="container mx-auto max-w-screen-2xl">
      {isSignedIn ? (
        <header className="flex items-center justify-between py-4">
          <h1 className="ml-5 font-bold whitespace-nowrap text-lg">
            Flash Code
          </h1>

          <div className="flex items-center gap-4 mr-5">
            <div className="flex items-center gap-4">
              <div className="hidden md:flex space-x-2">
                <SignOutButton>
                  <div className="inline-block px-6 py-2 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:opacity-80 rounded-full">
                    <span className="bg-white/10 text-white rounded-full font-semibold backdrop-blur-sm">
                      Sign out
                    </span>
                  </div>
                </SignOutButton>
              </div>

              <ModeToggle />

              <button onClick={handleMenuOpen} className="z-10 space-y-2">
                <div
                  className={
                    openMenu
                      ? "w-8 h-0.5 bg-neutral-400 translate-y-2.5 rotate-45 transition duration-300 ease-in-out"
                      : "w-8 h-0.5 bg-neutral-400 transition duration-300 ease-in-out"
                  }
                />
                <div
                  className={
                    openMenu
                      ? "opacity-0 transition duration-500 ease-in-out"
                      : "w-8 h-0.5 bg-neutral-400 transition duration-300 ease-in-out"
                  }
                />
                <div
                  className={
                    openMenu
                      ? "w-8 h-0.5 bg-neutral-400 -rotate-45 transition duration-300 ease-in-out"
                      : "w-8 h-0.5 bg-neutral-400 transition duration-300 ease-in-out"
                  }
                />
              </button>
            </div>
          </div>

          <nav
            className={
              openMenu
                ? "fixed text-center bg-white right-0 top-0 w-[100%] lg:w-[25%] h-screen flex flex-col justify-center ease-linear duration-500 dark:bg-neutral-950"
                : "fixed right-[-100%] top-0 w-[100%] md:w-[25%] h-screen flex flex-col justify-center ease-linear duration-400"
            }
          >
            <ul className="mt-8">
              {navLinks.map((navLink) => (
                <li
                  key={navLink.label}
                  className="py-2 font-medium dark:text-white"
                >
                  {navLink.label}
                </li>
              ))}
            </ul>
          </nav>
        </header>
      ) : (
        <header className="relative flex items-center justify-between py-4">
          <div className="ml-5">
            <h1 className="font-bold whitespace-nowrap text-lg">Flash Code</h1>
          </div>

          <div className="flex flex-1" />

          <div className="flex items-center gap-4 mr-5">
            <SignInButton mode="modal">
              <span className="bg-primary md:hidden text-white dark:text-neutral-800 font-semibold rounded-full px-6 py-2 hover:bg-primary/80 transition">
                Log in
              </span>
            </SignInButton>
            <div className="hidden md:flex space-x-2">
              <SignInButton mode="modal">
                <span className="bg-primary text-white dark:text-neutral-800 font-semibold rounded-full px-6 py-2 hover:bg-primary/80 transition">
                  Log in
                </span>
              </SignInButton>
              <SignUpButton mode="modal">
                <div className="inline-block px-6 py-2 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 hover:opacity-80 rounded-full">
                  <span className="bg-white/10 text-white rounded-full font-semibold backdrop-blur-sm">
                    Sign up
                  </span>
                </div>
              </SignUpButton>
            </div>

            <ModeToggle />

            <button onClick={handleMenuOpen} className="z-10 space-y-2">
              <div
                className={
                  openMenu
                    ? "w-8 h-0.5 bg-neutral-400 translate-y-2.5 rotate-45 transition duration-300 ease-in-out"
                    : "w-8 h-0.5 bg-neutral-400 transition duration-300 ease-in-out"
                }
              />
              <div
                className={
                  openMenu
                    ? "opacity-0 transition duration-500 ease-in-out"
                    : "w-8 h-0.5 bg-neutral-400 transition duration-300 ease-in-out"
                }
              />
              <div
                className={
                  openMenu
                    ? "w-8 h-0.5 bg-neutral-400 -rotate-45 transition duration-300 ease-in-out"
                    : "w-8 h-0.5 bg-neutral-400 transition duration-300 ease-in-out"
                }
              />
            </button>
          </div>

          <nav
            className={
              openMenu
                ? "fixed text-center bg-white right-0 top-0 w-[100%] lg:w-[25%] h-screen flex flex-col justify-center ease-linear duration-500 dark:bg-neutral-950"
                : "fixed right-[-100%] top-0 w-[100%] md:w-[25%] h-screen flex flex-col justify-center ease-linear duration-400"
            }
          >
            <ul className="mt-8">
              {navLinks.map((navLink) => (
                <li
                  key={navLink.label}
                  className="py-2 font-medium dark:text-white"
                >
                  {navLink.label}
                </li>
              ))}
            </ul>
          </nav>
        </header>
      )}
    </div>
  );
}
