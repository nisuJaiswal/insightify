"use client";
import React, { FC, useState } from "react";
import { Label } from "./ui/Label";
import { Button } from "./ui/Button";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/lib/validators/comment";
import axios, { AxiosError } from "axios";
import { Textarea } from "./ui/TextArea";
import { toast } from "@/hooks/use-toast";
import { useCustomToast } from "@/hooks/user-custom-toast";
import { useRouter } from "next/navigation";

interface CreateCommentProps {
  postId: string;
  replyToId?: string;
}
const CreateComment: FC<CreateCommentProps> = ({ postId, replyToId }) => {
  const [input, setInput] = useState<string>("");
  const router = useRouter();
  const { loginToast } = useCustomToast();

  const { mutate: comment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        text,
        replyToId,
      };

      const { data } = await axios.patch(
        "/api/subreddit/post/comment",
        payload
      );
      return data;
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
      router.refresh();
      setInput("");
    },
  });
  return (
    <div className="grid w-full gap-1.5">
      <Label htmlFor="comment ">Your Comment</Label>
      <div className="mt-2">
        <Textarea
          id="comment"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          rows={1}
          placeholder="Share your thoughts"
        />
      </div>
      <div className="mt-2 flex justify-end">
        <Button
          onClick={() => comment({ postId, text: input, replyToId })}
          isLoading={isLoading}
          disabled={input.length === 0}
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default CreateComment;
