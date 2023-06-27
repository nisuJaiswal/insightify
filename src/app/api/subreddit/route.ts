import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditValidator } from "@/lib/validators/subreddit";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const session = await getAuthSession();
    console.log("FROM /api/subreddit/route.ts: session: ", session);

    // Checking if user logged in
    if (!session?.user) {
      return new Response("User not logged in", { status: 401 });
    }

    const body = await req.json();
    const { name } = SubredditValidator.parse(body);

    // Checking for existing subreddit
    const existing = await db.subreddit.findFirst({
      where: {
        name,
      },
    });

    if (existing) {
      return new Response("Subreddit name already exists", { status: 409 });
    }

    // Otherwise creating new Subreddit
    const subreddit = await db.subreddit.create({
      data: {
        name,
        creatorId: session.user.id,
      },
    });

    // Adding user to the subscription
    await db.subscription.create({
      data: {
        userId: session.user.id,
        subredditId: subreddit.id,
      },
    });
    return new Response(subreddit.name);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(error.message, { status: 422 });
    } else {
      return new Response("Cannot Create Subreddit", { status: 500 });
    }
  }
}
