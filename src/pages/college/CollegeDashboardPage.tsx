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
import { Users, GraduationCap, Briefcase, Plus, Upload } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { collegeAPI, jobsAPI } from "../../lib/api";
import { motion } from "motion/react";
import CollegeDashboardSkeleton from "./CollegeDashboardSkeleton";
import { CollegeAnalytics } from "../../components/dashboard/AnalyticsWidgets";

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
      className: "bg-blue-50 border-blue-200",
      iconBg: "bg-blue-100",
      iconColor: "text-blue-600",
    },
    {
      title: "Total Students",
      value: stats.totalStudents,
      description: `${stats.verifiedStudents} verified`,
      icon: GraduationCap,
      link: "/college/students",
      className: "bg-emerald-50 border-emerald-200",
      iconBg: "bg-emerald-100",
      iconColor: "text-emerald-600",
    },
    {
      title: "Job Postings",
      value: stats.totalJobs,
      description: "Active opportunities",
      icon: Briefcase,
      link: "/jobs",
      className: "bg-violet-50 border-violet-200",
      iconBg: "bg-violet-100",
      iconColor: "text-violet-600",
    },
  ];

  if (loading) {
    return <CollegeDashboardSkeleton />;
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="container mx-auto py-8 space-y-8">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-[#1565C0]">
            College Dashboard
          </h1>
          <p className="text-[#333333] mt-2">
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
          <div className="rounded-2xl border border-[#1E88E5]/30 bg-white p-4 shadow-sm">
            <CollegeAnalytics />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card className="bg-white border-[#1E88E5]/30">
            <CardHeader>
              <CardTitle className="text-[#1565C0]">Quick Actions</CardTitle>
              <CardDescription className="text-[#333333]/80">
                Common management tasks for your institution.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <QuickActionButton
                icon={Users}
                title="Manage Alumni"
                link="/college/alumni"
                className="border-blue-200 text-blue-700 hover:bg-blue-50"
                iconColor="text-blue-600"
              />
              <QuickActionButton
                icon={GraduationCap}
                title="Manage Students"
                link="/college/students"
                className="border-emerald-200 text-emerald-700 hover:bg-emerald-50"
                iconColor="text-emerald-600"
              />
              <QuickActionButton
                icon={Plus}
                title="Post a Job"
                link="/college/jobs/create"
                className="border-violet-200 text-violet-700 hover:bg-violet-50"
                iconColor="text-violet-600"
              />
              <QuickActionButton
                icon={Upload}
                title="Bulk Import"
                link="/college/bulk-import"
                className="border-amber-200 text-amber-700 hover:bg-amber-50"
                iconColor="text-amber-600"
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

type StatCardProps = {
  title: string;
  value: number;
  description: string;
  icon: LucideIcon;
  link: string;
  className?: string;
  iconBg?: string;
  iconColor?: string;
};

type QuickActionButtonProps = {
  icon: LucideIcon;
  title: string;
  link: string;
  className?: string;
  iconColor?: string;
};

const StatCard = ({
  title,
  value,
  description,
  icon: Icon,
  link,
  className,
  iconBg,
  iconColor,
}: StatCardProps) => (
  <Link to={link}>
    <Card className={`p-6 flex items-start gap-4 transition-all duration-300 hover:shadow-lg hover:scale-[1.02] ${className}`}>
      <div className={`p-3 rounded-lg ${iconBg}`}>
        <Icon className={`w-6 h-6 ${iconColor}`} />
      </div>
      <div>
        <p className="text-sm text-[#333333]/80">{title}</p>
        <p className="text-3xl font-bold text-[#1565C0]">{value}</p>
        <p className="text-xs text-[#333333]/60">{description}</p>
      </div>
    </Card>
  </Link>
);

const QuickActionButton = ({
  icon: Icon,
  title,
  link,
  className,
  iconColor = "text-[#1E88E5]",
}: QuickActionButtonProps) => (
  <Button
    asChild
    variant="outline"
    className={`h-auto flex-col items-start p-4 justify-start transition-colors ${className || "hover:bg-[#E3F2FD] border-[#1E88E5]/30 text-[#1565C0]"}`}
  >
    <Link to={link}>
      <Icon className={`w-6 h-6 mb-2 ${iconColor}`} />
      <span className="font-semibold">{title}</span>
    </Link>
  </Button>
);

export default CollegeDashboardPage;
