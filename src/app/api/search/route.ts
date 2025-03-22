import { db } from "@/lib/db";

export async function GET(req: Request) {
  const url = new URL(req.url);
  let q = url.searchParams.get("q");
  // console.log("Here's the Q:" + q);
  if (!q) return new Response("Invalid Query", { status: 400 });

  let userRes = await db.user.findMany({
    where: {
      name: {
        startsWith: q,
      },
    },
    include: {
      _count: true,
    },
    take: 5,
  });

  let subredditRes = await db.subreddit.findMany({
    where: {
      name: {
        startsWith: q,
      },
    },
    include: {
      _count: true,
    },
    take: 5,
  });
  Object.assign(userRes, subredditRes);
  // console.log("Here's the userRes: " + userRes);
  // console.log("Here's the subredditRes: " + subredditRes);
  // userRes.push(subredditRes);
  return new Response(JSON.stringify(userRes));
}
