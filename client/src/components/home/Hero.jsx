import React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

const Hero = () => {
  const { user } = useSelector((state) => state.auth);

  const [menuOpen, setMenuOpen] = React.useState(false);
  const [mousePosition, setMousePosition] = React.useState({ x: 0, y: 0 });
  const bubbleRefs = React.useRef([]);

  // Track mouse position
  React.useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  // Generate bubbles with random properties
  const bubbles = React.useMemo(() => {
    return Array.from({ length: 40 }, (_, i) => ({
      id: i,
      size: Math.random() * 15 + 5,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: Math.random() * 2 + 10,
      opacity: Math.random() * 0.5 + 0.3,
    }));
  }, []);

  const logos = [
    "https://cdn.simpleicons.org/instagram/ffffff",
    "https://cdn.simpleicons.org/framer/ffffff",
    "https://upload.wikimedia.org/wikipedia/commons/4/44/Microsoft_logo.svg",
    "https://cdn.simpleicons.org/huawei/ffffff"
  ];

  return (
    <>
      <div className="relative min-h-screen pb-20 bg-black overflow-hidden">
        {/* Moving Bubbles Background */}
        <div className="absolute inset-0 overflow-hidden z-0">
          {/* Gradient Overlays for depth */}
          <div className="absolute bottom-20 right-1/4 w-[500px] h-[500px] bg-[#2ea043] opacity-10 blur-[120px] rounded-full pointer-events-none"></div>

          {/* Animated Bubbles */}
          {bubbles.map((bubble, index) => {
            const bubbleRef = bubbleRefs.current[index];
            let transform = "";

            if (bubbleRef) {
              const rect = bubbleRef.getBoundingClientRect();
              const bubbleX = rect.left + rect.width / 2;
              const bubbleY = rect.top + rect.height / 2;
              const distanceX = mousePosition.x - bubbleX;
              const distanceY = mousePosition.y - bubbleY;
              const distance = Math.sqrt(
                distanceX * distanceX + distanceY * distanceY
              );

              if (distance < 150) {
                const force = (150 - distance) / 150;
                const moveX = (distanceX / distance) * force * 30;
                const moveY = (distanceY / distance) * force * 30;
                transform = `translate(${moveX}px, ${moveY}px)`;
              }
            }

            return (
              <div
                key={bubble.id}
                ref={(el) => (bubbleRefs.current[index] = el)}
                className="absolute rounded-full animate-float transition-transform duration-300 ease-out"
                style={{
                  width: `${bubble.size}px`,
                  height: `${bubble.size}px`,
                  left: `${bubble.left}%`,
                  top: "-150px`",
                  background: `radial-gradient(circle at 30% 30%, rgba(35, 134, 54, ${
                    bubble.opacity
                  }), rgba(46, 160, 67, ${bubble.opacity * 0.5}))`,
                  boxShadow: `0 0 ${bubble.size}px rgba(35, 134, 54, ${bubble.opacity})`,
                  border: `1px solid rgba(35, 134, 54, ${
                    bubble.opacity * 0.5
                  })`,
                  animationDelay: `${bubble.delay}s`,
                  animationDuration: `${bubble.duration}s`,
                  transform: transform,
                }}
              />
            );
          })}
        </div>

        {/* Navbar */}
        <nav className="z-50 flex items-center justify-between w-full py-4 px-6 md:px-16 lg:px-24 xl:px-40 text-sm backdrop-blur-lg bg-black border-b border-[#30363d] fixed top-0 left-0 right-0">
          <a href="/" className="flex items-center gap-2">
            <span className="text-xl font-semibold text-green-500">
              ResumeAI
            </span>
          </a>

          <div className="hidden md:flex items-center gap-8 transition duration-500 text-[#c9d1d9]">
            <a href="#" className="hover:text-[#238636] transition">
              Home
            </a>
            <a href="#features" className="hover:text-[#238636] transition">
              Features
            </a>
            <a href="#testimonials" className="hover:text-[#238636] transition">
              Testimonials
            </a>
            <a href="#cta" className="hover:text-[#238636] transition">
              Contact
            </a>
          </div>

          <div className="flex gap-3">
            <Link
              to="/app?state=register"
              className="hidden md:block px-6 py-2 bg-[#238636] hover:bg-[#2ea043] active:scale-95 transition-all rounded-md text-white font-medium"
              hidden={user}
            >
              Get started
            </Link>
            <Link
              to="/app?state=login"
              className="hidden md:block px-6 py-2 border border-[#30363d] active:scale-95 hover:bg-[#21262d] transition-all rounded-md text-[#c9d1d9]"
              hidden={user}
            >
              Login
            </Link>
            <Link
              to="/app"
              className="hidden md:block px-8 py-2 bg-[#238636] hover:bg-[#2ea043] active:scale-95 transition-all rounded-md text-white font-medium"
              hidden={!user}
            >
              Dashboard
            </Link>
          </div>

          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden active:scale-90 transition text-[#c9d1d9]"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="26"
              height="26"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className="lucide lucide-menu"
            >
              <path d="M4 5h16M4 12h16M4 19h16" />
            </svg>
          </button>
        </nav>

        {/* Mobile Menu */}
        <div
          className={`fixed inset-0 z-[100] bg-[#0d1117]/90 backdrop-blur-lg flex flex-col items-center justify-center text-lg gap-8 md:hidden transition-transform duration-300 ${
            menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <a
            href="#"
            className="text-[#c9d1d9] hover:text-[#238636] transition"
          >
            Home
          </a>
          <a
            href="#features"
            className="text-[#c9d1d9] hover:text-[#238636] transition"
          >
            Features
          </a>
          <a
            href="#testimonials"
            className="text-[#c9d1d9] hover:text-[#238636] transition"
          >
            Testimonials
          </a>
          <a
            href="#contact"
            className="text-[#c9d1d9] hover:text-[#238636] transition"
          >
            Contact
          </a>
          <button
            onClick={() => setMenuOpen(false)}
            className="active:ring-2 active:ring-[#238636] aspect-square size-10 p-1 items-center justify-center bg-[#238636] hover:bg-[#2ea043] transition text-white rounded-md flex"
          >
            X
          </button>
        </div>

        {/* Hero Section */}
        <div className="relative z-10 flex flex-col items-center justify-center text-sm px-4 md:px-16 lg:px-24 xl:px-40 pt-32">
          {/* Github Stats-like Card */}
          <div className="flex items-center justify-center mb-8">
            <div className="bg-[#21262d] border border-[#30363d] rounded-lg p-4 flex items-center gap-4">
              <div className="flex -space-x-3 pr-4 border-r border-[#30363d]">
                <img
                  src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=200"
                  alt="user3"
                  className="size-8 object-cover rounded-full border-2 border-[#0d1117] hover:-translate-y-0.5 transition z-[1]"
                />
                <img
                  src="https://images.unsplash.com/photo-1633332755192-727a05c4013d?q=80&w=200"
                  alt="user1"
                  className="size-8 object-cover rounded-full border-2 border-[#0d1117] hover:-translate-y-0.5 transition z-[2]"
                />
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200"
                  alt="user2"
                  className="size-8 object-cover rounded-full border-2 border-[#0d1117] hover:-translate-y-0.5 transition z-[3]"
                />
              </div>

              <div className="flex flex-col">
                <div className="flex gap-1">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <svg
                        key={i}
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-star text-transparent fill-[#238636]"
                        aria-hidden="true"
                      >
                        <path d="M11.525 2.295a.53.53 0 0 1 .95 0l2.31 4.679a2.123 2.123 0 0 0 1.595 1.16l5.166.756a.53.53 0 0 1 .294.904l-3.736 3.638a2.123 2.123 0 0 0-.611 1.878l.882 5.14a.53.53 0 0 1-.771.56l-4.618-2.428a2.122 2.122 0 0 0-1.973 0L6.396 21.01a.53.53 0 0 1-.77-.56l.881-5.139a2.122 2.122 0 0 0-.611-1.879L2.16 9.795a.53.53 0 0 1 .294-.906l5.165-.755a2.122 2.122 0 0 0 1.597-1.16z"></path>
                      </svg>
                    ))}
                </div>
                <p className="text-sm text-[#c9d1d9]">
                  10,000+ successful resumes
                </p>
              </div>
            </div>
          </div>

          {/* Headline + CTA */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold max-w-5xl text-center mt-4 md:leading-[70px] text-[#c9d1d9] tracking-tight">
            Land your dream job with{" "}
            <span className="bg-gradient-to-r from-[#238636] to-[#2ea043] bg-clip-text text-transparent inline-block">
              AI-powered
            </span>{" "}
            resumes
          </h1>

          <p className="max-w-xl text-center text-lg mt-6 mb-8 text-[#8b949e]">
            Create and customize professional resumes in minutes with AI
            assistance. Stand out from the crowd and increase your chances of
            getting hired.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/app"
              className="w-full sm:w-auto bg-[#238636] hover:bg-[#2ea043] text-white rounded-md px-8 h-12 flex items-center justify-center font-medium transition-all hover:scale-105 group"
            >
              Get started
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-arrow-right ml-2 size-4 group-hover:translate-x-1 transition-transform"
                aria-hidden="true"
              >
                <path d="M5 12h14"></path>
                <path d="m12 5 7 7-7 7"></path>
              </svg>
            </Link>
            <button className="w-full sm:w-auto flex items-center justify-center gap-2 border border-[#30363d] bg-[#21262d] hover:bg-[#30363d] transition-all rounded-md px-8 h-12 text-[#c9d1d9] hover:scale-105">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="lucide lucide-play-circle size-5"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="10" />
                <polygon points="10 8 16 12 10 16 10 8" />
              </svg>
              <span>Watch demo</span>
            </button>
          </div>

          {/* Github Activity Graph-like Element */}
          <div className="relative mt-20 w-fit flex justify-center px-4">
            <div className="absolute inset-0 bg-[#238636] opacity-5 blur-3xl rounded-full"></div>
            <div className="relative bg-[#21262d] border border-[#30363d] rounded-lg py-8 px-6">
              <h3 className="text-[#c9d1d9] font-medium mb-6 text-left">
                Trusted by leading companies worldwide
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-12 items-center justify-items-center w-fit mx-auto">
                {logos.map((logo, index) => (
                  <div key={index} className="relative group w-28">
                    <div className="absolute inset-0 bg-gradient-to-r from-[#238636]/20 to-[#2ea043]/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg"></div>
                    <img
                      src={logo}
                      alt="logo"
                      className="h-8 w-auto max-w-[100px] object-contain opacity-70 group-hover:opacity-100 transition-opacity mx-auto"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Hero;
