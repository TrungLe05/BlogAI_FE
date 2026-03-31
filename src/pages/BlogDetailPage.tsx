import { ArrowLeft, Clock, User, Share2, Bookmark, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";

const relatedPosts = [
  {
    id: 2,
    title: "The Psychology Behind Viral Content",
    author: "Marcus Rivera",
    readTime: 7,
    imageUrl: "https://images.unsplash.com/photo-1455390582262-044cdead277a?w=300&h=200&fit=crop",
    category: "Writing",
  },
  {
    id: 3,
    title: "Building Your Personal Brand as a Writer",
    author: "Alex Kim",
    readTime: 9,
    imageUrl: "https://images.unsplash.com/photo-1559136555-9303baea8ebd?w=300&h=200&fit=crop",
    category: "Business",
  },
];

function BlogDetailPage() {
  return (
    <div className="min-h-screen" style={{ background: "#ebf4f5", fontFamily: "var(--font-sans)" }}>
      <div className="max-w-[1360px] mx-auto px-6 py-10">
        {/* Back */}
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 mb-8 font-bold text-sm uppercase tracking-widest hover:text-[#d32f2f] transition-colors"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <ArrowLeft size={16} />
          Back to Explore
        </Link>

        <div className="grid lg:grid-cols-[1fr_320px] gap-8 items-start">
          {/* Main Article */}
          <article>
            {/* Category */}
            <span
              className="inline-block mb-4 px-3 py-1 text-xs font-black uppercase tracking-widest text-white"
              style={{ background: "#d32f2f", border: "2px solid #0d0d0d", fontFamily: "var(--font-display)" }}
            >
              Tech
            </span>

            {/* Title */}
            <h1
              className="font-black mb-6"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(28px, 4vw, 48px)",
                color: "#0d0d0d",
                lineHeight: 1.1,
              }}
            >
              The Art of Storytelling in the<br className="hidden lg:block" /> Age of AI
            </h1>

            {/* Author Row */}
            <div
              className="flex items-center justify-between mb-8 p-4 bg-white"
              style={{ border: "3px solid #0d0d0d", boxShadow: "4px 4px 0 #0d0d0d" }}
            >
              <div className="flex items-center gap-3">
                <img
                  src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
                  alt="author"
                  className="w-12 h-12"
                  style={{ border: "2px solid #0d0d0d" }}
                />
                <div>
                  <p className="font-black text-sm" style={{ fontFamily: "var(--font-display)" }}>Sarah Chen</p>
                  <p className="text-xs" style={{ color: "#888" }}>March 20, 2025</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 text-xs font-bold" style={{ fontFamily: "var(--font-display)" }}>
                  <Clock size={14} />
                  <span>8 min read</span>
                </div>
                <button className="flex items-center gap-1 text-xs" style={{ color: "#666" }}>
                  <Share2 size={14} />
                </button>
                <button className="flex items-center gap-1 text-xs" style={{ color: "#666" }}>
                  <Bookmark size={14} />
                </button>
              </div>
            </div>

            {/* Hero Image */}
            <div
              className="mb-8 overflow-hidden"
              style={{ border: "3px solid #0d0d0d", boxShadow: "6px 6px 0 #0d0d0d" }}
            >
              <img
                src="https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=900&h=480&fit=crop"
                alt="blog cover"
                className="w-full object-cover"
                style={{ height: "360px" }}
              />
            </div>

            {/* Article Body */}
            <div
              className="prose max-w-none mb-8"
              style={{ color: "#333", lineHeight: 1.8, fontFamily: "var(--font-sans)", fontSize: "1.05rem" }}
            >
              <p className="mb-6">
                What makes human-crafted stories irreplaceable even as artificial intelligence becomes an increasingly
                capable writing tool? The answer lies not in the words themselves, but in the lived experience behind
                them — the vulnerability, the specificity, the moments of true emotional resonance that no algorithm
                can authentically manufacture.
              </p>

              {/* Pull Quote */}
              <blockquote
                className="my-8 p-6"
                style={{
                  borderLeft: "6px solid #d32f2f",
                  background: "#ebf4f5",
                  border: "3px solid #0d0d0d",
                  borderLeftWidth: "8px",
                  borderLeftColor: "#d32f2f",
                  boxShadow: "4px 4px 0 #0d0d0d",
                  fontStyle: "italic",
                  fontSize: "1.2rem",
                  color: "#0d0d0d",
                }}
              >
                "The stories that change us are the ones written from the marrow — from pain, from joy, from
                the ordinary moments we almost let slip away."
              </blockquote>

              <p className="mb-6">
                AI can generate technically correct prose. It can mimic styles, construct arguments, and organize
                ideas. But storytelling at its highest level requires something profoundly different: the willingness
                to be seen. To admit not knowing the answer. To sit with discomfort and transform it into something
                that connects with a stranger across time and space.
              </p>

              <h2
                className="text-2xl font-black my-6"
                style={{ fontFamily: "var(--font-display)", color: "#0d0d0d" }}
              >
                The Human Advantage
              </h2>

              <p className="mb-6">
                Authenticity renders AI-generated content obsolete in one crucial domain: the personal essay.
                When you share your grandmother's recipe alongside a meditation on grief, you are doing something
                no machine can replicate. You are bearing witness to your own life — and in doing so, giving
                permission to your reader to bear witness to theirs.
              </p>

              <p className="mb-6">
                This is the paradox of the AI writing age: as automated content floods the internet, the most
                scarce and valuable thing is radical human authenticity. Your stumbles, your perspective, your
                voice is your competitive advantage.
              </p>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-8">
              {["Storytelling", "AI", "Writing", "Creativity"].map((tag) => (
                <span key={tag} className="brutal-tag">{tag}</span>
              ))}
            </div>

            {/* Author Card */}
            <div
              className="p-6 bg-white flex items-start gap-4"
              style={{ border: "3px solid #0d0d0d", boxShadow: "4px 4px 0 #0d0d0d" }}
            >
              <img
                src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face"
                alt="author"
                className="w-16 h-16 flex-shrink-0"
                style={{ border: "3px solid #0d0d0d" }}
              />
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-black" style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>Sarah Chen</p>
                  <User size={14} style={{ color: "#d32f2f" }} />
                </div>
                <p className="text-xs mb-3" style={{ color: "#888" }}>Tech writer & AI researcher · 12K followers</p>
                <p className="text-sm leading-relaxed" style={{ color: "#555" }}>
                  Sarah writes about the intersection of technology and human creativity. She has been exploring
                  AI's impact on media for 5 years.
                </p>
                <button className="brutal-btn-red mt-3" style={{ padding: "8px 16px", fontSize: "0.75rem" }}>
                  Follow Author
                </button>
              </div>
            </div>

            {/* Comments */}
            <div className="mt-10">
              <div className="flex items-center gap-3 mb-6">
                <MessageCircle size={20} />
                <h3 className="font-black text-xl" style={{ fontFamily: "var(--font-display)" }}>
                  Leave a Comment
                </h3>
              </div>
              <div className="p-6 bg-white" style={{ border: "3px solid #0d0d0d" }}>
                <textarea
                  placeholder="Share your thoughts..."
                  className="brutal-input mb-4 resize-none"
                  rows={4}
                />
                <button className="brutal-btn-primary" style={{ padding: "10px 24px" }}>
                  Post Comment
                </button>
              </div>
            </div>
          </article>

          {/* Sidebar */}
          <aside className="hidden lg:block">
            {/* Related Articles */}
            <div
              className="mb-6 bg-white"
              style={{ border: "3px solid #0d0d0d", boxShadow: "4px 4px 0 #0d0d0d" }}
            >
              <div
                className="px-5 py-3"
                style={{ background: "#0d0d0d", borderBottom: "3px solid #0d0d0d" }}
              >
                <h3
                  className="font-black text-sm uppercase tracking-widest text-white"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Related Articles
                </h3>
              </div>
              <div>
                {relatedPosts.map((post, i) => (
                  <Link
                    key={post.id}
                    to={`/blog/${post.id}`}
                    className="flex gap-3 p-4 hover:bg-[#ebf4f5] transition-colors"
                    style={{ borderBottom: i < relatedPosts.length - 1 ? "2px solid #0d0d0d" : "none" }}
                  >
                    <img
                      src={post.imageUrl}
                      alt={post.title}
                      className="w-16 h-16 object-cover flex-shrink-0"
                      style={{ border: "2px solid #0d0d0d" }}
                    />
                    <div>
                      <span className="text-xs font-black uppercase" style={{ color: "#d32f2f", fontFamily: "var(--font-display)" }}>
                        {post.category}
                      </span>
                      <p className="text-sm font-bold leading-tight" style={{ fontFamily: "var(--font-display)", color: "#0d0d0d" }}>
                        {post.title}
                      </p>
                      <p className="text-xs mt-1" style={{ color: "#888" }}>{post.readTime} min read</p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Newsletter */}
            <div
              className="bg-white p-6"
              style={{ border: "3px solid #0d0d0d", boxShadow: "4px 4px 0 #d32f2f" }}
            >
              <div
                className="mb-4 px-3 py-1 inline-block"
                style={{ background: "#d32f2f", border: "2px solid #0d0d0d" }}
              >
                <span className="text-xs font-black uppercase text-white" style={{ fontFamily: "var(--font-display)" }}>
                  Newsletter
                </span>
              </div>
              <h3 className="font-black text-lg mb-2" style={{ fontFamily: "var(--font-display)" }}>
                Stay in the Loop
              </h3>
              <p className="text-xs mb-4 leading-relaxed" style={{ color: "#666" }}>
                Get the best stories delivered to your inbox weekly. No spam.
              </p>
              <input type="email" placeholder="your@email.com" className="brutal-input mb-3" />
              <button className="brutal-btn-primary w-full justify-center" style={{ padding: "10px" }}>
                Subscribe
              </button>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default BlogDetailPage;