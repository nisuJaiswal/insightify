import Editor from "@/components/Editor";
import { Button } from "@/components/ui/Button";
import { db } from "@/lib/db";
import { notFound } from "next/navigation";

interface PageProps {
  params: {
    slug: string;
  };
}

const page = async ({ params }: PageProps) => {
  const { slug } = params;

  const subreddit = await db.subreddit.findFirst({
    where: {
      name: slug,
    },
  });

  if (!subreddit) return notFound();

  return (
    <div className="flex items-start flex-col gap-6">
      <div className="border-b border-gray-200 pb-6">
        <div className="-ml-2 -mt-2 flex flex-wrap items-baseline">
          <h3 className="font-semibold ml-2 mt-2 text-base text-gray-600 leading-6">
            Create Post
          </h3>
          <p className="text-gray-400 ml-2 mt-1 text-sm truncate">
            in r/{slug}
          </p>
        </div>
      </div>
      {/* Form */}
      <Editor subredditId={subreddit.id} />

      <div className="w-full flex justify-end">
        <Button
          type="submit"
          className="w-full"
          //   Whenever decalre any form using this name, this button will act like submit for that form
          form="subreddit-post-form"
        >
          Post
        </Button>
      </div>
    </div>
  );
};

export default page;
