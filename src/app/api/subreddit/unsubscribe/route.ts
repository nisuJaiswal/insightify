import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    if (!session) return new Response("Unauthorised User", { status: 401 });

    const body = await req.json();
    const { subredditId } = SubredditSubscriptionValidator.parse(body);

    const subscriptionExists = await db.subscription.findFirst({
      where: {
        subredditId,
        userId: session.user!.id,
      },
    });

    if (!subscriptionExists)
      return new Response("You have not Subscribed", { status: 400 });

    // Checking if user has created
    const subreddit = await db.subreddit.findFirst({
      where: {
        id: subredditId,
        creatorId: session.user!.id,
      },
    });

    if (subreddit)
      return new Response(`You can't unsubscribe your own subreddit`, {
        status: 400,
      });

    await db.subscription.delete({
      where: {
        userId_subredditId: {
          subredditId,
          userId: session.user!.id,
        },
      },
    });

    return new Response(subredditId);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid Data passed", { status: 422 });
    } else {
      return new Response("Something went wrong, Try again later", {
        status: 500,
      });
    }
  }
}
