import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { FC } from "react";
import PostComment from "./PostComment";
import CreateComment from "./CreateComment";

interface CommentSectionProps {
  postId: string;
}
const CommentSection = async ({ postId }: CommentSectionProps) => {
  const session = await getAuthSession();
  const comments = await db.comment.findMany({
    where: {
      postId,
      replyToId: { isSet: false },
    },
    include: {
      author: true,
      votes: true,
      replies: {
        include: {
          author: true,
          votes: true,
        },
      },
    },
  });
  console.log("Comments: ", comments);
  return (
    <div className="flex flex-col gap-y-4 mt-4">
      <hr className="w-full h-px my-6" />

      <CreateComment postId={postId} />

      <div className="flex-col gap-y-6 mt-4">
        {comments
          .filter((cmt) => !cmt.replyToId)
          .map((topLevelComment) => {
            const topLevelCommentVotesAmount = topLevelComment.votes.reduce(
              (acc, cur) => {
                if (cur.type === "UP") return acc + 1;
                if (cur.type === "DOWN") return acc - 1;
                return acc;
              },
              0
            );
            const topLevelCommentVote = topLevelComment.votes.find(
              (vote) => vote.userId === session?.user.id
            );

            return (
              <div key={topLevelComment.id} className="flex flex-col mt-3">
                <div className="mb-4">
                  <PostComment
                    postId={postId}
                    currentVote={topLevelCommentVote}
                    votesAmt={topLevelCommentVotesAmount}
                    comment={topLevelComment}
                  />
                </div>

                {/*  Render Replies */}
                {topLevelComment.replies
                  .sort((a, b) => b.votes.length - a.votes.length)
                  .map((reply) => {
                    const replyVotesAmt = reply.votes.reduce((acc, cur) => {
                      if (cur.type === "UP") return acc + 1;
                      if (cur.type === "DOWN") return acc - 1;
                      return acc;
                    }, 0);
                    const replyVote = reply.votes.find(
                      (vote) => vote.userId === session?.user.id
                    );

                    return (
                      <div
                        className="ml-2 py-2 pl-4 border-l-2 broder-zinc-200"
                        key={reply.id}
                      >
                        <PostComment
                          comment={reply}
                          currentVote={replyVote}
                          votesAmt={replyVotesAmt}
                          postId={postId}
                        />
                      </div>
                    );
                  })}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default CommentSection;
