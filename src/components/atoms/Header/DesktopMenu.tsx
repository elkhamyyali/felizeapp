// components/DesktopMenu.tsx
import React from "react";
import Link from "next/link";
import { useRouter } from "next/router";

const DesktopMenu = ({ navLinks }) => {
  const router = useRouter();

  return (
    <nav className="hidden lg:block">
      <ul className="flex space-x-6">
        {navLinks.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={`font-semibold text-sm ${
                router.pathname === href
                  ? "text-custom-turquoise"
                  : "text-custom-darkblue hover:text-custom-lightblue"
              }`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default DesktopMenu;
