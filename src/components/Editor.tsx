"use client";

import TextareaAutosize from "react-textarea-autosize";
import { useForm } from "react-hook-form";
import { PostCreationRequest, PostValidator } from "@/lib/validators/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import { uploadFiles } from "@/lib/uploadthing";
import { toast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { usePathname, useRouter } from "next/navigation";
import { useCustomToast } from "@/hooks/user-custom-toast";

const Editor = ({ subredditId }: { subredditId: string }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: { subredditId, title: "", content: null },
  });

  const { loginToast } = useCustomToast();
  const ref = useRef<EditorJS | null>(null);
  const [isMounted, setIsMounted] = useState(false);
  const _titleRef = useRef<HTMLTextAreaElement | null>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const initializeEditor = useCallback(async () => {
    const EditorJs = (await import("@editorjs/editorjs")).default;
    const Header = (await import("@editorjs/header")).default;
    const Embed = (await import("@editorjs/embed")).default;
    const Table = (await import("@editorjs/table")).default;
    const List = (await import("@editorjs/list")).default;
    const Code = (await import("@editorjs/code")).default;
    const LinkTool = (await import("@editorjs/link")).default;
    const InlineCode = (await import("@editorjs/inline-code")).default;
    const ImageTool = (await import("@editorjs/image")).default;

    if (!ref.current) {
      ref.current = new EditorJs({
        holder: "editor",
        onReady() {
          console.log("Editor.js is ready!");
        },
        placeholder: "Type here to write post...",
        inlineToolbar: true,
        data: { blocks: [] },
        tools: {
          header: Header,
          linkTool: {
            class: LinkTool,
            config: {
              endpoint: "/api/link",
            },
          },
          image: {
            class: ImageTool,
            config: {
              uploader: {
                async uploadByFile(file: File) {
                  try {
                    const response = await uploadFiles("imageUploader", {files: [file]});
          
                    return {
                      success: 1,
                      file: {
                        url: response[0]?.url, // Ensure response has fileUrl
                      },
                    };
                  } catch (error) {
                    console.error("Image upload failed:", error);
                  }
                },
              },
            },
          },
          list: List,
          code: Code,
          inlineCode: InlineCode,
          table: Table,
          embed: Embed,
        },
      });
    }
  }, []);

  useEffect(() => {
    if (Object.keys(errors).length) {
      Object.values(errors).forEach((error) => {
        toast({
          title: "Something went wrong",
          description: error.message?.toString() ?? "Error",
          variant: "destructive",
        });
      });
    }
  }, [errors]);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();
      setTimeout(() => _titleRef.current?.focus(), 0);
    };

    if (isMounted) {
      init();
      return () => {
        if (ref.current) {
          ref.current.destroy();
          ref.current = null;
        }
      };
    }
  }, [isMounted, initializeEditor]);

  const { mutate: createPost } = useMutation({
    mutationFn: async (payload: PostCreationRequest) => {
      const { data } = await axios.post("/api/subreddit/post/create", payload);
      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          return toast({
            title: "Invalid Post Name",
            description: error.response.data[0]?.message,
            variant: "destructive",
          });
        }

        if (error.response?.status === 500) {
          return toast({
            title: "Internal Server Error",
            description: "There is a problem with the server, please try again later.",
            variant: "destructive",
          });
        }

        if (error.response?.status === 401) {
          return loginToast();
        }
      }

      return toast({
        title: "Something went wrong",
        description: "You might not be logged in or there was another error!",
        variant: "destructive",
      });
    },

    onSuccess: () => {
      const newPathname = pathname.split("/").slice(0, -1).join("/");
      router.push(newPathname);
      router.refresh();

      return toast({
        title: "Post Created Successfully",
        description: "Your post was created successfully.",
        variant: "default",
      });
    },
  });

  async function onSubmit(data: PostCreationRequest) {
    const blocks = await ref.current?.save();

    const payload: PostCreationRequest = {
      title: data.title,
      content: blocks || null,
      subredditId,
    };

    createPost(payload);
  }

  if (!isMounted) return null;

  const { ref: titleRef, ...rest } = register("title");
  return (
    <div className="border border-zinc-200 bg-zinc-50 rounded-lg w-full p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-fit"
        id="subreddit-post-form"
      >
        <div className="prose prose-stone dark:prose-invert">
          <TextareaAutosize
            ref={(e) => {
              titleRef(e);
              _titleRef.current = e;
            }}
            {...rest}
            placeholder="Title"
            className="w-full resize-none appearance-none overflow-hidden bg-transparent text-4xl font-bold focus:outline-none"
          />
          <div id="editor" className="min-h-[500px]" />
        </div>
      </form>
    </div>
  );
};

export default Editor;
