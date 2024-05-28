import { INFINITE_SCROLL_PAGINATION_SUBREDDITS } from "@/config";
import { db } from "@/lib/db";
import PostFeed from "./PostFeed";
import { getAuthSession } from "@/lib/auth";

const CustomFeed = async () => {
  const session = await getAuthSession();
  const followedCommunity = await db.subscription.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      subreddit: true,
    },
  });
  const post = await db.post.findMany({
    where: {
      subreddit: {
        name: {
          in: followedCommunity.map(({ subreddit }) => subreddit.id),
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true,
    },
    take: INFINITE_SCROLL_PAGINATION_SUBREDDITS,
  });
  return <PostFeed initialPosts={post} />;
};

export default CustomFeed;
