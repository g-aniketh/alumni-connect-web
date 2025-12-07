import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import {
  Users,
  GraduationCap,
  Briefcase,
  Plus,
  ArrowRight,
  Upload,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { collegeAPI, jobsAPI, eventsAPI } from "../../lib/api";
import { EmploymentChart } from "../../components/dashboard/EmploymentChart";
import { motion } from "motion/react";
import CollegeDashboardSkeleton from "./CollegeDashboardSkeleton";

const CollegeDashboardPage = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [stats, setStats] = useState({
    totalAlumni: 0,
    verifiedAlumni: 0,
    totalStudents: 0,
    verifiedStudents: 0,
    totalJobs: 0,
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const statsData = await collegeAPI.getStats();
      const mappedStats = {
        totalAlumni: statsData.alumniCount || 0,
        verifiedAlumni: statsData.alumniVerifiedCount || 0,
        totalStudents: statsData.studentCount || 0,
        verifiedStudents: statsData.studentsVerifiedCount || 0,
        totalJobs: 0,
      };

      try {
        const jobsResponse = await jobsAPI.getFiltered({ by: "college" });
        const jobsArray = Array.isArray(jobsResponse)
          ? jobsResponse
          : (jobsResponse.jobs ?? []);
        mappedStats.totalJobs = jobsArray.length;
      } catch (err) {
        console.error("Failed to load jobs:", err);
      }

      setStats(mappedStats);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load dashboard data"
      );
    } finally {
      setLoading(false);
    }
  };

  const statsCards = [
    {
      title: "Total Alumni",
      value: stats.totalAlumni,
      description: `${stats.verifiedAlumni} verified`,
      icon: Users,
      link: "/college/alumni",
    },
    {
      title: "Total Students",
      value: stats.totalStudents,
      description: `${stats.verifiedStudents} verified`,
      icon: GraduationCap,
      link: "/college/students",
    },
    {
      title: "Job Postings",
      value: stats.totalJobs,
      description: "Active opportunities",
      icon: Briefcase,
      link: "/jobs",
    },
  ];

  if (loading) {
    return <CollegeDashboardSkeleton />;
  }

  return (
    <div className="bg-stone-50 min-h-screen">
      <div className="container mx-auto py-8 space-y-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            College Dashboard
          </h1>
          <p className="text-gray-500 mt-2">
            Welcome back, {user?.name}! Here's an overview of your institution's
            network.
          </p>
        </motion.div>

        {error && (
          <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-700">
            {error}
          </div>
        )}

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {statsCards.map((stat, i) => (
              <StatCard key={i} {...stat} />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>
                Common management tasks for your institution.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <QuickActionButton
                icon={Users}
                title="Manage Alumni"
                link="/college/alumni"
              />
              <QuickActionButton
                icon={GraduationCap}
                title="Manage Students"
                link="/college/students"
              />
              <QuickActionButton
                icon={Plus}
                title="Post a Job"
                link="/college/jobs/create"
              />
              <QuickActionButton
                icon={Upload}
                title="Bulk Import"
                link="/college/bulk-import"
              />
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle>Alumni Employment</CardTitle>
              <CardDescription>
                A summary of where your alumni are currently working.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <EmploymentChart />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, description, icon: Icon, link }) => (
  <Link to={link}>
    <Card className="p-6 flex items-start gap-4 transition-all bg-white hover:shadow-md">
      <div className="p-3 bg-stone-100 rounded-lg">
        <Icon className="w-6 h-6 text-black" />
      </div>
      <div>
        <p className="text-sm text-gray-500">{title}</p>
        <p className="text-3xl font-bold">{value}</p>
        <p className="text-xs text-gray-400">{description}</p>
      </div>
    </Card>
  </Link>
);

const QuickActionButton = ({ icon: Icon, title, link }) => (
  <Button
    asChild
    variant="outline"
    className="h-auto flex-col items-start p-4 justify-start hover:bg-stone-100 transition-colors"
  >
    <Link to={link}>
      <Icon className="w-6 h-6 mb-2" />
      <span className="font-semibold">{title}</span>
    </Link>
  </Button>
);

export default CollegeDashboardPage;
