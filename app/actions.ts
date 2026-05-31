"use server";

import { api } from "@/convex/_generated/api";
import { getToken } from "@/lib/auth-server";
import { fetchMutation } from "convex/nextjs";
import { updateTag } from "next/cache";
import { redirect } from "next/navigation";
import z from "zod";
import { PostSchema } from "./schemas/blog";

export async function createBlogAction(values: z.infer<typeof PostSchema>) {
  try {
    const parsed = PostSchema.safeParse(values);
    if (!parsed.success) {
      throw new Error("something went wrong");
    }

    const token = await getToken();

    const imageUrl = await fetchMutation(
      api.posts.generateImageUploadUrl,
      {},
      { token },
    );

    const uploadResult = await fetch(imageUrl, {
      method: "POST",
      headers: {
        "Content-Type": parsed.data.image.type,
      },
      body: parsed.data.image,
    });

    if (!uploadResult.ok) {
      return {
        error: "Failed to upload image",
      };
    }

    const { storageId } = await uploadResult.json();

    await fetchMutation(
      api.posts.createPost,
      {
        title: parsed.data.title,
        body: parsed.data.content,
        imageStorageId: storageId,
      },
      { token },
    );
  } catch {
    return {
      error: "Failed to create post",
    };
  }

  updateTag("blog");
  return redirect("/blog");
}
