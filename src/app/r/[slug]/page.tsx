import MiniCreatePost from "@/components/MiniCreatePost";
import { INFINITE_SCROLL_PAGINATION_SUBREDDITS } from "@/config";
import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";
interface PageProps {
  params: {
    slug: string;
  };
}

const Page = async ({ params }: PageProps) => {
  const { slug } = params;
  const session = await getAuthSession();

  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug,
    },
    include: {
      posts: {
        include: {
          author: true,
          votes: true,
          comments: true,
          subreddit: true,
        },
      },
    },
    take: INFINITE_SCROLL_PAGINATION_SUBREDDITS,
  });

  if (!subreddit) return notFound();

  //   console.log("Found SUbReddit from /slug/page.tsx", subreddit);
  return (
    <>
      <h1 className="text-3xl md:text-4xl font-bold h-14">
        r/{subreddit.name}
      </h1>

      <MiniCreatePost session={session} />

      {/* TODO: Show posts in user feed */}
    </>
  );
};

export default Page;
