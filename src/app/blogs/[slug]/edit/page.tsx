import { getBlog } from "@/lib/github-blog";
import EditBlogClient from "./EditBlogClient";
import { notFound } from "next/navigation";

export default async function EditBlogPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getBlog(slug);
  if (!post) notFound();
  return <EditBlogClient post={post} />;
}
