import { User } from "next-auth";
import Image from "next/image";
import { FC } from "react";
import { AvatarFallback, Avatar } from "./ui/Avatar";
import Icon from "./Icon";
import { AvatarProps } from "@radix-ui/react-avatar";
// import { AvatarProps } from "./ui/Avatar";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "name" | "image">;
}

const UserAvatar: FC<UserAvatarProps> = ({ user, ...props }) => {
  return (
    <Avatar {...props}>
      {user.image ? (
        <div className="relative aspect-square w-full h-full">
          <Image src={user.image} alt="userImage" fill />
        </div>
      ) : (
        <AvatarFallback>
          <span>{user.name}</span>
          <Icon.user className="h-4 w-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
};

export default UserAvatar;
