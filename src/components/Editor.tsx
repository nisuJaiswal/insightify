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
import { Variable } from "lucide-react";
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
  const ref = useRef<EditorJS>();
  const [isMounted, setIsMounted] = useState(false);
  const _titleRef = useRef<HTMLTextAreaElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== undefined) setIsMounted(true);
  }, []);

  // Dynamically load heavy imports
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
      const editor = new EditorJS({
        holder: "editor",
        onReady() {
          ref.current = editor;
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
                  const [res] = await uploadFiles([file], "imageUploader");
                  return {
                    success: 1,
                    file: {
                      url: res.fileUrl,
                    },
                  };
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
      for (const [_key, value] of Object.entries(errors)) {
        toast({
          title: "Something went Wrong",
          description: (value as { message: string }).message,
          variant: "destructive",
        });
      }
    }
  }, [errors]);

  useEffect(() => {
    const init = async () => {
      await initializeEditor();
      setTimeout(() => {
        //set focus on title
        _titleRef.current?.focus();
      }, 0);
    };

    if (isMounted) {
      init();
      return () => {
        ref.current?.destroy;
        ref.current = undefined;
      };
    }
  }, [isMounted, initializeEditor]);

  const { mutate: createPost } = useMutation({
    mutationFn: async ({
      title,
      content,
      subredditId,
    }: PostCreationRequest) => {
      const paylaod: PostCreationRequest = {
        title,
        content,
        subredditId,
      };
      const { data } = await axios.post("/api/subreddit/post/create", paylaod);

      return data;
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 422) {
          console.log(error);
          return toast({
            title: "Invalid Post Name",
            description: `${error.response.data[0].message}`,
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

      return toast({
        title: "Something went wrong",
        description: "You might be not logged in or there is any other error!",
        variant: "destructive",
      });
    },

    onSuccess: () => {
      // r/[slug]/submit
      const newPathname = pathname.split("/").slice(0, -1).join("/");

      router.push(newPathname);
      router.refresh();

      return toast({
        title: "Post Created Succefully",
        description: "Your post created Successfully",
        variant: "default",
      });
    },
  });

  async function onSubmit(data: PostCreationRequest) {
    const blocks = await ref.current?.save();

    const payload: PostCreationRequest = {
      title: data.title,
      content: blocks,
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
        <div className="prose prose-stone darK:prose-invert">
          <TextareaAutosize
            ref={(e) => {
              titleRef(e);

              // @ts-ignore
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
