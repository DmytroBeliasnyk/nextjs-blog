import { buttonVariants } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { CommentSection } from "@/components/web/CommentSection";
import { PostPresence } from "@/components/web/PostPresence";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { getToken } from "@/lib/auth-server";
import { fetchQuery, preloadQuery } from "convex/nextjs";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

interface PostPageProps {
  params: Promise<{ postId: Id<"posts"> }>;
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { postId } = await params;

  const post = await fetchQuery(api.posts.getPostById, { postId });
  if (!post) {
    return {
      title: "Post not found",
    };
  }

  return {
    title: post.title,
    description: post.body,
  };
}

const PostPage = async ({ params }: PostPageProps) => {
  const { postId } = await params;

  const token = await getToken();

  const [post, preloadedComments, user] = await Promise.all([
    await fetchQuery(api.posts.getPostById, { postId }),
    await preloadQuery(api.comments.getComments, {
      postId,
    }),
    await fetchQuery(api.user.getUser, {}, { token }),
  ]);

  if (!user) return redirect("/auth/login");
  if (!post) notFound();

  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
      <Link
        href="/blog"
        className={buttonVariants({ variant: "outline", className: "mb-4" })}
      >
        <ArrowLeft className="size-4" />
        Back to Blog
      </Link>

      <div className="relative w-full h-[400px] mb-8 rounded-xl overflow-hidden shadow-sm">
        <Image
          src={
            post.imageUrl ??
            "https://images.unsplash.com/photo-1779464433091-5b7fcd0b7a96?q=80&w=1074&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          }
          alt={post.title}
          className="object-cover hover:scale-105 transition-transform duration-500"
          fill
        />
      </div>

      <div className="space-y-4 flex flex-col">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {post.title}
        </h1>

        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">
            Posted on: {new Date(post._creationTime).toLocaleDateString()}
          </p>

          {user && <PostPresence roomId={postId} userId={user._id} />}
        </div>
      </div>

      <Separator className="my-8" />

      <p className="text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap">
        {post.body}
      </p>

      <Separator className="my-8" />

      <CommentSection preloadedComments={preloadedComments} />
    </div>
  );
};

export default PostPage;
