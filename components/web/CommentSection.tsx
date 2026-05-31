"use client";

import { CommentSchema } from "@/app/schemas/comment";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { zodResolver } from "@hookform/resolvers/zod";
import { Preloaded, useMutation, usePreloadedQuery } from "convex/react";
import { Loader2, MessageSquare } from "lucide-react";
import { useParams } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import z from "zod";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Field, FieldError, FieldLabel } from "../ui/field";
import { Separator } from "../ui/separator";
import { Textarea } from "../ui/textarea";

export const CommentSection = ({
  preloadedComments,
}: {
  preloadedComments: Preloaded<typeof api.comments.getComments>;
}) => {
  const { postId } = useParams<{ postId: Id<"posts"> }>();
  const comments = usePreloadedQuery(preloadedComments);
  const createComment = useMutation(api.comments.createComment);
  const [isPending, startTransition] = useTransition();
  const form = useForm({
    resolver: zodResolver(CommentSchema),
    defaultValues: {
      body: "",
      postId: postId,
    },
  });

  const onSubmit = (values: z.infer<typeof CommentSchema>) => {
    startTransition(async () => {
      try {
        await createComment(values);
        toast.success("Comment posted");
      } catch {
        toast.error("Failed to post comment");
      } finally {
        form.reset();
      }
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2 border-b">
        <MessageSquare className="size-5" />
        <h2 className="text-xl font-bold">{comments.length} Comments</h2>
      </CardHeader>

      <CardContent className="space-y-8">
        <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
          <Controller
            name="body"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field>
                <FieldLabel>Your Comment</FieldLabel>
                <Textarea
                  aria-invalid={fieldState.invalid}
                  placeholder="Share your thoughts"
                  {...field}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Button disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Loading...</span>
              </>
            ) : (
              <span>Comment</span>
            )}
          </Button>
        </form>

        {comments?.length > 0 && <Separator />}

        <section className="space-y-6">
          {comments?.map((c) => (
            <div key={c._id} className="flex gap-4">
              <Avatar className="size-10 shrink-0">
                <AvatarImage
                  src={`https://avatar.vercel.sh/${c.authorName}`}
                  alt={c.authorName}
                />
                <AvatarFallback>
                  {c.authorName.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-sm">{c.authorName}</p>
                  <p className="text-muted-foreground text-xs">
                    {new Date(c._creationTime).toLocaleDateString()}
                  </p>
                </div>

                <p className="text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed">
                  {c.body}
                </p>
              </div>
            </div>
          ))}
        </section>
      </CardContent>
    </Card>
  );
};
