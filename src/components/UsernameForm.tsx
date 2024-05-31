"use client";

import { UsernameRequest, UsernameValidator } from "@/lib/validators/username";
import { zodResolver } from "@hookform/resolvers/zod";
import { User } from "@prisma/client";
import { useForm } from "react-hook-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/Card";
import { Label } from "./ui/Label";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";

const UsernameForm = ({ user }: { user: Pick<User, "id" | "username"> }) => {
  const router = useRouter();

  const { mutate: updateUsername, isLoading } = useMutation({
    mutationFn: async ({ name }: UsernameRequest) => {
      const payload: UsernameRequest = { name };
      const { data } = await axios.patch("/api/username", payload);
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 409) {
          return toast({
            title: "Username Already Exists",
            description: "Please try again with the different username name",
            variant: "destructive",
          });
        }
      }

      return toast({
        title: "There was an Error",
        description: "Something went Wrong, Please try again lateer",
        variant: "destructive",
      });
    },

    onSucess: () => {
      toast({
        title: "Username Change",
        description: "Username updated successfully",
      });

      router.refresh();
    },
  });

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<UsernameRequest>({
    resolver: zodResolver(UsernameValidator),
    defaultValues: {
      name: user?.username || "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit((e) => {
        updateUsername(e);
      })}
    >
      <Card>
        <CardHeader>
          <CardTitle>Your Username</CardTitle>
          <CardDescription>
            Enter the username you want to display
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative gap-1 grid">
            <div className="absolute top-0 left-0 w-8 h-10 grid place-items-center">
              <span className="text-sm text-zinc-400">u/</span>
            </div>
            <Label className="sr-only" htmlFor={"name"}>
              Name
            </Label>
            <Input
              id={"name"}
              size={32}
              className="pl-6 w-[400px]"
              {...register("name")}
            />

            {errors?.name && (
              <p className="text-xs px-1 text-red-600">{errors.name.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button isLoading={isLoading}>Change Name</Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default UsernameForm;
