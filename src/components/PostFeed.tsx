"use client";
import { ExtendedPost } from "@/types/db";
import { FC, useEffect, useRef } from "react";
import { useIntersection } from "@mantine/hooks";
import { useInfiniteQuery } from "@tanstack/react-query";
import { INFINITE_SCROLL_PAGINATION_SUBREDDITS } from "@/config";
import axios from "axios";
import { useSession } from "next-auth/react";
import Post from "./Post";

interface PostFeedProps {
  initialPosts: ExtendedPost[];
  subredditName?: string;
}

const PostFeed: FC<PostFeedProps> = ({ initialPosts, subredditName }) => {
  // console.log("Subreddit name: ", subredditName);
  const { data: session } = useSession();
  const lastPostRef = useRef<HTMLElement>(null);

  //   ref for infinite scrolling
  const { ref, entry } = useIntersection({
    root: lastPostRef.current,
    threshold: 1,
  });

  //   Tenstack Infinite Scroll
  const { data, fetchNextPage, isFetchingNextPage } = useInfiniteQuery(
    ["infinite-scroll"],
    async ({ pageParam = 1 }) => {
      const query =
        `/api/posts?limit=${INFINITE_SCROLL_PAGINATION_SUBREDDITS}&page=${pageParam}` +
        (!!subredditName ? `&subredditname=${subredditName}` : "");

      const { data } = await axios.get(query);
      return data as ExtendedPost[];
    },
    {
      getNextPageParam: (_, pages) => {
        return pages.length + 1;
      },
      initialData: {
        pages: [initialPosts],
        pageParams: [1],
      },
    }
  );
  // console.log("Data: ", data);

  const posts = data?.pages.flatMap((page) => page) ?? initialPosts;

  useEffect(() => {
    if (entry?.isIntersecting) fetchNextPage();
  }, [entry, fetchNextPage]);

  return (
    <ul className="flex flex-col col-span-2 space-y-6">
      {posts.map((post, index) => {
        // Handling UpVotes and DownVotes
        const votesAmt = post.votes.reduce((acc, vote) => {
          if (vote.type === "UP") return acc + 1;
          if (vote.type === "DOWN") return acc - 1;

          return acc;
        }, 0);

        // Checking if already Voted
        const currentVote = post.votes.find(
          (vote) => vote.userId === session?.user.id
        );
        if (index === posts.length - 1) {
          return (
            <li key={post.id} ref={ref}>
              <Post
                currentVote={currentVote}
                votesAmt={votesAmt}
                commentAmount={post.comments.length}
                post={post}
                subredditName={post.subreddit.name}
              />
            </li>
          );
        } else {
          return (
            <Post
              key={post.id}
              currentVote={currentVote}
              votesAmt={votesAmt}
              commentAmount={post.comments.length}
              post={post}
              subredditName={post.subreddit.name}
            />
          );
        }
      })}
    </ul>
  );
};

export default PostFeed;
