import Link from "next/link";
import React from "react";
import Icon from "./Icon";
import { buttonVariants } from "./ui/Button";
import { getAuthSession } from "@/lib/auth";

const Navbar = async () => {
  const session = await getAuthSession();
  console.log(session);
  return (
    <div className="fixed top-0 inset-x-0 h-fit bg-zinc-50 border-b border-zinc-300 z-[10] py-4">
      <div className=" container flex items-center justify-between max-w-7xl h-full">
        <Link href="/" className="flex gap-2 items-center">
          <Icon.logo className="h-8 w-8 sm:h-6 sm:w-6" />
          <p className="hidden md:block text-sm font-medium text-zinc-700">
            Breaddit
          </p>
        </Link>

        {/* Seachbar */}
        {session ? (
          <p>Logged In</p>
        ) : (
          <Link href="sign-in" className={buttonVariants()}>
            Sign In
          </Link>
        )}
      </div>
    </div>
  );
};

export default Navbar;
