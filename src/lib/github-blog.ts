import { getStaticBlogMeta, getStaticBlog } from "./static-blogs";

const GITHUB_OWNER = "yashs33244";
const GITHUB_REPO = "blogs";
const GITHUB_API = "https://api.github.com";

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  content: string;
  sha?: string; // needed for update/delete
}

export interface BlogMeta {
  slug: string;
  title: string;
  date: string;
  tags: string[];
  excerpt: string;
  sha: string;
}

function parseMarkdown(raw: string, filename: string): BlogPost {
  const slug = filename.replace(/\.md$/, "");
  const fmMatch = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!fmMatch) return { slug, title: slug, date: "", tags: [], excerpt: "", content: raw };
  const fm = fmMatch[1];
  const content = fmMatch[2].trim();
  const getField = (key: string) => {
    const m = fm.match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?`, "m"));
    return m ? m[1].trim() : "";
  };
  const tagsMatch = fm.match(/^tags:\s*\[(.*?)\]/m);
  const tags = tagsMatch
    ? tagsMatch[1].split(",").map((t) => t.trim().replace(/['"]/g, ""))
    : [];
  return {
    slug,
    title: getField("title"),
    date: getField("date"),
    tags,
    excerpt: getField("excerpt"),
    content,
  };
}

export async function listBlogs(): Promise<BlogMeta[]> {
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return getStaticBlogMeta();
    const files: Array<{ name: string; sha: string; download_url: string }> =
      await res.json();
    const mdFiles = files.filter((f) => f.name.endsWith(".md"));

    const posts = await Promise.all(
      mdFiles.map(async (f) => {
        const raw = await fetch(f.download_url, {
          next: { revalidate: 60 },
        }).then((r) => r.text());
        const post = parseMarkdown(raw, f.name);
        return { ...post, sha: f.sha } as BlogMeta;
      })
    );
    if (posts.length === 0) return getStaticBlogMeta();
    return posts.sort((a, b) => b.date.localeCompare(a.date));
  } catch {
    return getStaticBlogMeta();
  }
}

export async function getBlog(slug: string): Promise<BlogPost | null> {
  try {
    const res = await fetch(
      `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${slug}.md`,
      {
        headers: { Accept: "application/vnd.github+json" },
        next: { revalidate: 60 },
      }
    );
    if (!res.ok) return getStaticBlog(slug);
    const data: { content: string; sha: string } = await res.json();
    const raw = Buffer.from(data.content, "base64").toString("utf-8");
    const post = parseMarkdown(raw, `${slug}.md`);
    return { ...post, sha: data.sha };
  } catch {
    return getStaticBlog(slug);
  }
}

export async function createBlog(
  post: Omit<BlogPost, "slug" | "sha">,
  slug: string,
  token: string
): Promise<boolean> {
  const content = `---\ntitle: "${post.title}"\ndate: "${post.date}"\ntags: [${post.tags.map((t) => `"${t}"`).join(", ")}]\nexcerpt: "${post.excerpt}"\n---\n\n${post.content}`;
  const res = await fetch(
    `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${slug}.md`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        message: `Add blog: ${post.title}`,
        content: Buffer.from(content).toString("base64"),
      }),
    }
  );
  return res.ok;
}

export async function updateBlog(
  post: BlogPost,
  token: string
): Promise<boolean> {
  const content = `---\ntitle: "${post.title}"\ndate: "${post.date}"\ntags: [${post.tags.map((t) => `"${t}"`).join(", ")}]\nexcerpt: "${post.excerpt}"\n---\n\n${post.content}`;
  const res = await fetch(
    `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${post.slug}.md`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        message: `Update blog: ${post.title}`,
        content: Buffer.from(content).toString("base64"),
        sha: post.sha,
      }),
    }
  );
  return res.ok;
}

export async function deleteBlog(
  slug: string,
  sha: string,
  token: string
): Promise<boolean> {
  const res = await fetch(
    `${GITHUB_API}/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${slug}.md`,
    {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({ message: `Delete blog: ${slug}`, sha }),
    }
  );
  return res.ok;
}
