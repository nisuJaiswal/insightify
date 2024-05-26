import { z } from "zod";

export const SubredditValidator = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long." })
    .max(21, { message: "Name must be at most 21 characters long." })
    .regex(/^\S*$/, { message: "Name must not contain spaces." }),
});
export const SubredditSubscriptionValidator = z.object({
  subredditId: z.string(),
});

export type CreateSubredditPayload = z.infer<typeof SubredditValidator>;
export type SubscribeToSubredditPayload = z.infer<
  typeof SubredditSubscriptionValidator
>;
