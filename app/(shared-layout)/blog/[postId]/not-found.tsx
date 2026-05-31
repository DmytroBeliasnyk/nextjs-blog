import { buttonVariants } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="max-w-3xl mx-auto py-8 px-4 animate-in fade-in duration-500 relative">
      <Link
        href="/blog"
        className={buttonVariants({ variant: "outline", className: "mb-4" })}
      >
        <ArrowLeft className="size-4" />
        Back to Blog
      </Link>

      <div className="max-w-3xl mx-auto py-12 px-4 text-center">
        <h1 className="text-4xl font-extrabold mb-4">No post found</h1>
        <p className="text-muted-foreground mb-6">
          {"The post you are looking for doesn't exist or has been deleted."}
        </p>
      </div>
    </div>
  );
};

export default NotFound;
