"use client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { CreateSubredditPayload } from "@/lib/validators/subreddit";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/user-custom-toast";

const Page = () => {
  const { loginToast } = useCustomToast();
  const { mutate: createCommunity, isLoading } = useMutation({
    mutationFn: async () => {
      const payload: CreateSubredditPayload = {
        name: input,
      };
      const { data } = await axios.post("/api/subreddit", payload);

      console.log("Data from app/r/create/page.tsx::::: ", data);

      return data as string;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 409) {
          return toast({
            title: "Subreddit Already Exists",
            description: "Please try again with the different subreddit name",
            variant: "destructive",
          });
        }

        if (error.response?.status === 422) {
          return toast({
            title: "Invalid Subreddit Name",
            description:
              "Please try again with the name between 3 to 21 characters",
            variant: "destructive",
          });
        }

        if (error.response?.status === 500) {
          return toast({
            title: "Internal Server Error",
            description: "There is problem in server, please try again later",
            variant: "destructive",
          });
        }
        if (error.response?.status === 401) {
          return loginToast();
        }
      }

      toast({
        title: "There was an Error",
        description: "Something went Wrong, Please try again lateer",
        variant: "destructive",
      });
    },
    onSuccess: (data) => {
      console.log("Created Successfully");
      router.push(`/r/${data}`);
    },
  });

  const [input, setInput] = useState<string>("");
  const router = useRouter();
  return (
    <div className="container flex items-center h-full max-w-3xl ">
      <div className="relative bg-white h-fit w-full p-4 space-y-6 rounded-lg">
        <div className="flex items-center justify-between">
          <h1 className="font-bold text-xl">Create a Community</h1>
        </div>

        <hr className="bg-zinc-500 h-px" />

        <div>
          <p className="text-lg font-medium">Name</p>
          <p className="text-xs pb-2">
            Community names including Capitalization cannot be changed
          </p>

          <div className="relative">
            <p className="absolute text-zinc-400 left-0 inset-y-0 text-sm grid place-items-center w-8">
              r/
            </p>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="pl-6"
            />
          </div>
        </div>

        <div className="flex justify-end gap-x-4">
          <Button variant={"outline"} onClick={() => router.back()}>
            Cancel
          </Button>
          <Button
            isLoading={isLoading}
            disabled={input.length === 0}
            onClick={() => createCommunity()}
          >
            Create
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Page;
