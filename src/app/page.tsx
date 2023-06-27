import { buttonVariants } from "@/components/ui/Button";
import { HomeIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <h1 className="font-bold text-3xl md:text-4xl text-center">Your Feed</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-y-4 md:gap-x-4 py-6">
        {/* Feed */}

        {/* Subreddit Info */}
        <div className="overflow-hidden h-fit rounded-lg border border-gray-200 order-first md:order-last">
          <div className="bg-emerald-200 px-6 py-4">
            <p className="font-semibold flex items-center py-3 gap-1.5">
              <HomeIcon className="w-4 h-4" />
              Home
            </p>
          </div>
          <div className="-my-3  leading-6 px-6 py-4 text-sm">
            <div className="flex justify-between gap-x-4 py-3">
              <p className="text-zinc-500">
                Your Personal Reddit Homepage, Come here to checkout your
                favourite Commnunities
              </p>
            </div>

            <Link
              href="/r/create"
              className={buttonVariants({ className: "w-full mt-4 mb-6" })}
            >
              Create Community
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
