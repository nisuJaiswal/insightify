import MiniCreatePost from "@/components/MiniCreatePost";
import PostFeed from "@/components/PostFeed";
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
  // params.slug = params.slug.split("%20").join(" ");
  // console.log(params.slug);
  const { slug } = params;
  // let checkedSlug = slug.split("%20").join(" ");
  // console.log(checkedSlug);
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
      <PostFeed initialPosts={subreddit.posts} subredditName={subreddit.name} />
    </>
  );
};

export default Page;
