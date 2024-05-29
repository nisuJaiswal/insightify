import { Post, Vote, VoteType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { FC } from "react";
import PostVoteClient from "./PostVoteClient";

interface PostVoteServerProps {
  postId: string;
  initialVoteAmt?: number;
  initialVote?: VoteType | null;
  getData: () => Promise<(Post & { votes: Vote[] }) | null>;
}
// const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));
const PostVoteServer = async ({
  postId,
  initialVoteAmt,
  initialVote,
  getData,
}: PostVoteServerProps) => {
  const session = await getServerSession();

  let _votesAmt: number = 0;
  let _currentVote: VoteType | null | undefined = undefined;

  if (getData) {
    // await wait(5000);
    const post = await getData();
    if (!post) return notFound();

    _votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;
      else return acc;
    }, 0);

    _currentVote = post.votes.find(
      (vote) => vote.userId === session?.user.id
    )?.type;
  } else {
    _votesAmt = initialVoteAmt!;
    _currentVote = initialVote;
  }

  return (
    <PostVoteClient
      postId={postId}
      initialVoteAmount={_votesAmt}
      initialVote={_currentVote}
    />
  );
};

export default PostVoteServer;
