import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from "react-markdown";
import axios from "axios";
import {
  Copy,
  Loader2,
  SmilePlus,
  X,
} from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { API_BASE_URL } from "@/lib/api";
import { getAdminArticleById } from "@/lib/adminArticles";
import { ARTICLE_STATUS } from "@/data/categories";
import { formatBlogDate, formatCommentDate } from "@/lib/formatDate";

const DEFAULT_AUTHOR_AVATAR =
  "https://res.cloudinary.com/dcbpjtd1r/image/upload/c_fill,w_80,h_80,g_face,r_max/v1728449784/my-blog-post/xgfy0xnvyemkklcqodkg.jpg";

const FALLBACK_COMMENTS = [
  {
    id: 1,
    name: "Jacob Lash",
    image: "https://i.pravatar.cc/150?img=12",
    comment_text:
      "I loved this article! It really explains why my cat is so independent yet loving. The purring section was super interesting.",
    created_at: "2024-09-12T18:30:00.000Z",
  },
  {
    id: 2,
    name: "Ahri",
    image: "https://i.pravatar.cc/150?img=47",
    comment_text:
      "Such a great read! I've always wondered why my cat slow blinks at me—now I know it's her way of showing trust!",
    created_at: "2024-09-12T14:15:00.000Z",
  },
  {
    id: 3,
    name: "Mimi mama",
    image: "https://i.pravatar.cc/150?img=32",
    comment_text:
      "This article perfectly captures why cats make such amazing pets. I had no idea their purring could help with healing. Fascinating stuff!",
    created_at: "2024-09-12T10:00:00.000Z",
  },
];

const IS_LOGGED_IN = false;

function FacebookIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function LinkedInIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function TwitterIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function ViewPost() {
  const { postId } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    async function fetchPost() {
      setIsLoading(true);

      try {
        const { data } = await axios.get(`${API_BASE_URL}/posts/${postId}`, {
          signal: controller.signal,
        });

        setPost(data);
        setLikes(data.likes ?? 0);

        try {
          const commentsResponse = await axios.get(
            `${API_BASE_URL}/posts/${postId}/comments`,
            { signal: controller.signal },
          );
          setComments(commentsResponse.data);
        } catch {
          setComments(FALLBACK_COMMENTS);
        }
      } catch {
        if (controller.signal.aborted) {
          return;
        }

        const adminArticle = getAdminArticleById(postId);
        if (
          adminArticle &&
          adminArticle.status === ARTICLE_STATUS.PUBLISHED
        ) {
          setPost({
            id: adminArticle.id,
            title: adminArticle.title,
            category: adminArticle.category,
            description: adminArticle.description,
            content: adminArticle.content,
            author: adminArticle.author,
            date: adminArticle.createdAt || adminArticle.updatedAt,
            image: adminArticle.image,
            likes: 0,
          });
          setLikes(0);
          setComments(FALLBACK_COMMENTS);
          return;
        }

        navigate("/not-found", { replace: true });
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }

    fetchPost();

    return () => controller.abort();
  }, [postId, navigate]);

  function openLoginDialog() {
    setIsDialogOpen(true);
  }

  async function handleCopyLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      toast.success("Copied!", {
        description: "This article has been copied to your clipboard.",
      });
    } catch {
      toast.error("Failed to copy", {
        description: "Please copy the link manually from your browser.",
      });
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2
          className="size-8 animate-spin text-stone-500"
          aria-hidden="true"
        />
        <span className="sr-only">Loading article...</span>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const shareUrl = encodeURIComponent(window.location.href);

  return (
    <>
      <article className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
        <img
          src={post.image}
          alt={post.title}
          className="aspect-3/2 w-full rounded-3xl object-cover"
        />

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-800">
            {post.category}
          </span>
          <time dateTime={post.date} className="text-sm text-stone-500">
            {formatBlogDate(post.date)}
          </time>
        </div>

        <h1 className="mt-4 text-3xl font-bold leading-tight text-stone-950 md:text-4xl">
          {post.title}
        </h1>

        <p className="mt-4 text-base leading-relaxed text-stone-600 md:text-lg">
          {post.description}
        </p>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1fr)_280px] lg:gap-12">
          <div className="markdown text-stone-800">
            <ReactMarkdown>{post.content}</ReactMarkdown>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <AuthorBio author={post.author} />
          </aside>
        </div>

        <section
          aria-label="Article actions"
          className="mt-12 flex flex-col gap-4 rounded-2xl bg-stone-100 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <button
            type="button"
            onClick={openLoginDialog}
            className="inline-flex items-center gap-2 rounded-full border border-stone-950 bg-white px-5 py-2.5 text-sm font-medium text-stone-950 transition-colors hover:bg-stone-50"
          >
            <SmilePlus className="size-4" aria-hidden="true" />
            {likes}
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 rounded-full border border-stone-950 bg-white px-5 py-2.5 text-sm font-medium text-stone-950 transition-colors hover:bg-stone-50"
            >
              <Copy className="size-4" aria-hidden="true" />
              Copy
            </button>

            <ul className="flex items-center gap-2" aria-label="Share on social media">
              <li>
                <a
                  href={`https://www.facebook.com/share.php?u=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on Facebook"
                  className="flex size-10 items-center justify-center rounded-full border border-stone-950 bg-white text-[#1877F2] transition-colors hover:bg-stone-50"
                >
                  <FacebookIcon className="size-4" />
                </a>
              </li>
              <li>
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on LinkedIn"
                  className="flex size-10 items-center justify-center rounded-full border border-stone-950 bg-white text-[#0A66C2] transition-colors hover:bg-stone-50"
                >
                  <LinkedInIcon className="size-4" />
                </a>
              </li>
              <li>
                <a
                  href={`https://www.twitter.com/share?url=${shareUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Share on Twitter"
                  className="flex size-10 items-center justify-center rounded-full border border-stone-950 bg-white text-[#1DA1F2] transition-colors hover:bg-stone-50"
                >
                  <TwitterIcon className="size-4" />
                </a>
              </li>
            </ul>
          </div>
        </section>

        <CommentSection
          comments={comments}
          onRequireLogin={openLoginDialog}
        />
      </article>

      <LoginPromptDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </>
  );
}

function AuthorBio({ author }) {
  return (
    <section className="rounded-2xl bg-stone-100 p-6">
      <div className="flex items-center gap-3">
        <img
          src={DEFAULT_AUTHOR_AVATAR}
          alt={`${author} profile`}
          className="size-12 rounded-full object-cover"
        />
        <div>
          <p className="text-sm text-stone-500">Author</p>
          <p className="font-bold text-stone-950">{author}</p>
        </div>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-stone-600">
        I am a pet enthusiast and freelance writer who specializes in animal
        behavior and care. With a deep love for cats, I enjoy sharing insights
        on feline companionship and wellness.
      </p>
      <p className="mt-3 text-sm leading-relaxed text-stone-600">
        When I&apos;m not writing, I spend time volunteering at my local animal
        shelter, helping cats find loving homes.
      </p>
    </section>
  );
}

function CommentSection({ comments, onRequireLogin }) {
  const [commentText, setCommentText] = useState("");
  const [showError, setShowError] = useState(false);

  function handleFocus() {
    if (!IS_LOGGED_IN) {
      onRequireLogin();
    }
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!IS_LOGGED_IN) {
      onRequireLogin();
      return;
    }

    if (!commentText.trim()) {
      setShowError(true);
      return;
    }

    setShowError(false);
    setCommentText("");
  }

  return (
    <section className="mt-10" aria-label="Comments">
      <form onSubmit={handleSubmit}>
        <label htmlFor="comment" className="text-sm font-medium text-stone-700">
          Comment
        </label>
        <Textarea
          id="comment"
          value={commentText}
          onFocus={handleFocus}
          onChange={(event) => {
            setShowError(false);
            setCommentText(event.target.value);
          }}
          placeholder="What are your thoughts?"
          className="mt-2 min-h-28 rounded-xl border-stone-200 bg-white px-4 py-3 text-base text-stone-950"
        />
        {showError && (
          <p className="mt-2 text-sm text-red-600" role="alert">
            Please type something before sending.
          </p>
        )}
        <div className="mt-4 flex justify-end">
          <Button
            type="submit"
            className="h-11 rounded-full bg-stone-950 px-8 text-base font-medium text-white hover:bg-stone-800"
          >
            Send
          </Button>
        </div>
      </form>

      <ul className="mt-10">
        {comments.map((comment, index) => (
          <li key={comment.id ?? index}>
            <article className="flex gap-4 py-6">
              <img
                src={comment.image ?? DEFAULT_AUTHOR_AVATAR}
                alt={`${comment.name} profile`}
                className="size-10 shrink-0 rounded-full object-cover"
              />
              <div className="min-w-0 flex-1">
                <header className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
                  <p className="font-semibold text-stone-950">{comment.name}</p>
                  <time
                    dateTime={comment.created_at}
                    className="text-sm text-stone-500"
                  >
                    {formatCommentDate(comment.created_at)}
                  </time>
                </header>
                <p className="mt-2 text-sm leading-relaxed text-stone-700">
                  {comment.comment_text}
                </p>
              </div>
            </article>
            {index < comments.length - 1 && (
              <hr className="border-stone-200" />
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}

function LoginPromptDialog({ open, onOpenChange }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md rounded-2xl border-stone-200 p-8 sm:max-w-md">
        <button
          type="button"
          onClick={() => onOpenChange(false)}
          className="absolute top-4 right-4 rounded-md p-1 text-stone-500 transition-colors hover:bg-stone-100 hover:text-stone-800"
          aria-label="Close dialog"
        >
          <X className="size-5" aria-hidden="true" />
        </button>

        <AlertDialogTitle className="mt-2 text-center text-2xl font-bold text-stone-950">
          Create an account to continue
        </AlertDialogTitle>

        <div className="mt-6 flex flex-col items-center gap-4">
          <Button
            type="button"
            className="h-12 w-full max-w-xs rounded-full bg-stone-950 text-base font-medium text-white hover:bg-stone-800"
          >
            Create account
          </Button>
          <p className="text-sm text-stone-600">
            Already have an account?{" "}
            <button
              type="button"
              className="font-semibold text-stone-950 underline underline-offset-2"
            >
              Log in
            </button>
          </p>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default ViewPost;
