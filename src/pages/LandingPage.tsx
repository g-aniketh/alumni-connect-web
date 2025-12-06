import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  GraduationCap,
  Users,
  Briefcase,
  Heart,
  ArrowRight,
} from "lucide-react";

const LandingPage = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 xl:py-48 bg-linear-to-b from-white to-gray-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl lg:text-6xl/none">
                Connecting Generations of Success
              </h1>
              <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
                The official platform bridging the gap between students, alumni,
                and the institution. Mentor, network, and grow together.
              </p>
            </div>
            <div className="space-x-4">
              <Button asChild size="lg">
                <Link to="/signup">Get Started</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/login">Log In</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-white dark:bg-gray-900">
        <div className="container px-4 md:px-6">
          <div className="grid gap-10 sm:px-10 md:gap-16 md:grid-cols-2">
            {/* For Students */}
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-blue-100 px-3 py-1 text-sm text-blue-700 dark:bg-blue-800 dark:text-blue-100">
                For Students
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Launch Your Career
              </h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Access exclusive opportunities and guidance from those who
                walked the path before you.
              </p>
              <div className="grid gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Users className="w-8 h-8 text-blue-600" />
                    <div className="grid gap-1">
                      <CardTitle>Mentorship</CardTitle>
                      <CardDescription>
                        Connect with alumni for career guidance.
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Briefcase className="w-8 h-8 text-blue-600" />
                    <div className="grid gap-1">
                      <CardTitle>Exclusive Jobs</CardTitle>
                      <CardDescription>
                        Find internships and jobs referred by alumni.
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </div>

            {/* For Alumni */}
            <div className="space-y-4">
              <div className="inline-block rounded-lg bg-green-100 px-3 py-1 text-sm text-green-700 dark:bg-green-800 dark:text-green-100">
                For Alumni
              </div>
              <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
                Give Back & Grow
              </h2>
              <p className="max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
                Stay connected with your alma mater and help shape the next
                generation of leaders.
              </p>
              <div className="grid gap-4">
                <Card>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <GraduationCap className="w-8 h-8 text-green-600" />
                    <div className="grid gap-1">
                      <CardTitle>Networking</CardTitle>
                      <CardDescription>
                        Expand your professional network with fellow grads.
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
                <Card>
                  <CardHeader className="flex flex-row items-center gap-4">
                    <Heart className="w-8 h-8 text-green-600" />
                    <div className="grid gap-1">
                      <CardTitle>Giving Back</CardTitle>
                      <CardDescription>
                        Support fundraising campaigns and events.
                      </CardDescription>
                    </div>
                  </CardHeader>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100 dark:bg-gray-800">
        <div className="container grid items-center justify-center gap-4 px-4 text-center md:px-6">
          <div className="space-y-3">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl/tight">
              Ready to join the community?
            </h2>
            <p className="mx-auto max-w-[600px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-400">
              Sign up today to start connecting.
            </p>
          </div>
          <div className="mx-auto w-full max-w-sm space-y-2">
            <Button asChild size="lg" className="w-full">
              <Link to="/signup">
                Join Now <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
