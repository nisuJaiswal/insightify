"use client";
import dynamic from "next/dynamic";
import Image from "next/image";
import { FC } from "react";

const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  {
    ssr: false,
  }
);

interface EditorOutputProps {
  content: any;
}
const style = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
};
const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
};
const EditorOutput: FC<EditorOutputProps> = ({ content }) => {
  return (
    <Output
      style={style}
      className="text-sm"
      renderer={renderers}
      data={content}
    />
  );
};

function CustomImageRenderer({ data }: any) {
  //   console.log(data);
  const src = data.file.url;
  return (
    <div className="relative min-h-[15rem] w-full">
      <Image alt="img" className="object-contain" fill src={src} />
    </div>
  );
}
function CustomCodeRenderer({ data }: any) {
  console.log(data);

  return (
    <pre className="bg-gray-800 rounded-md p-4">
      <code className="text-gray-100 text-sm">{data.code}</code>
    </pre>
  );
}
export default EditorOutput;
