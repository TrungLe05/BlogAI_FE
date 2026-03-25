export default function Footer() {
  const mapItems = [
    {
      title: "explore",
      content: [
        "AI Ethics",
        "Machine Learning",
        "Neural Networks",
        "Robotics",
        "Research",
        "Future Tech",
      ],
    },
    {
      title: "resources",
      content: [
        "Archive",
        "Authors",
        "About Us",
        "Advertise",
        "Careers",
        "Contact",
      ],
    },
    {
      title: "connect",
      content: [
        "Twitter",
        "LinkedIn",
        "GitHub",
        "Discord",
        "RSS Feed",
        "Newsletter",
      ],
    },
  ];

  return (
    <>
      <div className="bg-black">
        <div className="max-w-340 mx-auto px-6 py-16">
          // top
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className=" my-auto">
              <h3 className=" text-cream font-display tracking-widest font-bold text-4xl mb-4 leading-6 ">
                NEURAL
              </h3>
              <p className="italic text-muted font-serif-italic text-[16px] tracking-wider">
                Exploring the intersection of artificial intelligence, machine
                learning, and the future of human-computer interaction.
              </p>
            </div>

            {mapItems.map((item, index) => (
              <div className="" key={index}>
                <h4 className="mb-4 uppercase text-cream text-sm tracking-wider font-semibold font-display">
                  {item.title}
                </h4>
                <ul className="space-y-2">
                  {item.content.map((value) => (
                    <li>
                      <a className="hover:underline font-sans text-muted text-sm">
                        {value}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t-2 pt-8 border-cream/20">
            <div className="flex justify-between items-center md:flex-row gap-4">
              <p className="font-sans text-xs uppercase text-muted tracking-wider">
                © 2026 Neural Magazine. All rights reserved.
              </p>
              <div className="flex tracking-widest gap-6 font-sans text-xs text-muted items-center">
                <a href="/" className=" uppercase hover:underline my-2">
                  privacy policy
                </a>
                <a href="/" className="uppercase hover:underline ">
                  term of service
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
