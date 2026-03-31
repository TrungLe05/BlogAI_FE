import { Link } from "react-router-dom";
import {
  ArrowRight,
  Pen,
  Users,
  Globe,
  PenLine,
  CheckCircle,
} from "lucide-react";

const featuredBlogs = [
  {
    id: 1,
    category: "Tech",
    title: "How AI is Reshaping the Way We Write Content",
    author: "Sarah Chen",
    authorAvatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    excerpt:
      "Explore how large language models are transforming content creation for writers worldwide.",
    imageUrl:
      "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
    readTime: 8,
  },
  {
    id: 2,
    category: "Lifestyle",
    title: "Building a Writing Habit That Actually Sticks",
    author: "Marcus Rivera",
    authorAvatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    excerpt:
      "The science behind habit formation and how to apply it to consistent writing practice.",
    imageUrl:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=600&h=400&fit=crop",
    readTime: 6,
  },
  {
    id: 3,
    category: "Business",
    title: "From Blog to Brand: Monetizing Your Writing",
    author: "Alex Kim",
    authorAvatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    excerpt:
      "Practical strategies to turn your passion for writing into a sustainable income stream.",
    imageUrl:
      "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=600&h=400&fit=crop",
    readTime: 10,
  },
];

const categories = [
  "Tech",
  "Lifestyle",
  "Business",
  "Personal",
  "Design",
  "Travel",
  "Science",
  "Culture",
];

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

function LandingPage() {
  return (
    <div
      className="min-h-screen"
      style={{ background: "#ebf4f5", fontFamily: "var(--font-sans)" }}
    >
      {/* ── HERO ─────────────────────────────────────────── */}
      <section className="max-w-340 mx-auto px-6 py-16 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left */}
          <div>
            <span
              className="inline-block mb-6 px-3 py-1 text-xs font-bold uppercase tracking-widest"
              style={{
                background: "#d32f2f",
                color: "white",
                border: "2px solid #0d0d0d",
                fontFamily: "var(--font-display)",
              }}
            >
              🔥 New Platform for Writers
            </span>
            <h1
              className="mb-6 font-black leading-none"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(44px, 6vw, 72px)",
                color: "#0d0d0d",
                lineHeight: 1.05,
              }}
            >
              Your Ideas Deserve
              <br />
              <span style={{ color: "#d32f2f" }}>to Be Read.</span>
            </h1>
            <p
              className="mb-8 text-lg leading-relaxed"
              style={{
                color: "#555",
                maxWidth: "480px",
                fontFamily: "var(--font-sans)",
              }}
            >
              Write freely. Reach thousands. Build your legacy. Join the
              platform where authentic voices break through the noise.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/dashboard">
                <button
                  className="brutal-btn-primary text-base"
                  style={{ padding: "14px 32px", fontSize: "1rem" }}
                >
                  <PenLine size={18} />
                  Start Writing
                </button>
              </Link>
              <Link to="/explore">
                <button
                  className="brutal-btn-secondary text-base"
                  style={{ padding: "14px 32px", fontSize: "1rem" }}
                >
                  Explore Blogs
                  <ArrowRight size={18} />
                </button>
              </Link>
            </div>
            <div className="mt-10 flex items-center gap-6">
              <div className="flex -space-x-2">
                {[
                  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
                ].map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt="writer"
                    className="w-9 h-9 object-cover"
                    style={{ border: "2px solid #0d0d0d" }}
                  />
                ))}
              </div>
              <p
                className="text-sm font-bold"
                style={{ fontFamily: "var(--font-display)", color: "#0d0d0d" }}
              >
                <span style={{ color: "#d32f2f" }}>10,000+</span> writers
                already here
              </p>
            </div>
          </div>

          {/* Hero Blog Card */}
          <div className="relative">
            <div
              className="absolute -top-3 -left-3 w-full h-full"
              style={{ background: "#0d0d0d", zIndex: 0 }}
            />
            <div
              className="relative z-10 bg-white overflow-hidden group"
              style={{ border: "3px solid #0d0d0d" }}
            >
              <div
                className="relative overflow-hidden"
                style={{ height: "260px" }}
              >
                <img
                  src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=700&h=400&fit=crop"
                  alt="blog preview"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span
                  className="absolute top-4 left-4 px-3 py-1 text-xs font-black uppercase tracking-widest text-white"
                  style={{
                    background: "#d32f2f",
                    border: "2px solid #0d0d0d",
                    fontFamily: "var(--font-display)",
                  }}
                >
                  Featured
                </span>
              </div>
              <div className="p-6">
                <h3
                  className="mb-3 font-black text-xl"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "#0d0d0d",
                  }}
                >
                  The Art of Storytelling in the Age of AI
                </h3>
                <p
                  className="mb-4 text-sm leading-relaxed"
                  style={{ color: "#666" }}
                >
                  What makes human-crafted stories irreplaceable even as
                  artificial intelligence becomes an increasingly capable
                  writing tool...
                </p>
                <div
                  className="flex items-center justify-between"
                  style={{ borderTop: "2px solid #0d0d0d", paddingTop: "16px" }}
                >
                  <div className="flex items-center gap-2">
                    <img
                      src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=face"
                      alt="author"
                      className="w-8 h-8"
                      style={{ border: "2px solid #0d0d0d" }}
                    />
                    <div>
                      <p
                        className="text-xs font-bold"
                        style={{ fontFamily: "var(--font-display)" }}
                      >
                        Sarah Chen
                      </p>
                      <p className="text-xs" style={{ color: "#888" }}>
                        8 min read
                      </p>
                    </div>
                  </div>
                  <Link to="/blog/1">
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

      {/* ── FEATURED BLOGS ──────────────────────────────── */}
      <section
        className="py-16"
        style={{
          background: "white",
          borderTop: "3px solid #0d0d0d",
          borderBottom: "3px solid #0d0d0d",
        }}
      >
        <div className="max-w-340 mx-auto px-6">
          <div className="flex items-center gap-4 mb-10">
            <h2
              className="text-3xl font-black"
              style={{ fontFamily: "var(--font-display)", color: "#0d0d0d" }}
            >
              Featured Stories
            </h2>
            <div className="flex-1 h-0.75 bg-[#0d0d0d]" />
            <Link
              to="/explore"
              className="brutal-btn-secondary text-xs"
              style={{ padding: "8px 16px" }}
            >
              View All
            </Link>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {featuredBlogs.map((blog) => (
              <Link
                to={`/blog/${blog.id}`}
                key={blog.id}
                className="brutal-card overflow-hidden block"
              >
                <div
                  className="relative overflow-hidden"
                  style={{ height: "200px" }}
                >
                  <img
                    src={blog.imageUrl}
                    alt={blog.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span
                    className="absolute top-3 left-3 px-2 py-1 text-xs font-black uppercase tracking-widest text-white"
                    style={{
                      background: "#d32f2f",
                      border: "2px solid #0d0d0d",
                      fontFamily: "var(--font-display)",
                    }}
                  >
                    {blog.category}
                  </span>
                </div>
                <div className="p-5">
                  <h3
                    className="mb-2 font-black text-lg leading-tight"
                    style={{
                      fontFamily: "var(--font-display)",
                      color: "#0d0d0d",
                    }}
                  >
                    {blog.title}
                  </h3>
                  <p
                    className="mb-4 text-sm leading-relaxed"
                    style={{ color: "#666" }}
                  >
                    {blog.excerpt}
                  </p>
                  <div
                    className="flex items-center gap-2"
                    style={{
                      borderTop: "2px solid #0d0d0d",
                      paddingTop: "12px",
                    }}
                  >
                    <img
                      src={blog.authorAvatar}
                      alt={blog.author}
                      className="w-7 h-7"
                      style={{ border: "2px solid #0d0d0d" }}
                    />
                    <span
                      className="text-xs font-bold"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {blog.author}
                    </span>
                    <span className="ml-auto text-xs" style={{ color: "#888" }}>
                      {blog.readTime} min
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ──────────────────────────────────── */}
      <section className="py-16 max-w-340 mx-auto px-6">
        <h2
          className="text-3xl font-black mb-8 text-center"
          style={{ fontFamily: "var(--font-display)", color: "#0d0d0d" }}
        >
          Explore by Topic
        </h2>
        <div className="flex flex-wrap gap-3 justify-center">
          {categories.map((cat) => (
            <Link to={`/explore?cat=${cat.toLowerCase()}`} key={cat}>
              <button
                className="brutal-tag text-sm"
                style={{ padding: "10px 20px", fontSize: "0.875rem" }}
              >
                {cat}
              </button>
            </Link>
          ))}
        </div>
      </section>

      {/* ── WHY PLATFORM ────────────────────────────────── */}
      <section
        id="features"
        className="py-16"
        style={{ background: "#0d0d0d", borderTop: "3px solid #0d0d0d" }}
      >
        <div className="max-w-340 mx-auto px-6">
          <h2
            className="text-3xl font-black mb-12 text-center"
            style={{ fontFamily: "var(--font-display)", color: "white" }}
          >
            Why <span style={{ color: "#d32f2f" }}>BlogAI?</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {benefits.map((b) => (
              <div
                key={b.title}
                className="p-8"
                style={{
                  background: "#ebf4f5",
                  border: "3px solid #d32f2f",
                  boxShadow: "6px 6px 0 #d32f2f",
                }}
              >
                <div className="mb-4">{b.icon}</div>
                <h3
                  className="text-xl font-black mb-3"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "#0d0d0d",
                  }}
                >
                  {b.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#555" }}
                >
                  {b.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────── */}
      <section className="py-16 max-w-340 mx-auto px-6">
        <h2
          className="text-3xl font-black mb-12 text-center"
          style={{ fontFamily: "var(--font-display)", color: "#0d0d0d" }}
        >
          How It Works
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {steps.map((step, i) => (
            <div key={step.num} className="relative">
              <div
                className="p-8 bg-white"
                style={{
                  border: "3px solid #0d0d0d",
                  boxShadow: "4px 4px 0 #0d0d0d",
                }}
              >
                <span
                  className="inline-block mb-4 text-4xl font-black"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "#d32f2f",
                  }}
                >
                  {step.num}
                </span>
                <h3
                  className="text-xl font-black mb-3"
                  style={{
                    fontFamily: "var(--font-display)",
                    color: "#0d0d0d",
                  }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "#666" }}
                >
                  {step.desc}
                </p>
              </div>
              {i < 2 && (
                <div
                  className="hidden md:block absolute top-1/2 -right-3 text-2xl font-black z-10"
                  style={{ color: "#d32f2f", transform: "translateY(-50%)" }}
                >
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── SOCIAL PROOF ────────────────────────────────── */}
      <section
        className="py-16"
        style={{
          background: "#ebf4f5",
          borderTop: "3px solid #0d0d0d",
          borderBottom: "3px solid #0d0d0d",
        }}
      >
        <div className="max-w-340 mx-auto px-6">
          <div className="text-center mb-12">
            <p
              className="font-black mb-4"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(36px, 5vw, 64px)",
                color: "#0d0d0d",
              }}
            >
              Join <span style={{ color: "#d32f2f" }}>10,000+</span> Writers
            </p>
            <div className="flex justify-center -space-x-2 mb-3">
              {[
                "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=50&h=50&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
                "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=50&h=50&fit=crop&crop=face",
              ].map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt="writer"
                  className="w-11 h-11 object-cover"
                  style={{ border: "3px solid #0d0d0d" }}
                />
              ))}
            </div>
            <p
              className="text-sm"
              style={{ color: "#888", fontFamily: "var(--font-sans)" }}
            >
              Real writers. Real stories. Real growth.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white p-6"
                style={{
                  border: "3px solid #0d0d0d",
                  boxShadow: "4px 4px 0 #0d0d0d",
                }}
              >
                <p
                  className="mb-4 italic text-base leading-relaxed"
                  style={{ color: "#333", fontFamily: "var(--font-sans)" }}
                >
                  "{t.quote}"
                </p>
                <div className="flex items-center gap-3">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10"
                    style={{ border: "2px solid #0d0d0d" }}
                  />
                  <div>
                    <p
                      className="font-black text-sm"
                      style={{
                        fontFamily: "var(--font-display)",
                        color: "#0d0d0d",
                      }}
                    >
                      {t.name}
                    </p>
                    <p className="text-xs" style={{ color: "#888" }}>
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FINAL CTA ────────────────────────────────────── */}
      <section
        className="py-20 text-center"
        style={{ background: "#d32f2f", borderBottom: "3px solid #0d0d0d" }}
      >
        <div className="max-w-340 mx-auto px-6">
          <h2
            className="font-black mb-6"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(36px, 5vw, 64px)",
              color: "white",
              lineHeight: 1.1,
            }}
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
                className="font-black uppercase tracking-wider"
                style={{
                  background: "white",
                  color: "#d32f2f",
                  border: "3px solid #0d0d0d",
                  boxShadow: "6px 6px 0 #0d0d0d",
                  padding: "18px 48px",
                  fontFamily: "var(--font-display)",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                  transition: "transform 0.15s, box-shadow 0.15s",
                }}
                onMouseEnter={(e) => {
                  (e.target as HTMLButtonElement).style.transform =
                    "translate(-3px,-3px)";
                  (e.target as HTMLButtonElement).style.boxShadow =
                    "9px 9px 0 #0d0d0d";
                }}
                onMouseLeave={(e) => {
                  (e.target as HTMLButtonElement).style.transform =
                    "translate(0,0)";
                  (e.target as HTMLButtonElement).style.boxShadow =
                    "6px 6px 0 #0d0d0d";
                }}
              >
                🚀 Create Your Free Account
              </button>
            </Link>
            <Link to="/explore">
              <button
                className="font-black uppercase tracking-wider"
                style={{
                  background: "transparent",
                  color: "white",
                  border: "3px solid white",
                  boxShadow: "4px 4px 0 rgba(0,0,0,0.3)",
                  padding: "18px 48px",
                  fontFamily: "var(--font-display)",
                  fontSize: "1.1rem",
                  cursor: "pointer",
                }}
              >
                Browse Stories
              </button>
            </Link>
          </div>
          <div className="mt-12 flex justify-center gap-8 flex-wrap">
            {["No spam", "Free forever plan", "Cancel anytime"].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-white/80 text-sm"
              >
                <CheckCircle size={16} />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;
