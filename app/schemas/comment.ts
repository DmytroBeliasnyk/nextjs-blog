import { Id } from "@/convex/_generated/dataModel";
import z from "zod";

export const CommentSchema = z.object({
  body: z.string().min(3),
  postId: z.custom<Id<"posts">>(),
});
