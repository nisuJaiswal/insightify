"use client";
import { FC, startTransition } from "react";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { SubscribeToSubredditPayload } from "@/lib/validators/subreddit";
import axios, { AxiosError } from "axios";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/user-custom-toast";
import { useRouter } from "next/navigation";

interface SubscribeLeaveToggleProps {
  subredditId: string;
  subredditName: string;
  isSubscribed: boolean;
}

const SubscribeLeaveToggle: FC<SubscribeLeaveToggleProps> = ({
  subredditId,
  subredditName,
  isSubscribed,
}) => {
  const router = useRouter();
  const { loginToast } = useCustomToast();
  const { mutate: subscribe, isLoading: isSubscribeLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      const { data } = await axios.post("/api/subreddit/subscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
        return toast({
          title: "There was an Error",
          description: "Something went wrond",
          variant: "destructive",
        });
      }
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
      toast({
        title: "Subscribed",
        description: `You have successfully subscribed to r/${subredditName}`,
      });
    },
  });

  const { mutate: unsubscribe, isLoading: isUnsubscribeLoading } = useMutation({
    mutationFn: async () => {
      const payload: SubscribeToSubredditPayload = {
        subredditId,
      };

      const { data } = await axios.post("/api/subreddit/unsubscribe", payload);
      return data as string;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status === 401) {
          return loginToast();
        }
        return toast({
          title: "There was an Error",
          description: "Something went wrond",
          variant: "destructive",
        });
      }
    },
    onSuccess: () => {
      startTransition(() => {
        router.refresh();
      });
      toast({
        title: "Unubscribed",
        description: `You have successfully unsubscribed to r/${subredditName}`,
      });
    },
  });
  //   const isSubscribed = false;
  return isSubscribed ? (
    <Button
      className="w-full mt-1 mb-4"
      onClick={() => unsubscribe()}
      isLoading={isUnsubscribeLoading}
    >
      Leave Community
    </Button>
  ) : (
    <Button
      className="w-full mt-1 mb-4"
      isLoading={isSubscribeLoading}
      onClick={() => subscribe()}
    >
      Join To Post
    </Button>
  );
};

export default SubscribeLeaveToggle;
