"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarDays,
  History,
  LayoutGrid,
  QrCode,
  ScanLine,
} from "lucide-react";
import clsx from "@/lib/clsx";

const links = [
  { href: "/chef-classe/dashboard", label: "Accueil", icon: LayoutGrid },
  { href: "/chef-classe/sessions", label: "Séances", icon: CalendarDays },
  { href: "/chef-classe/generer-qr", label: "Générer QR", icon: QrCode, isMain: true },
  { href: "/chef-classe/presences", label: "Présences", icon: History },
  { href: "/chef-classe/scanner", label: "Scanner", icon: ScanLine },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-black/5 bg-white/95 backdrop-blur">
      <ul className="mx-auto flex max-w-md items-end justify-between px-4 py-2">
        {links.map(({ href, label, icon: Icon, isMain }) => {
          const active = pathname.startsWith(href);
          if (isMain) {
            return (
              <li key={href} className="-translate-y-4">
                <Link
                  href={href}
                  aria-label="Générer un QR Code"
                  className="flex h-16 w-16 flex-col items-center justify-center rounded-full bg-ink text-paper shadow-lg shadow-ink/30 transition active:scale-95"
                >
                  <Icon size={26} />
                </Link>
              </li>
            );
          }
          return (
            <li key={href}>
              <Link
                href={href}
                className={clsx(
                  "flex flex-col items-center gap-1 px-2 py-1 text-[11px]",
                  active ? "text-ink" : "text-ink-soft/50"
                )}
              >
                <Icon size={20} strokeWidth={active ? 2.4 : 2} />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
