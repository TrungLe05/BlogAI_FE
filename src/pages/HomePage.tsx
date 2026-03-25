import { ArrowRight, Mail, Clock } from "lucide-react";

function HomePage() {
  const listFeatured = [
    {
      category: "ai ethics",
      title: "The Consciousness Conundrum in AI",
      postedAt: 12,
      imageUrl:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop",
    },
    {
      category: "machine learning",
      title: "Transformer Models Evolution",
      postedAt: 8,
      imageUrl:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800&h=600&fit=crop",
    },
    {
      category: "Neural Networks",
      title: "Neural Interfaces Technology",
      postedAt: 10,
      imageUrl:
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=800&h=600&fit=crop",
    },
  ];

  const listArticles = [
    {
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=600&h=400&fit=crop",
      category: "reasearch",
      title: "Attention Mechanisms: The Foundation of Modern AI",
      content:
        "Breaking down the transformer architecture that powers GPT, BERT, and the next generation of language models.",
      author: "Dr. Yann LeCun",
      dateCreatedPost: "March 20, 2026",
      minuteCreatedPost: 14,
    },
    {
      image:
        "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=600&h=400&fit=crop",
      category: "industry",
      title: "AI in Healthcare: Diagnostic Revolution",
      content:
        "How machine learning algorithms are achieving superhuman accuracy in detecting diseases from medical imaging.",
      author: "Dr. Fei-Fei Li",
      dateCreatedPost: "March 18, 2026",
      minuteCreatedPost: 10,
    },
    {
      image:
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop",
      category: "ethics",
      title: "Bias in AI: Addressing Algorithmic Fairness",
      content:
        "Exploring the challenges and solutions for creating equitable artificial intelligence systems.",
      author: "Timnit Gebru",
      dateCreatedPost: "March 15, 2026",
      minuteCreatedPost: 12,
    },
    {
      image:
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=400&fit=crop",
      category: "future tech",
      title: "Quantum ML: The Next Frontier",
      content:
        "How quantum computing could exponentially accelerate machine learning and unlock new capabilities.",
      author: "Dr. John Preskill",
      dateCreatedPost: "March 12, 2026",
      minuteCreatedPost: 15,
    },
  ];

  return (
    <>
      <main className="flex-1">
        <div className="hidden lg:block max-w-340 mx-auto px6 py-16">
          <section className="border-black border-2">
            <div className="grid lg:grid-cols-[1.6fr_1fr] gap-0.5 bg-black">
              <article className="bg-white relative overflow-hidden group">
                <div className="relative h-174">
                  <img
                    className="h-full w-full object-cover"
                    src="https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=800&fit=crop"
                    alt=""
                  />
                </div>
                {/* <div className="absolute inset-0 bg-gradiant-to-t"></div> */}
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-accent-red px-3 py-1 uppercase font-sans text-sm tracking-widest font-semibold">
                      AI Ethics
                    </span>
                    <div className="h-px flex-1 bg-white/30"></div>
                  </div>
                  <h2
                    className="mb-4 font-serif font-black text-cream/50 leading-1.1"
                    style={{
                      fontSize: "clamp(32px, 4vw, 48px)",
                    }}
                  >
                    The Consciousness Conundrum: Can Machines Ever Truly Think?
                  </h2>
                  <p className="mb-6 italic font-serif-italic text-xl leading-6">
                    A deep dive into the philosophical and technical challenges
                    of creating artificial general intelligence that mirrors
                    human cognition.
                  </p>
                  <div className="flex justify-between items-center">
                    <div className="flex gap-3 text-cream">
                      <div className="w-10 h-10 rounded-full bg-cream overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                          alt=""
                        />
                      </div>

                      <div className="">
                        <h5 className="">Dr. Sarah Chen</h5>
                        <p>12 min read</p>
                      </div>
                    </div>
                    <a
                      href="/"
                      className="text-sm tracking-widest uppercase flex gap-2 items-center hover:gap-3 transition-all"
                    >
                      read more <ArrowRight size={23} />
                    </a>
                  </div>
                </div>
              </article>

              <div className="grid grid-rows-2 gap-0.5 bg-black">
                <article className="bg-white relative overflow-hidden">
                  <div className="relative h-full">
                    <img
                      className="h-full w-full object-cover"
                      src="https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=600&h=400&fit=crop"
                      alt=""
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <span className="inline-block bg-accent-red px-2 py-1 mb-3 uppercase font-sans text-sm font-bold tracking-widest">
                        machine learning
                      </span>
                      <h3
                        className="mb-2 font-serif font-bold"
                        style={{
                          fontSize: "clamp(18px, 2.5vw, 24px)",
                        }}
                      >
                        Transformer Models: Evolution Beyond GPT
                      </h3>
                      <p className="mb-3 italic font-serif-italic text-sm text-cream">
                        How next-generation architectures are reshaping natural
                        language processing.
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-3 text-cream">
                          <div className="w-10 h-10 rounded-full bg-cream overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"
                              alt=""
                            />
                          </div>

                          <div className="">
                            <h5 className="">Dr. Sarah Chen</h5>
                            <p>12 min read</p>
                          </div>
                        </div>
                        <a
                          href="/"
                          className="text-sm tracking-widest uppercase flex gap-2 items-center hover:gap-3 transition-all"
                        >
                          read more <ArrowRight size={23} />
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
                <article className="bg-white relative overflow-hidden">
                  <div className="relative h-full">
                    <img
                      className="h-full w-full object-cover"
                      src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop"
                      alt=""
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <span className="inline-block bg-accent-red px-2 py-1 mb-3 uppercase font-sans text-sm font-bold tracking-widest">
                        neural networks
                      </span>
                      <h3
                        className="mb-2 font-serif font-bold"
                        style={{
                          fontSize: "clamp(18px, 2.5vw, 24px)",
                        }}
                      >
                        Neural Interfaces: Merging Mind and Machine
                      </h3>
                      <p className="mb-3 italic font-serif-italic text-sm text-cream">
                        The latest breakthroughs in brain-computer interface
                        technology.
                      </p>
                      <div className="flex justify-between items-center">
                        <div className="flex gap-3 text-cream">
                          <div className="w-10 h-10 rounded-full bg-cream overflow-hidden">
                            <img
                              src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=600&h=400&fit=crop"
                              alt=""
                            />
                          </div>

                          <div className="">
                            <h5 className="">Dr. Sarah Chen</h5>
                            <p>12 min read</p>
                          </div>
                        </div>
                        <a
                          href="/"
                          className="text-sm tracking-widest uppercase flex gap-2 items-center hover:gap-3 transition-all"
                        >
                          read more <ArrowRight size={23} />
                        </a>
                      </div>
                    </div>
                  </div>
                </article>
              </div>
            </div>
          </section>
        </div>

        <div className="lg:hidden py-8">
          <section className="lg:hidden">
            <h2 className="px-6 mb-4 uppercase tracking-widest font-semibold text-sm ">
              featured
            </h2>
            <div className="overflow-x-auto pb-4 scrollbar-hide">
              <div className="flex gap-4 px-6">
                {listFeatured.map((item, index) => (
                  <article
                    key={index}
                    className="shrink-0 w-[85vw] border-2 border-black bg-white max-w-[320px]"
                  >
                    <div className="aspect-4/3 relative overflow-hidden">
                      <img
                        src={item.imageUrl}
                        className="w-full h-full object-cover"
                        alt=""
                      />
                      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                        <span className="tracking-widest text-xs px-2 py-1 mb-2 font-bold font-sans bg-accent-red uppercase">
                          {item.category}
                        </span>
                        <h3 className="text-lg py-2 tracking-wide font-serif font-bold">
                          {item.title}
                        </h3>
                        <p className="text-sm mt-2 font-sans text-cream/70">
                          {item.postedAt} min
                        </p>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="max-w-340 mx-auto px-6 py-8 lg:py-16">
          <section className="border-2 border-black">
            <div className="grid md:grid-cols-4 gap-0.5 bg-black">
              {listArticles.map((item, index) => (
                <article
                  key={index}
                  className="bg-white group cursor-pointer hover:bg-cream transition-colors flex flex-col" // ✅ thêm flex flex-col
                >
                  <div className="aspect-3/2 overflow-hidden bg-gray-900">
                    <img
                      className="w-full h-full object-cover opacity-75 group-hover:opacity-90 transition-opacity"
                      src={item.image}
                      alt=""
                    />
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    {" "}
                    {/* ✅ flex flex-col flex-1 */}
                    <span className="inline-block text-accent-red mb-3 uppercase font-sans text-xs tracking-widest font-light">
                      {item.category}
                    </span>
                    <h3
                      className="mb-3 font-serif text-lg font-bold text-black"
                      style={{ lineHeight: 1.3 }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="mb-4 font-sans text-sm text-muted flex-1"
                      style={{ lineHeight: 1.3 }}
                    >
                      {/* ✅ flex-1 → đẩy phần author/time xuống đáy */}
                      {item.content}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-black font-sans text-xl text-muted">
                      <span className="text-sm">{item.author}</span>
                      <div className="flex items-center gap-1">
                        <Clock size={15} />
                        <span className="text-sm">
                          {item.minuteCreatedPost} min
                        </span>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>

        <section className="bg-black py-16 relative overflow-hidden">
          <div className="absolute top-8 left-1/2 -translate-x-1/2 select-none pointer-events-none">
            <span
              className="block text-cream font-serif opacity-[0.06] "
              style={{
                fontSize: "clamp(120px, 20vw, 200px)",
                lineHeight: 1,
              }}
            >
              "
            </span>
          </div>
          <div className="max-w-340 mx-auto px-6 relative z-10">
            <blockquote className="text-center max-w-4xl mx-auto">
              <p
                className="mb-6 italic font-serif text-cream"
                style={{
                  fontSize: "clamp(24px, 4vw, 38px)",
                  lineHeight: 1.4,
                }}
              >
                The question is not whether machines can think, but whether
                humans will continue to think deeply about the machines we
                create.
              </p>
              <p className="uppercase tracking-wider font-sans text-xs text-cream opacity-[0.7]">
                — Dr. Alan Turing, Computing Machinery and Intelligence, 1950
              </p>
            </blockquote>
          </div>
        </section>

        <div className="max-w-340 mx-auto px-6 py-8 lg:py-16">
          <section>
            <div className="flex items-center gap-4 mb-8">
              <span className="text-3xl font-bold font-serif ">
                Latest Research
              </span>
              <div className="flex-1 h-0.5 bg-black"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-x-6 gap-y-12">
              {listArticles.map((item, index) => (
                <a href="/" key={index}>
                  <article className="cursor-pointer group">
                    <div className="relative aspect-3/2 mb-4 border-2 border-black overflow-hidden ">
                      <img
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        src={item.image}
                      />
                    </div>
                    <span className="uppercase text-accent-red tracking-widest text-xs font-sans block mb-2">
                      {item.category}
                    </span>
                    <h3
                      className="mb-2 group-hover:underline font-serif text-2xl font-bold"
                      style={{
                        lineHeight: 1.3,
                      }}
                    >
                      {item.title}
                    </h3>
                    <p
                      className="mb-4 font-sans text-lg"
                      style={{
                        lineHeight: 1.65,
                        color: "rgb(42, 42, 42)",
                      }}
                    >
                      {item.content}
                    </p>
                    <div className="flex items-center justify-between ">
                      <div className="font-sans text-sm text-muted">
                        <span className="font-bold">{item.author}</span>
                        <span className="mx-2">•</span>
                        <span>{item.dateCreatedPost}</span>
                        <span className="mx-2">•</span>
                        <span>{item.minuteCreatedPost} min</span>
                      </div>
                      <ArrowRight
                        className="text-muted opacity-0 group-hover:opacity-100 transition-opacity"
                        size={18}
                      />
                    </div>
                  </article>
                </a>
              ))}
            </div>
            <div className="mt-12 text-center">
              <a href="/">
                <button className="px-8 py-3 text-sm font-semibold font-display tracking-wider bg-black text-cream bg-back hover:bg-cream hover:text-black border-2 border-black uppercase transition-colors">
                  view all articles
                </button>
              </a>
            </div>
          </section>
        </div>

        <div className="max-w-340 mx-auto py-8 px-6 lg:py-16 pb-24 lg:pb-16">
          <section className="bg-cream border-2 border-black p-12 ">
            <div className="max-w-2xl mx-auto text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 border-2 border-black bg-white mb-6">
                <Mail className="font-light" size={30} />
              </div>
              <h2 className="mb-4 font-serif text-3xl font-bold text-black">
                The Neural Digest
              </h2>
              <p
                className="mb-8 italic font-serif-italic text-lg text-muted"
                style={{
                  lineHeight: 1.5,
                }}
              >
                Weekly insights on AI research, breakthrough discoveries, and
                the future of intelligent systems delivered to your inbox.
              </p>
              <form className="flex flex-col lg:flex-row gap-2 max-w-lg mx-auto">
                <input
                  type="email"
                  name=""
                  id=""
                  placeholder="YOUR EMAIL ADDRESS"
                  className="flex-1 px-4 py-3 border border-black font-sans text-sm tracking-wider bg-white hover:text-muted focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button
                  type="submit"
                  className="px-8 py-3 bg-black text-cream border-2 border-black hover:bg-cream hover:text-black transition-colors whitespace-nowrap uppercase"
                >
                  subscribe
                </button>
              </form>
              <p className="mt-4 font-sans text-xs tracking-wider text-muted uppercase">
                No spam. Unsubscribe anytime. Published quarterly.
              </p>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
export default HomePage;
