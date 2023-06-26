import SignIn from "@/components/SignIn";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import Link from "next/link";

const page = () => {
  return (
    <div className="absolute inset-0">
      <div className="flex flex-col justify-center items-center h-full gap-20">
        <Link
          href="/"
          className={cn(buttonVariants({ variant: "ghost" }), "self-start")}
        >
          Home
        </Link>

        <SignIn />
      </div>
    </div>
  );
};

export default page;
