import { formatTimeToNow } from "@/lib/utils";
import { Post, User, Vote } from "@prisma/client";
import { MessageSquare } from "lucide-react";
import { FC, useRef } from "react";
import EditorOutput from "./EditorOutput";
import PostVoteClient from "./post-votes/PostVoteClient";

type PartialVote = Pick<Vote, "type">;
interface PostProps {
  subredditName: string;
  post: Post & {
    author: User;
    votes: Vote[];
  };
  currentVote?: PartialVote;
  commentAmount: number;
  votesAmt: number;
}

const Post: FC<PostProps> = ({
  subredditName,
  post,
  commentAmount,
  currentVote,
  votesAmt,
}) => {
  const pRef = useRef<HTMLParagraphElement>(null);
  return (
    <div className="rounded-md bg-white shadow">
      <div className="flex px-6 py-4 justify-between">
        {/* TODO: Post Votes */}
        <PostVoteClient
          postId={post.id}
          initialVote={currentVote?.type}
          initialVoteAmount={votesAmt}
        />
        <div className="w-0 flex-1">
          <div className="mx-h-40 mt-1 text-xs text-gray-500">
            {subredditName ? (
              <>
                <a
                  href={`r/${subredditName}`}
                  className="underline text-zinc-900 text-sm underline-offset-2"
                >
                  r/{subredditName}
                </a>
                <span className="px-1">-</span>
              </>
            ) : null}
            <span>Posted by u/{post.author.name} </span>
            {formatTimeToNow(new Date(post.createdAt))}
          </div>

          <a href={`/r/${subredditName}/post/${post.id}`}>
            <h1 className="text-lg font-semibold py-2 leading-6 text-gray-900">
              {post.title}
            </h1>
          </a>

          <div
            className="relative text-sm max-h-40 overflow-clip w-full"
            ref={pRef}
          >
            <EditorOutput content={post.content} />

            {pRef.current?.clientHeight === 160 ? (
              // For blurring the images
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-white to-transparent h-24"></div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="p-4 sm:px-6 bg-gray-50 z-20">
        <a
          className="w-fit flex items-center gap-2"
          href={`/r/${subredditName}/post/${post.id}`}
        >
          <MessageSquare className="h-4 w-4" /> {commentAmount} Comments
        </a>
      </div>
    </div>
  );
};

export default Post;
