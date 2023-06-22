"use client";
import { User } from "next-auth";
import { signOut } from "next-auth/react";
import Link from "next/link";
import Avatar from "./ui/avatar";
import { usePathname } from "next/navigation";

interface DashboardNavProps {
  user: User;
}

export default function DashboardNav({ user }: DashboardNavProps) {
  return (
    <div className="border-b border-gray-200 bg-white fixed top-0 left-0 w-full z-20">
      <div className="navbar bg-white container mx-auto max-w-6xl px-4">
        <div className="mr-2">
          <Link href="/" className="">
            <img src="/images/logo-wide.png" className="max-w-[100px] mr-4" />
          </Link>
        </div>
        <div className="flex flex-1 space-x-2">
          {["/dashboard", "/stores"].map((href) => (
            <NavLink href={href} key={href} />
          ))}
        </div>
        <div className="flex-none gap-2">
          <div className="dropdown dropdown-end">
            <label tabIndex={0}>
              <Avatar
                image={user?.image || undefined}
                name={user?.name || ""}
              />
            </label>
            <ul
              tabIndex={0}
              className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-100 rounded-box w-52 z-20"
            >
              <li className="border-b border-gray-100 pointer-events-none">
                <span className="text-lg font-bold text-gray-800 -mb-2">
                  {user.name}
                </span>
                <span className="text-xs text-gray-600">{user.email}</span>
              </li>
              <li>
                <Link href="/profile">Profile</Link>
              </li>
              <li>
                <a
                  onClick={(e) => {
                    e.preventDefault();
                    signOut({
                      callbackUrl: "/",
                    });
                  }}
                >
                  Logout
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function NavLink({ href }: { href: string }) {
  const pathname = usePathname();
  const isActive = pathname?.startsWith(href);
  return (
    <Link
      href={href}
      className={
        isActive
          ? "btn btn-ghost btn-sm sm:btn-md capitalize btn-active"
          : "btn btn-ghost btn-sm sm:btn-md capitalize"
      }
    >
      {href.slice(1, href.length)}
    </Link>
  );
}
