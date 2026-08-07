import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Pen,
  Users,
  Globe,
  PenLine,
  CheckCircle,
  Eye,
  Heart,
} from "lucide-react";
import { useEffect, useState } from "react";
import blogApi from "@/api/blogApi";
import { extractApiError } from "@/utils/apiError";
import { toast } from "sonner";
import tagApi from "@/api/tagApi";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import {
  BlogResponse,
  TagStatsResponse,
} from "@/types/response/blogResponse.types";
import useAuthStore from "@/stores/authStore";

const benefits = [
  {
    icon: <Pen size={32} className="text-[#d32f2f]" />,
    title: "Write Without Limits",
    desc: "No word counts, no paywalls, no restrictions. Just you, your ideas, and an audience that wants to read them.",
  },
  {
    icon: <Users size={32} className="text-[#d32f2f]" />,
    title: "Reach Real Readers",
    desc: "Our discovery algorithm surfaces your work to readers who are genuinely interested in what you write.",
  },
  {
    icon: <Globe size={32} className="text-[#d32f2f]" />,
    title: "Make It Yours",
    desc: "Customize your blog, build your brand, and own your audience. Your content, your rules.",
  },
];

const steps = [
  {
    num: "01",
    title: "Create Profile",
    desc: "Sign up in seconds, choose your niche, and set up your writer profile.",
  },
  {
    num: "02",
    title: "Write Your Post",
    desc: "Use our beautiful editor with AI assistance to craft compelling stories.",
  },
  {
    num: "03",
    title: "Share & Grow",
    desc: "Publish, share, engage with your readers, and build your loyal audience.",
  },
];

const testimonials = [
  {
    name: "Priya Verma",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    role: "Tech Writer · 12K followers",
    quote:
      "BlogAI is the only platform where I feel like my writing is genuinely seen and valued.",
  },
  {
    name: "James Walker",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    role: "Lifestyle Blogger · 8K followers",
    quote:
      "I went from 0 to 8000 followers in just 3 months. The discovery tools are incredible.",
  },
];

const AVATARS = [
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
];

function LandingPage() {
  const [blogs, setBlogs] = useState<BlogResponse[]>([]);
  const [tags, setTags] = useState<TagStatsResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { accessToken } = useAuthStore();
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [blogResponse, tagResponse] = await Promise.all([
          blogApi.get4BlogViewest(),
          tagApi.getTopTagsByViews(),
        ]);
        setBlogs(blogResponse.data.result);
        setTags(tagResponse.data.result);
      } catch (e) {
        toast.error(extractApiError(e));
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  if (loading) return <LoadingSpinner />;

  const blogViewst = blogs?.[0];
  const top3Blog = blogs?.slice(1, 4) ?? [];

  return (
    <div
      className="min-h-screen bg-[#ebf4f5] dark:bg-zinc-950 font-sans"
      
    >
      {/* ── HERO ── */}
      <section className="max-w-340 mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left copy */}
          <div>
            <h1
              className="mb-6 font-black text-[#0d0d0d] dark:text-white leading-[1.05] font-display"
              style={{ fontSize: "clamp(44px, 6vw, 72px)" }}
            >
              Your Ideas Deserve
              <br />
              <span className="text-[#d32f2f]">to Be Read.</span>
            </h1>
            <p className="mb-8 text-lg leading-relaxed text-[#555] dark:text-zinc-300 max-w-120">
              Write freely. Reach thousands. Build your legacy. Join the
              platform where authentic voices break through the noise.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/dashboard">
                <button className="brutal-btn-primary text-base py-3.5 px-8">
                  <PenLine size={18} /> Start Writing
                </button>
              </Link>
              <Link to="/explore">
                <button
                  className="brutal-btn-secondary text-base"
                  style={{ padding: "14px 32px", fontSize: "1rem" }}
                >
                  Explore Blogs <ArrowRight size={18} />
                </button>
              </Link>
            </div>
          </div>

          {/* Hero blog card */}
          <div className="relative">
            <div className="absolute -top-3 -left-3 w-full h-full bg-[#0d0d0d] dark:bg-zinc-700 z-0" />
            <div className="relative z-10 bg-white dark:bg-zinc-900 overflow-hidden group border-[3px] border-[#0d0d0d] dark:border-zinc-600">
              <div className="relative overflow-hidden h-80">
                <img
                  src={
                    blogViewst?.coverImageUrl ||
                    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=700&h=400&fit=crop"
                  }
                  alt={blogViewst?.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {blogViewst?.tags?.map((tag, i) => (
                  <span
                    key={i}
                    className="absolute top-4 left-4 px-3 py-1 text-xs font-display font-bold uppercase tracking-widest text-white bg-[#d32f2f] border-2 border-[#0d0d0d]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="p-6">
                <h3 className="mb-3 font-display font-bold text-xl text-[#0d0d0d] dark:text-white">
                  {blogViewst?.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-[#666] dark:text-zinc-400">
                  {blogViewst?.summary}
                </p>
                <div className="flex items-center justify-between border-t-2 border-[#0d0d0d] dark:border-zinc-600 pt-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={
                        blogViewst?.author?.avatarUrl ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(blogViewst?.author?.fullName || "User")}&background=d32f2f&color=fff`
                      }
                      alt="author"
                      className="w-8 h-8 border-2 border-[#0d0d0d] dark:border-zinc-600"
                    />
                    <p className="text-xs font-display font-bold text-[#0d0d0d] dark:text-zinc-200">
                      {blogViewst?.author?.fullName}
                    </p>
                  </div>
                  <Link to={`/blog/${blogViewst?.blogId || ""}`}>
                    <button
                      className="brutal-btn-primary text-xs"
                      style={{ padding: "8px 16px" }}
                    >
                      Read <ArrowRight size={14} />
                    </button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED BLOGS ── */}
      <section className="py-16 bg-white dark:bg-zinc-900 border-y-[3px] border-[#0d0d0d] dark:border-zinc-700">
        <div className="max-w-340 mx-auto px-6">
          <div className="flex items-center gap-4 mb-10">
            <h2
              className="text-3xl font-black text-[#0d0d0d] dark:text-white font-display"
              
            >
              Featured Stories
            </h2>
            <div className="flex-1 h-0.75 bg-[#0d0d0d] dark:bg-zinc-600" />
            <Link
              to="/explore"
              className="brutal-btn-secondary text-xs"
              style={{ padding: "8px 16px" }}
            >
              View All
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {top3Blog?.map((blog) => (
              <Link
                to={`/blog/${blog.blogId}`}
                key={blog.blogId}
                className="bg-white dark:bg-zinc-800 border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#52525b] overflow-hidden block group transition-all hover:-translate-x-1 hover:-translate-y-1 hover:shadow-[8px_8px_0_#0d0d0d] dark:hover:shadow-[8px_8px_0_#52525b]"
              >
                <div className="relative overflow-hidden h-50">
                  <img
                    src={blog?.coverImageUrl}
                    alt={blog?.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-1 left-0">
                    {blog?.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 mx-1 text-xs font-display font-bold uppercase tracking-widest text-white bg-[#d32f2f] border-2 border-[#0d0d0d]"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="p-5">
                  <h3
                    className="mb-2 font-display font-bold text-lg leading-tight text-[#0d0d0d] dark:text-white"
                    
                  >
                    {blog?.title}
                  </h3>
                  <div className="flex items-center gap-2 justify-between border-t-2 border-[#0d0d0d] dark:border-zinc-600 pt-3">
                    <div className="flex items-center gap-2">
                      <img
                        src={blog?.author?.avatarUrl}
                        alt={blog?.author?.fullName}
                        className="w-7 h-7 border-2 border-[#0d0d0d] dark:border-zinc-600"
                      />
                      <span
                        className="text-xs font-bold text-[#0d0d0d] dark:text-zinc-300 font-display"
                        
                      >
                        {blog?.author?.fullName}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye
                        size={19}
                        strokeWidth={1.8}
                        className="dark:text-zinc-400 text-black"
                      />
                      <span className="text-xs dark:text-zinc-400">
                        {blog.viewCount}
                      </span>
                      <Heart
                        size={19}
                        strokeWidth={1.8}
                        className="dark:text-zinc-400 text-black"
                      />
                      <span className="text-xs dark:text-zinc-400">
                        {blog.likeCount}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section className="py-16 max-w-340 mx-auto px-6">
        <h2
          className="text-3xl font-black mb-8 text-center text-[#0d0d0d] dark:text-white font-display"
          
        >
          Explore by Topic
        </h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {tags?.map((tag) => (
            <button
              key={tag.tag}
              className="brutal-tag text-sm"
              style={{ padding: "10px 20px", fontSize: "0.875rem" }}
              onClick={() =>
                navigate("/explore", { state: { selectedTag: tag.tag } })
              }
            >
              {tag?.tag}
            </button>
          ))}
        </div>
      </section>

      {/* ── WHY BLOGAI ── */}
      <section
        id="features"
        className="py-16 bg-[#0d0d0d] dark:bg-zinc-900 border-t-[3px] border-[#0d0d0d] dark:border-zinc-700"
      >
        <div className="max-w-340 mx-auto px-6">
          <h2
            className="text-3xl font-black mb-12 text-center text-white font-display"
            
          >
            Why <span className="text-[#d32f2f]">BlogAI?</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="p-8 bg-[#ebf4f5] dark:bg-zinc-800 border-[3px] border-[#d32f2f] shadow-[6px_6px_0_#d32f2f]"
              >
                <div className="mb-4">{b.icon}</div>
                <h3
                  className="text-xl font-black mb-3 text-[#0d0d0d] dark:text-white font-display"
                  
                >
                  {b.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#555] dark:text-zinc-400">
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-16 max-w-340 mx-auto px-6">
        <h2
          className="text-3xl font-black mb-12 text-center text-[#0d0d0d] dark:text-white"
        >
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-16">
          {steps.map((step, i) => (
            <div key={step.num} className="relative">
              <div className="p-8 bg-white dark:bg-zinc-900 border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#52525b]">
                <span
                  className="font-display inline-block mb-4 text-4xl font-black text-[#d32f2f]"
                >
                  {step.num}
                </span>
                <h3
                  className=" font-display text-xl font-black mb-3 text-[#0d0d0d] dark:text-white"
                >
                  {step.title}
                </h3>
                <p className="text-sm leading-relaxed text-[#666] dark:text-zinc-400">
                  {step.desc}
                </p>
              </div>
              {i < 2 && (
                <div className="hidden md:block absolute top-1/2 -right-11 text-2xl font-black z-10 text-[#d32f2f] -translate-y-1/2">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── SOCIAL PROOF ── */}
      <section className="py-16 bg-[#ebf4f5] dark:bg-zinc-900 border-y-[3px] border-[#0d0d0d] dark:border-zinc-700">
        <div className="max-w-340 mx-auto px-6">
          <div className="text-center mb-12">
            <p
              className="font-black mb-4 text-[#0d0d0d] dark:text-white font-display"
              style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
            >
              Join <span className="text-[#d32f2f]">10,000+</span> Writers
            </p>
            
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white dark:bg-zinc-800 p-6 border-[3px] border-[#0d0d0d] dark:border-zinc-600 shadow-[4px_4px_0_#0d0d0d] dark:shadow-[4px_4px_0_#52525b]"
              >
                <p className="mb-4 italic text-base leading-relaxed text-[#333] dark:text-zinc-300">
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 border-2 border-[#0d0d0d] dark:border-zinc-600"
                  />
                  <div>
                    <p
                      className="font-black text-sm text-[#0d0d0d] dark:text-white font-display"
                      
                    >
                      {t.name}
                    </p>
                    <p className="text-xs text-[#888] dark:text-zinc-500">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      {!accessToken && (
        <section className="py-20 text-center bg-[#d32f2f] border-b-[3px] border-[#0d0d0d]">
          <div className="max-w-340 mx-auto px-6">
            <h2
              className="font-black mb-6 text-white leading-[1.1] font-display"
              style={{ fontSize: "clamp(36px, 5vw, 64px)" }}
            >
              Start Your Writing
              <br />
              Journey Today.
            </h2>
            <p className="mb-10 text-lg text-white/80">
              No credit card needed. No limits. Just write.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/register">
                <button
                  className="font-black uppercase tracking-wider bg-white text-[#d32f2f] border-[3px] border-[#0d0d0d] shadow-[6px_6px_0_#0d0d0d] cursor-pointer transition-all hover:-translate-x-0.75 hover:-translate-y-0.75 hover:shadow-[9px_9px_0_#0d0d0d] font-display"
                  style={{ padding: "18px 48px",
                    
                    fontSize: "1.1rem" }}
                >
                  🚀 Create Your Free Account
                </button>
              </Link>
              <Link to="/explore">
                <button
                  className="font-black uppercase tracking-wider bg-transparent text-white border-[3px] border-white shadow-[4px_4px_0_rgba(0,0,0,0.3)] cursor-pointer font-display"
                  style={{ padding: "18px 48px",
                    
                    fontSize: "1.1rem" }}
                >
                  Browse Stories
                </button>
              </Link>
            </div>
            <div className="mt-12 flex justify-center gap-8 flex-wrap">
              {["No spam", "Free forever plan", "Cancel anytime"].map(
                (item) => (
                  <div
                    key={item}
                    className="flex items-center gap-2 text-white/80 text-sm"
                  >
                    <CheckCircle size={16} />
                    <span>{item}</span>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

export default LandingPage;
