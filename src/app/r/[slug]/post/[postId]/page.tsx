import CommentSection from "@/components/CommentSection";
import EditorOutput from "@/components/EditorOutput";
import PostVoteServer from "@/components/post-votes/PostVoteServer";
import { buttonVariants } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { redis } from "@/lib/redit";
import { formatTimeToNow } from "@/lib/utils";
import { CachedPost } from "@/types/redis";
import { Post, User, Vote } from "@prisma/client";
import { ArrowBigDown, ArrowBigUp, Loader2 } from "lucide-react";
import { notFound } from "next/navigation";
import { Suspense } from "react";

interface PageProps {
  params: {
    postId: string;
  };
}

export const dynamic = "force-dynamic";
export const fetchCache = "force-no-store";

const page = async ({ params }: PageProps) => {
  console.log("Getting Cached Dataaaaaaaaaaaaaaaaaa")
  // Getting Data from Cache stored in upstach
  // const cachedPost = (await redis.hgetall(
  //   `post:${params.postId}`
  // )) as CachedPost;
  let cachedPost = false
  let post: (Post & { votes: Vote[]; author: User }) | null = null;
  if (!cachedPost) {
    // If not cached, find from db
    post = await db.post.findFirst({
      where: {
        id: params.postId,
      },
      include: {
        votes: true,
        author: true,
      },
    });
  }

  if (!post && !cachedPost) notFound();

  return (
    <div>
      <div className="h-full flex  sm:flex-row items-center sm:items-start justify-between">
        <Suspense fallback={<PostVoteShell />}>
          {/* @ts-expect-error server compoenent */}
          <PostVoteServer
            postId={post?.id ?? cachedPost.id}
            getData={async () => {
              return await db.post.findUnique({
                where: {
                  id: params.postId,
                },
                include: {
                  votes: true,
                },
              });
            }}
          />
        </Suspense>

        <div className="sm w-full flex-1 bg-white p-4 rounded-sm">
          <p className="max-h-40 mt-1 truncate text-gray-500 font-semibold">
            Posted By u/{post?.author.username ?? cachedPost.authorUsername}{" "}
            <span className="font-normal">
              {formatTimeToNow(
                new Date(post?.createdAt ?? cachedPost.createdAt)
              )}
            </span>
          </p>
          <h1 className="text-xl font-semibold py-2 leading-6 text-gray-900">
            {post?.title ?? cachedPost.title}
          </h1>
          <EditorOutput content={post?.content ?? cachedPost.content} />

          <Suspense
            fallback={
              <Loader2 className="w-5 h-5 text-zinc-500 animate-spin" />
            }
          >
            {/* @ts-expect-error server component */}
            <CommentSection postId={post?.id ?? cachedPost.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

// Skeleton for Vote
function PostVoteShell() {
  return (
    <div className="flex items-center flex-col pr-6 w-20">
      {/* Upvote */}
      <div className={buttonVariants({ variant: "ghost" })}>
        <ArrowBigUp className="h-5 w-5 text-zinc-700" />
      </div>

      {/* Value of Votes */}
      <div className="text-center-py-2 font-medium text-sm text-zinc-900">
        <Loader2 className="w-4 h-4 animate-spin" />
      </div>

      {/* DownVote */}
      <div className={buttonVariants({ variant: "ghost" })}>
        <ArrowBigDown className="h-5 w-5 text-zinc-700" />
      </div>
    </div>
  );
}

export default page;
