import { Link, useLocation } from "react-router-dom";
import { Button } from "../components/ui/button";
import { motion, useScroll, useSpring } from "motion/react";
import {
  ArrowRight,
  Briefcase,
  GraduationCap,
  Users,
  Zap,
  Milestone,
  Search,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import type React from "react";
import useEmblaCarousel from "embla-carousel-react";
import { useCallback, useEffect, useState } from "react";
import LanguageBar from "../components/layout/LanguageBar";

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Detect scroll to hide/show language bar
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 grid-pattern pt-[10vh]">
      {/* Language Bar at the very top */}
      <LanguageBar />

      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-black origin-left z-50"
        style={{ scaleX }}
      />
      <header className={`fixed left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-7xl transition-all duration-300 ${isScrolled ? 'top-4' : 'top-12'
        }`}>
        <div className="bg-white/95 backdrop-blur-md rounded-full border border-gray-200 shadow-lg px-6 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <img
              src="https://res.cloudinary.com/dj6i0b4q2/image/upload/v1765264961/image-removebg-preview_4_rc5dsk.png"
              alt="Alumni Connect Logo"
              className="h-10 w-auto object-contain"
            />
            <span className="font-bold text-lg hidden sm:inline">AlumniConnect</span>
          </Link>

          {/* Navigation Links for Landing Page Sections */}
          {location.pathname === "/" && (
            <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
              <a
                href="#opportunities"
                className="transition-colors hover:text-black text-gray-600"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('opportunities')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Opportunities
              </a>
              <a
                href="#path"
                className="transition-colors hover:text-black text-gray-600"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('path')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Path
              </a>
              <a
                href="#stories"
                className="transition-colors hover:text-black text-gray-600"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById('stories')?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                Stories
              </a>
            </nav>
          )}

          <div className="flex items-center space-x-2">
            <Button variant="ghost" asChild className="rounded-full px-6">
              <Link to="/login">Log In</Link>
            </Button>
            <Button asChild className="rounded-full px-6 bg-black hover:bg-gray-800 text-white">
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 pt-24">
        <section className="relative py-28 sm:py-36">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="w-[600px] h-48 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full blur-3xl"
            />
          </div>
          <div className="container mx-auto text-center relative">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
                Where Your Future Finds Its Voice.
              </h1>
              <p className="mt-6 text-lg text-gray-600 max-w-2xl mx-auto">
                Go beyond the classroom. AlumniConnect is your personal bridge
                to a powerful network of mentors, career-defining opportunities,
                and lifelong connections with your institution.
              </p>
              <div className="mt-8 flex justify-center gap-4">
                <Button size="lg" asChild className="rounded-full px-8 bg-black hover:bg-gray-800 text-white">
                  <Link to="/signup">
                    Unlock Your Network <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <section id="opportunities" className="w-full py-20 bg-stone-50 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold tracking-tight">
                An Ecosystem of Opportunity
              </h2>
              <p className="mx-auto max-w-2xl text-gray-600 mt-4">
                Designed for every stage of your professional journey.
              </p>
            </div>
            <div className="grid gap-10 md:grid-cols-3">
              <FeatureCard
                icon={<GraduationCap className="w-8 h-8 text-black" />}
                title="For Ambitious Students"
                description="Find a mentor who's walked your path. Land exclusive internships and jobs. Build the skills and the network you need to launch a successful career."
                delay={0.1}
              />
              <FeatureCard
                icon={<Users className="w-8 h-8 text-black" />}
                title="For Accomplished Alumni"
                description="Give back by sharing your expertise. Reconnect with peers, expand your professional circle, and discover your next great opportunity or hire."
                delay={0.2}
              />
              <FeatureCard
                icon={<Briefcase className="w-8 h-8 text-black" />}
                title="For the Institution"
                description="Cultivate a thriving, engaged community. Unify your alumni relations, fundraising, and mentorship programs on a single, powerful platform."
                delay={0.3}
              />
            </div>
          </div>
        </section>

        <section id="path" className="w-full py-24 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-bold tracking-tight">
                Your Path to a Powerful Network
              </h2>
              <p className="mx-auto max-w-2xl text-gray-600 mt-4">
                A simple, intuitive flow to connect you with the right people
                and opportunities.
              </p>
            </div>
            <div className="relative">
              <motion.div
                className="absolute left-1/2 -translate-x-1/2 h-full w-0.5 bg-stone-200 hidden md:block"
                style={{ scaleY: 0, originY: 0 }}
                whileInView={{ scaleY: 1 }}
                transition={{ duration: 1, ease: "easeOut" }}
              />
              <div className="space-y-20">
                <HowItWorksStep
                  step="1"
                  icon={<Zap />}
                  title="Instant Setup, Lasting Impact"
                  description="Your journey begins with a quick, tailored profile creation. Select your role, highlight your skills, and set your goals. You're now a part of the network."
                  align="left"
                />
                <HowItWorksStep
                  step="2"
                  icon={<Search />}
                  title="Intelligent Discovery"
                  description="Our platform makes finding the right connection effortless. Search for alumni by company, industry, or skills. Discover job postings and events relevant to you."
                  align="right"
                />
                <HowItWorksStep
                  step="3"
                  icon={<Milestone />}
                  title="Meaningful Engagement"
                  description="Move beyond the connection request. Engage in meaningful mentorship, collaborate on projects, attend exclusive events, and contribute to the community that shaped you."
                  align="left"
                />
              </div>
            </div>
          </div>
        </section>

        <section id="stories" className="w-full py-20 bg-stone-50 scroll-mt-24">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold tracking-tight">
                Real Stories, Real Impact
              </h2>
            </div>
            <div className="grid gap-8 md:grid-cols-2 max-w-4xl mx-auto">
              <Testimonial
                quote="The mentorship I received through this platform was a game-changer. It directly led to my first job offer."
                author="Sarah, Class of '23"
                avatar="S"
              />
              <Testimonial
                quote="As an alumnus, it’s incredibly fulfilling to give back. I’ve hired two talented interns from my alma mater through AlumniConnect."
                author="Michael, Class of '12"
                avatar="M"
              />
            </div>
          </div>
        </section>

        <section className="w-full py-24 text-center bg-white">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold tracking-tight">
                Ready to Build Your Legacy?
              </h2>
              <p className="mt-4 text-gray-600">
                Join a network that invests in you at every stage of your
                career.
              </p>
              <div className="mt-8">
                <Button size="lg" asChild className="rounded-full px-8 bg-black hover:bg-gray-800 text-white">
                  <Link to="/signup">
                    Create Your Free Account{" "}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-white">
        <div className="container mx-auto py-8 px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-2">
              <img
                src="https://res.cloudinary.com/dj6i0b4q2/image/upload/v1765264961/image-removebg-preview_4_rc5dsk.png"
                alt="Alumni Connect Logo"
                className="h-8 w-auto object-contain"
              />
              <span className="font-semibold text-gray-900">AlumniConnect</span>
            </div>

            {/* Copyright */}
            <p className="text-sm text-gray-500 text-center md:text-right">
              © {new Date().getFullYear()} AlumniConnect. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

type FeatureCardProps = {
  icon: React.ReactNode;
  title: string;
  description: string;
  delay: number;
};

const FeatureCard = ({ icon, title, description, delay }: FeatureCardProps) => (
  <motion.div
    initial={{ y: 50, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, delay, ease: "easeOut" }}
    whileHover={{ scale: 1.05, transition: { duration: 0.2 } }}
    className="text-center p-8 bg-white rounded-xl border border-stone-200 shadow-sm hover:shadow-xl transition-shadow"
  >
    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-stone-100 mb-5 mx-auto">
      {icon}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

type HowItWorksStepProps = {
  step: string | number;
  icon: React.ReactNode;
  title: string;
  description: string;
  align: "left" | "right";
};

const HowItWorksStep = ({
  step,
  icon,
  title,
  description,
  align,
}: HowItWorksStepProps) => {
  const isLeft = align === "left";
  return (
    <div className="relative flex flex-col md:flex-row items-center justify-center gap-8">
      {/* Left Content */}
      <div className={`md:w-5/12 ${isLeft ? "md:pr-12" : "md:order-3 md:pl-12"}`}>
        <motion.div
          initial={{ x: isLeft ? -50 : 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center"
        >
          {/* Icon at top center */}
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-stone-100 mb-4">
            {icon}
          </div>
          <h3 className="text-2xl font-bold mb-2">{title}</h3>
          <p className="text-gray-600">{description}</p>
        </motion.div>
      </div>

      {/* Center Number Circle - positioned on the line */}
      <div className="w-12 h-12 rounded-full bg-black text-white flex-shrink-0 flex items-center justify-center z-10 md:order-2 relative">
        <span className="font-bold text-lg">{step}</span>
      </div>

      {/* Right Content (empty spacer) */}
      <div className="md:w-5/12 hidden md:block" />
    </div>
  );
};

type TestimonialProps = {
  quote: string;
  author: string;
  avatar: string;
};

const Testimonial = ({ quote, author, avatar }: TestimonialProps) => (
  <motion.div
    initial={{ y: 30, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="bg-white p-8 rounded-lg border border-stone-200 min-w-full md:min-w-[calc(50%-1rem)]"
  >
    <div className="flex items-center mb-4">
      <div className="w-12 h-12 rounded-full bg-black text-white flex items-center justify-center font-bold text-lg mr-4">
        {avatar}
      </div>
      <p className="font-semibold">{author}</p>
    </div>
    <blockquote className="text-lg italic">"{quote}"</blockquote>
  </motion.div>
);


// Stories Carousel Component
const StoriesCarousel = () => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" });
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const scrollPrev = useCallback(() => emblaApi && emblaApi.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi && emblaApi.scrollNext(), [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanScrollPrev(emblaApi.canScrollPrev());
    setCanScrollNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi, onSelect]);

  const stories = [
    {
      quote: "The mentorship I received through this platform was a game-changer. It directly led to my first job offer.",
      author: "Sarah, Class of '23",
      avatar: "S",
    },
    {
      quote: "As an alumnus, it's incredibly fulfilling to give back. I've hired two talented interns from my alma mater through AlumniConnect.",
      author: "Michael, Class of '12",
      avatar: "M",
    },
  ];

  return (
    <div className="relative max-w-4xl mx-auto">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-8">
          {stories.map((story, index) => (
            <div key={index} className="flex-[0_0_100%] md:flex-[0_0_calc(50%-1rem)] min-w-0">
              <Testimonial {...story} />
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={scrollPrev}
        disabled={!canScrollPrev}
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white rounded-full p-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors z-10"
        aria-label="Previous story"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={scrollNext}
        disabled={!canScrollNext}
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white rounded-full p-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors z-10"
        aria-label="Next story"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
};

export default LandingPage;
