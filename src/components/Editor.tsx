"use client";
import TextareaAutosize from "react-textarea-autosize";
import { useForm } from "react-hook-form";
import { PostCreationRequest, PostValidator } from "@/lib/validators/post";
import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useEffect, useRef, useState } from "react";
import EditorJS from "@editorjs/editorjs";
import { uploadFiles } from "@/lib/uploadthing";

const Editor = ({ subredditId }: { subredditId: string }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<PostCreationRequest>({
    resolver: zodResolver(PostValidator),
    defaultValues: { subredditId, title: "", content: null },
  });

  const ref = useRef<EditorJS>();
  const [isMounted, setIsMounted] = useState(false);

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
    const init = async () => {
      await initializeEditor();
      setTimeout(() => {
        //set focus on title
      });
    };

    if (isMounted) {
      init();
      return () => {};
    }
  }, [isMounted, initializeEditor]);

  return (
    <div className="border border-zinc-200 bg-zinc-50 rounded-lg w-full p-4">
      <form onSubmit={() => {}} className="w-fit" id="subreddit-post-form">
        <div className="prose prose-stone darK:prose-invert">
          <TextareaAutosize
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
