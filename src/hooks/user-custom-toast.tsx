import Link from "next/link";
import { toast } from "./use-toast";
import { buttonVariants } from "@/components/ui/Button";

export const useCustomToast = () => {
  const loginToast = () => {
    const { dismiss } = toast({
      title: "Login Required",
      description: "Log in to Create Community",
      variant: "destructive",
      action: (
        <Link
          href={"/sign-in"}
          onClick={() => dismiss()}
          className={buttonVariants({ variant: "outline" })}
        >
          Sign In
        </Link>
      ),
    });
  };
  return { loginToast };
};
