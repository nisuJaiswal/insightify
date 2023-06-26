"use client";
import { FC, HTMLAttributes, useState } from "react";
import { Button } from "./ui/Button";
import { cn } from "@/lib/utils";
import Icon from "./Icon";
import { signIn } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await signIn("google");
    } catch (error) {
      // Generate Error Toast
      toast({
        title: "There was an Error",
        description:
          "There might be an error to SignIn With Google, Please try again after few minutes",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div
      className={(cn("flex align-center justify-center"), className)}
      {...props}
    >
      <Button
        isLoading={isLoading}
        onClick={loginWithGoogle}
        className="gap-2 w-full"
        size={"sm"}
      >
        <Icon.google className="w-5 h-5"></Icon.google>
        Google
      </Button>
    </div>
  );
};

export default UserAuthForm;
