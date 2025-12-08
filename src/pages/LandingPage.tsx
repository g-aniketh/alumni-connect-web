import { Link } from "react-router-dom";
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
} from "lucide-react";

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div className="flex flex-col min-h-screen bg-white text-gray-800 grid-pattern">
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-black origin-left"
        style={{ scaleX }}
      />
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="container mx-auto flex h-16 items-center">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <GraduationCap className="h-7 w-7 text-black" />
            <span className="font-bold text-lg">AlumniConnect</span>
          </Link>
          <div className="flex flex-1 items-center justify-end space-x-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Log In</Link>
            </Button>
            <Button asChild>
              <Link to="/signup">Sign Up</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
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
                <Button size="lg" asChild>
                  <Link to="/signup">
                    Unlock Your Network <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="w-full py-20 bg-stone-50">
          <div className="container mx-auto">
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

        <section className="w-full py-24">
          <div className="container mx-auto">
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

        <section className="w-full py-20 bg-stone-50">
          <div className="container mx-auto">
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
          <div className="container mx-auto">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-4xl font-bold tracking-tight">
                Ready to Build Your Legacy?
              </h2>
              <p className="mt-4 text-gray-600">
                Join a network that invests in you at every stage of your
                career.
              </p>
              <div className="mt-8">
                <Button size="lg" asChild>
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

      <footer className="border-t">
        <div className="container mx-auto py-8 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-black" />
            <span className="font-semibold">AlumniConnect</span>
          </div>
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} AlumniConnect. All Rights Reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, description, delay }) => (
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

const HowItWorksStep = ({ step, icon, title, description, align }) => {
  const isLeft = align === "left";
  return (
    <div className="flex flex-col md:flex-row items-center justify-center gap-8">
      <div className={`md:w-5/12 ${isLeft ? "md:pr-8" : "md:pl-8 md:order-2"}`}>
        <motion.div
          initial={{ x: isLeft ? -50 : 50, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className={`text-center md:text-${isLeft ? "right" : "left"}`}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-stone-100 mb-4">
            {icon}
          </div>
          <h3 className="text-2xl font-bold">{title}</h3>
          <p className="mt-2 text-gray-600">{description}</p>
        </motion.div>
      </div>
      <div className="w-12 h-12 rounded-full bg-black text-white flex-shrink-0 hidden md:flex items-center justify-center z-10">
        <span className="font-bold text-lg">{step}</span>
      </div>
      <div className="md:w-5/12 hidden md:block"></div>
    </div>
  );
};

const Testimonial = ({ quote, author, avatar }) => (
  <motion.div
    initial={{ y: 30, opacity: 0 }}
    whileInView={{ y: 0, opacity: 1 }}
    transition={{ duration: 0.5, ease: "easeOut" }}
    className="bg-white p-8 rounded-lg border border-stone-200"
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

export default LandingPage;
