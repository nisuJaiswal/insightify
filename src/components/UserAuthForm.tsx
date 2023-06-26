"use client";
import { FC, HTMLAttributes, useState } from "react";
import { Button } from "./ui/Button";
import { cn } from "@/lib/utils";
import Icon from "./Icon";
import { signIn } from "next-auth/react";

interface UserAuthFormProps extends HTMLAttributes<HTMLDivElement> {}

const UserAuthForm: FC<UserAuthFormProps> = ({ className, ...props }) => {
  const [isLoading, setIsLoading] = useState(false);
  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      await signIn("google");
    } catch (error) {
      // Generate Error Toast
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
        onClick={loginWithGoogle}
        isLoading={isLoading}
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
