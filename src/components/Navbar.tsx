import Link from "next/link";
import React from "react";
import Icon from "./Icon";
import { buttonVariants } from "./ui/Button";
import { getAuthSession } from "@/lib/auth";
import UserAccountNav from "./UserAccountNav";
import Searchbar from "./Searchbar";

const Navbar = async () => {
  const session = await getAuthSession();
  // console.log(session);
  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-zinc-50 border-b border-zinc-300 z-[10] py-2">
      <div className="container flex items-center justify-between max-w-7xl gap-4 h-full">
        <Link href="/" className="flex gap-2 items-center">
          <Icon.logo className="h-8 w-8 sm:h-6 sm:w-6" />
          <p className="hidden md:block text-sm font-medium text-zinc-700">
            Insightify
          </p>
        </Link>

        {/* Seachbar */}

        <Searchbar />

        {session?.user ? (
          <UserAccountNav user={session.user} />
        ) : (
          <Link
            href="sign-in"
            className={buttonVariants({ className: "text-xs sm:text-md p-0" })}
          >
            Login
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
