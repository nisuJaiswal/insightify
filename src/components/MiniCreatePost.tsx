"use client";

import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import UserAvatar from "./UserAvatar";
import { FC } from "react";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { ImageIcon, Link2 } from "lucide-react";

interface MiniCreatePostProps {
  session: Session | null;
}

const MiniCreatePost: FC<MiniCreatePostProps> = ({ session }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <li className="overflow-hidden rounded-md shadow bg-white list-none">
      <div className="h-full py-4 px-6 flex justify-between gap-6">
        <div className="relative">
          <UserAvatar
            user={{
              name: session?.user!.name || null,
              image: session?.user!.image || null,
            }}
          />
          <span className="absolute right-0 bottom-0 bg-green-500 rounded-full w-4 h-4 outline-white outline" />
        </div>

        <Input
          readOnly
          onClick={() => router.push(pathname + "/submit")}
          placeholder="Create Post"
        />

        <Button
          onClick={() => router.push(pathname + "/submit")}
          variant={"ghost"}
        >
          <ImageIcon className="text-zinc-600" />
        </Button>

        <Button
          onClick={() => router.push(pathname + "/submit")}
          variant={"ghost"}
        >
          <Link2 className="text-zinc-600" />
        </Button>
      </div>
    </li>
  );
};

export default MiniCreatePost;
