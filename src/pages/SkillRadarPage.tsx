import { useState, useMemo } from "react";
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { Badge } from "../components/ui/badge";
import { Button } from "../components/ui/button";
import { CheckCircle2, TrendingUp, ArrowRight } from "lucide-react";
import {
  skillData,
  type RoleSkillData,
  type SkillMetric,
} from "@/lib/skillData";
import { Link } from "react-router-dom";

const colorThemes = [
  {
    main: "blue",
    hex: "#2563eb",
    cardBorder: "border-blue-200",
    hoverBorder: "hover:border-blue-400",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    hoverBg: "hover:bg-blue-50",
    titleColor: "text-blue-900",
    roleBorder: "border-l-blue-500",
    badge: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    accent: "text-blue-600",
    bgAccent: "bg-blue-600",
    subtleBg: "bg-blue-50",
    button: "bg-blue-600 hover:bg-blue-700",
    ring: "ring-blue-500/20",
  },
  {
    main: "emerald",
    hex: "#059669",
    cardBorder: "border-emerald-200",
    hoverBorder: "hover:border-emerald-400",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    hoverBg: "hover:bg-emerald-50",
    titleColor: "text-emerald-900",
    roleBorder: "border-l-emerald-500",
    badge: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
    accent: "text-emerald-600",
    bgAccent: "bg-emerald-600",
    subtleBg: "bg-emerald-50",
    button: "bg-emerald-600 hover:bg-emerald-700",
    ring: "ring-emerald-500/20",
  },
  {
    main: "violet",
    hex: "#7c3aed",
    cardBorder: "border-violet-200",
    hoverBorder: "hover:border-violet-400",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    hoverBg: "hover:bg-violet-50",
    titleColor: "text-violet-900",
    roleBorder: "border-l-violet-500",
    badge: "bg-violet-100 text-violet-700 hover:bg-violet-200",
    accent: "text-violet-600",
    bgAccent: "bg-violet-600",
    subtleBg: "bg-violet-50",
    button: "bg-violet-600 hover:bg-violet-700",
    ring: "ring-violet-500/20",
  },
  {
    main: "amber",
    hex: "#d97706",
    cardBorder: "border-amber-200",
    hoverBorder: "hover:border-amber-400",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    hoverBg: "hover:bg-amber-50",
    titleColor: "text-amber-900",
    roleBorder: "border-l-amber-500",
    badge: "bg-amber-100 text-amber-700 hover:bg-amber-200",
    accent: "text-amber-600",
    bgAccent: "bg-amber-600",
    subtleBg: "bg-amber-50",
    button: "bg-amber-600 hover:bg-amber-700",
    ring: "ring-amber-500/20",
  },
  {
    main: "rose",
    hex: "#e11d48",
    cardBorder: "border-rose-200",
    hoverBorder: "hover:border-rose-400",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    hoverBg: "hover:bg-rose-50",
    titleColor: "text-rose-900",
    roleBorder: "border-l-rose-500",
    badge: "bg-rose-100 text-rose-700 hover:bg-rose-200",
    accent: "text-rose-600",
    bgAccent: "bg-rose-600",
    subtleBg: "bg-rose-50",
    button: "bg-rose-600 hover:bg-rose-700",
    ring: "ring-rose-500/20",
  },
  {
    main: "cyan",
    hex: "#0891b2",
    cardBorder: "border-cyan-200",
    hoverBorder: "hover:border-cyan-400",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
    hoverBg: "hover:bg-cyan-50",
    titleColor: "text-cyan-900",
    roleBorder: "border-l-cyan-500",
    badge: "bg-cyan-100 text-cyan-700 hover:bg-cyan-200",
    accent: "text-cyan-600",
    bgAccent: "bg-cyan-600",
    subtleBg: "bg-cyan-50",
    button: "bg-cyan-600 hover:bg-cyan-700",
    ring: "ring-cyan-500/20",
  },
];

const SkillRadarPage = () => {
  const [selectedRole, setSelectedRole] = useState<string>(skillData[0].roleId);

  const currentData = useMemo(() => {
    return (
      skillData.find((d: RoleSkillData) => d.roleId === selectedRole) ||
      skillData[0]
    );
  }, [selectedRole]);

  const theme = useMemo(() => {
    const index = skillData.findIndex((d) => d.roleId === selectedRole);
    return colorThemes[index % colorThemes.length];
  }, [selectedRole]);

  // Calculate gaps
  const gaps = currentData.skills
    .map((skill: SkillMetric) => ({
      ...skill,
      gap: skill.industryAverage - skill.studentScore,
    }))
    .sort((a: { gap: number }, b: { gap: number }) => b.gap - a.gap);

  const laggingSkills = gaps.filter((s: { gap: number }) => s.gap > 15);
  const strongSkills = gaps.filter((s: { gap: number }) => s.gap <= 5);

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Skill Radar Analysis
        </h1>
        <p className="text-muted-foreground text-lg">
          Compare your skills with industry standards to identify gaps and
          growth opportunities.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left Column: Controls & Chart */}
        <div className="lg:col-span-2 space-y-6">
          <Card className={`border-2 ${theme.cardBorder}`}>
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <CardTitle className={theme.titleColor}>
                    Skill Comparison
                  </CardTitle>
                  <CardDescription>
                    You vs. Industry Average for {currentData.roleName}
                  </CardDescription>
                </div>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger
                    className={`w-[200px] ${theme.cardBorder} ${theme.ring}`}
                  >
                    <SelectValue placeholder="Select Role" />
                  </SelectTrigger>
                  <SelectContent>
                    {skillData.map((role: RoleSkillData) => (
                      <SelectItem key={role.roleId} value={role.roleId}>
                        {role.roleName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-[400px] w-full flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart
                    cx="50%"
                    cy="50%"
                    outerRadius="80%"
                    data={currentData.skills}
                  >
                    <PolarGrid stroke="#e5e7eb" />
                    <PolarAngleAxis
                      dataKey="subject"
                      tick={{ fill: "#6b7280", fontSize: 12 }}
                    />
                    <PolarRadiusAxis
                      angle={30}
                      domain={[0, 100]}
                      tick={false}
                      axisLine={false}
                    />
                    <Radar
                      name="My Skills"
                      dataKey="studentScore"
                      stroke={theme.hex}
                      fill={theme.hex}
                      fillOpacity={0.3}
                    />
                    <Radar
                      name="Industry Avg"
                      dataKey="industryAverage"
                      stroke="#9ca3af"
                      fill="#9ca3af"
                      fillOpacity={0.1}
                    />
                    <Legend />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "none",
                        boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                      }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Breakdown */}
          <Card className={`border-2 ${theme.cardBorder}`}>
            <CardHeader>
              <CardTitle className={theme.titleColor}>
                Detailed Breakdown
              </CardTitle>
              <CardDescription>Skill-by-skill comparison</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentData.skills.map((skill: SkillMetric) => (
                <div key={skill.subject} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className={`font-medium ${theme.titleColor}`}>
                      {skill.subject}
                    </span>
                    <span className="text-muted-foreground">
                      {skill.studentScore} / {skill.industryAverage} (Target)
                    </span>
                  </div>
                  <div className="relative h-2 w-full bg-secondary rounded-full overflow-hidden">
                    {/* Industry Marker */}
                    <div
                      className="absolute top-0 bottom-0 w-1 bg-gray-400 z-10"
                      style={{ left: `${skill.industryAverage}%` }}
                    />
                    {/* Student Progress */}
                    <div
                      className={`h-full ${theme.bgAccent} transition-all duration-500`}
                      style={{ width: `${skill.studentScore}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Insights & Actions */}
        <div className="space-y-6">
          {/* Strong Skills */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle2 className="h-5 w-5" />
                Your Strengths
              </CardTitle>
              <CardDescription>
                Skills where you meet or exceed industry standards.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {strongSkills.length > 0 ? (
                  strongSkills.map((skill: SkillMetric & { gap: number }) => (
                    <Badge
                      key={skill.subject}
                      className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200"
                    >
                      {skill.subject}
                    </Badge>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Keep learning to build your strengths!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className={`border-2 ${theme.cardBorder}`}>
            <CardHeader>
              <CardTitle
                className={`flex items-center gap-2 ${theme.titleColor}`}
              >
                <TrendingUp className={`h-5 w-5 ${theme.accent}`} />
                Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Based on your skill gaps in{" "}
                <strong>{currentData.roleName}</strong>, we recommend:
              </p>
              <ul className="space-y-3">
                <li className="flex items-start gap-2 text-sm">
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${theme.bgAccent} mt-1.5`}
                  />
                  <span>
                    Focus on{" "}
                    <strong>
                      {laggingSkills[0]?.subject || "core skills"}
                    </strong>{" "}
                    projects to build practical experience.
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${theme.bgAccent} mt-1.5`}
                  />
                  <span>
                    Connect with alumni mentors specializing in{" "}
                    {currentData.roleName}.
                  </span>
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <div
                    className={`h-1.5 w-1.5 rounded-full ${theme.bgAccent} mt-1.5`}
                  />
                  <span>
                    Check out the Domain Explorer for a detailed roadmap.
                  </span>
                </li>
              </ul>
              <Button
                className={`w-full mt-2 ${theme.button} text-white`}
                asChild
              >
                <Link to="/domain-explorer">
                  Go to Domain Explorer <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default SkillRadarPage;
