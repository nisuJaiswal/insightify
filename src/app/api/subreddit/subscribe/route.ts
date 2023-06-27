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

    if (subscriptionExists)
      return new Response("Already Subscribed", { status: 400 });

    await db.subscription.create({
      data: {
        subredditId,
        userId: session.user!.id,
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
