import SignUp from "@/components/SignUp";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const page = () => {
  return (
    <div className="absolute inset-0">
      <div className="flex flex-col justify-center items-center h-full gap-20">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "ghost" }), "self-start")}
        >
          <ChevronLeft className="m-2 h-4 w-4" />
        </Link>

        <SignUp />
      </div>
    </div>
  );
};

export default page;
