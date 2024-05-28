import { INFINITE_SCROLL_PAGINATION_SUBREDDITS } from "@/config";
import { db } from "@/lib/db";
import PostFeed from "./PostFeed";

const GeneralFeed = async () => {
  const post = await db.post.findMany({
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

export default GeneralFeed;
