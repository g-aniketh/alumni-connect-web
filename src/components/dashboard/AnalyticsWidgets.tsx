import type React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
type ChartPaletteKey = "student" | "college" | "alumni";

const palettes: Record<ChartPaletteKey, string[]> = {
  student: ["#93C5FD", "#6EE7B7", "#C4B5FD", "#FCD34D", "#F9A8D4"],
  college: ["#3B82F6", "#10B981", "#8B5CF6", "#F59E0B", "#EC4899"],
  alumni: ["#1565C0", "#1E88E5", "#42A5F5", "#90CAF9", "#BBDEFB"],
};

type ChartTooltipPayload = {
  name?: string | number;
  color?: string;
  value?: number | string;
};

type ChartTooltipProps = {
  active?: boolean;
  payload?: ChartTooltipPayload[];
  label?: string;
};

const ChartTooltip = ({ active, payload, label }: ChartTooltipProps) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-lg border bg-white/90 px-3 py-2 shadow-sm backdrop-blur-sm">
      {label && (
        <p className="text-xs font-semibold text-muted-foreground">{label}</p>
      )}
      <div className="space-y-1">
        {payload.map((item: ChartTooltipPayload) => (
          <p key={item.name} className="text-sm flex items-center gap-2">
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ background: item.color }}
            />
            <span className="font-medium">{item.name}</span>
            <span className="text-muted-foreground">• {item.value}</span>
          </p>
        ))}
      </div>
    </div>
  );
};

type ChartCardProps = {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
};

const ChartCard = ({
  title,
  description,
  children,
  className = "",
}: ChartCardProps) => (
  <Card className={`bg-white border-[#1E88E5]/30 shadow-sm ${className}`}>
    <CardHeader className="space-y-1">
      <CardTitle className="text-lg font-semibold text-[#1565C0]">
        {title}
      </CardTitle>
      {description && (
        <CardDescription className="text-sm text-[#333333]/80">
          {description}
        </CardDescription>
      )}
    </CardHeader>
    <CardContent className="h-[260px]">{children}</CardContent>
  </Card>
);

type SkillProgressPoint = {
  month: string;
  skills: number;
  certifications: number;
};

type ApplicationStage = { stage: string; count: number };
type EventSlice = { name: string; value: number };
type MentorshipImpactPoint = {
  month: string;
  confidence: number;
  network: number;
};

type PlacementTrendPoint = { year: string; placements: number; offers: number };
type DepartmentOutcome = { dept: string; employed: number };
type GeoSlice = { name: string; value: number };
type VerificationHealth = { label: string; verified: number; pending: number };

type MentorshipHealthPoint = {
  month: string;
  active: number;
  new: number;
  completed: number;
};
type JobImpactSlice = { label: string; value: number };
type EngagementBar = { channel: string; score: number };
type GivingBackPoint = {
  quarter: string;
  donations: number;
  volunteerHours: number;
};

export const StudentAnalytics = () => {
  const palette = palettes.student;
  const skillProgress: SkillProgressPoint[] = [
    { month: "Jan", skills: 1, certifications: 0 },
    { month: "Feb", skills: 3, certifications: 1 },
    { month: "Mar", skills: 5, certifications: 2 },
    { month: "Apr", skills: 8, certifications: 3 },
    { month: "May", skills: 11, certifications: 4 },
    { month: "Jun", skills: 15, certifications: 6 },
  ];

  const applicationStages: ApplicationStage[] = [
    { stage: "Applied", count: 24 },
    { stage: "Under Review", count: 16 },
    { stage: "Interview", count: 9 },
    { stage: "Offer", count: 4 },
  ];

  const eventEngagement: EventSlice[] = [
    { name: "Workshops", value: 38 },
    { name: "Hackathons", value: 24 },
    { name: "Alumni Talks", value: 29 },
    { name: "Hiring Drives", value: 17 },
  ];

  const mentorshipImpact: MentorshipImpactPoint[] = [
    { month: "Jan", confidence: 52, network: 10 },
    { month: "Feb", confidence: 59, network: 14 },
    { month: "Mar", confidence: 66, network: 18 },
    { month: "Apr", confidence: 72, network: 23 },
    { month: "May", confidence: 77, network: 28 },
    { month: "Jun", confidence: 82, network: 33 },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <ChartCard
        title="Skill Growth"
        description="New skills and certifications added over time."
        className="md:col-span-2 xl:col-span-2"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={skillProgress}>
            <defs>
              <linearGradient id="skills" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor={palette[0]} stopOpacity={0.4} />
                <stop offset="95%" stopColor={palette[0]} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="skills"
              stroke={palette[0]}
              fill="url(#skills)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="certifications"
              stroke={palette[2]}
              fill={palette[2]}
              fillOpacity={0.08}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Application Pipeline"
        description="Snapshot of current application journey."
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={applicationStages}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="stage" tickLine={false} axisLine={false} />
            <YAxis allowDecimals={false} tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="count" radius={[8, 8, 4, 4]}>
              {applicationStages.map((_, idx) => (
                <Cell key={idx} fill={palette[idx % palette.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Event Participation"
        description="Engagement across event types."
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<ChartTooltip />} />
            <Legend />
            <Pie
              data={eventEngagement}
              dataKey="value"
              nameKey="name"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={6}
            >
              {eventEngagement.map((_, idx) => (
                <Cell key={idx} fill={palette[idx % palette.length]} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Mentorship Impact"
        description="Confidence and network growth after mentorship."
        className="md:col-span-2 xl:col-span-1"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={mentorshipImpact}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="confidence"
              stroke={palette[1]}
              strokeWidth={2.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="network"
              stroke={palette[3]}
              strokeWidth={2.5}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export const CollegeAnalytics = () => {
  const palette = palettes.college;
  const lightPalette = ["#93C5FD", "#6EE7B7", "#C4B5FD", "#FCD34D", "#F9A8D4"];
  const placementTrend: PlacementTrendPoint[] = [
    { year: "2020", placements: 64, offers: 78 },
    { year: "2021", placements: 69, offers: 89 },
    { year: "2022", placements: 76, offers: 98 },
    { year: "2023", placements: 83, offers: 115 },
    { year: "2024", placements: 89, offers: 132 },
  ];

  const departmentOutcomes: DepartmentOutcome[] = [
    { dept: "CSE", employed: 93 },
    { dept: "ECE", employed: 79 },
    { dept: "ME", employed: 66 },
    { dept: "CE", employed: 59 },
    { dept: "MBA", employed: 85 },
  ];

  const alumniGeo: GeoSlice[] = [
    { name: "India", value: 52 },
    { name: "North America", value: 18 },
    { name: "Europe", value: 12 },
    { name: "APAC", value: 11 },
    { name: "Middle East", value: 7 },
  ];

  const verificationHealth: VerificationHealth[] = [
    { label: "Students", verified: 78, pending: 22 },
    { label: "Alumni", verified: 84, pending: 16 },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <ChartCard
        title="Placement Momentum"
        description="Offers vs accepted placements."
        className="md:col-span-2 xl:col-span-2"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={placementTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="year" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="offers"
              stroke={palette[0]}
              strokeWidth={2.5}
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="placements"
              stroke={palette[4]}
              strokeWidth={2.5}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Department Outcomes"
        description="Employment rate by department."
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={departmentOutcomes}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="dept" tickLine={false} axisLine={false} />
            <YAxis
              tickFormatter={(v) => `${v}%`}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="employed" radius={[10, 10, 6, 6]}>
              {departmentOutcomes.map((_, idx) => (
                <Cell
                  key={idx}
                  fill={lightPalette[idx % lightPalette.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Alumni Footprint"
        description="Where alumni are located globally."
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<ChartTooltip />} />
            <Legend />
            <Pie
              data={alumniGeo}
              dataKey="value"
              nameKey="name"
              innerRadius={52}
              outerRadius={82}
              paddingAngle={5}
              label
            >
              {alumniGeo.map((_, idx) => (
                <Cell
                  key={idx}
                  fill={lightPalette[idx % lightPalette.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Verification Health"
        description="Verified vs pending profiles."
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={verificationHealth} stackOffset="sign">
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis
              tickFormatter={(v) => `${v}%`}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Legend />
            <Bar
              dataKey="verified"
              stackId="a"
              fill={lightPalette[1]}
              radius={[10, 10, 0, 0]}
            />
            <Bar
              dataKey="pending"
              stackId="a"
              fill={lightPalette[3]}
              radius={[0, 0, 10, 10]}
            />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};

export const AlumniAnalytics = () => {
  const palette = palettes.alumni;
  const mentorshipHealth: MentorshipHealthPoint[] = [
    { month: "Jan", active: 14, new: 6, completed: 2 },
    { month: "Feb", active: 15, new: 7, completed: 3 },
    { month: "Mar", active: 17, new: 8, completed: 4 },
    { month: "Apr", active: 18, new: 9, completed: 5 },
    { month: "May", active: 20, new: 10, completed: 6 },
    { month: "Jun", active: 23, new: 12, completed: 8 },
  ];

  const jobImpact: JobImpactSlice[] = [
    { label: "Interviews", value: 44 },
    { label: "Shortlisted", value: 27 },
    { label: "Offers", value: 13 },
  ];

  const jobOutcomesColors = ["#93C5FD", "#6EE7B7", "#FCD34D"]; // Light Blue, Light Green, Light Amber

  const engagement: EngagementBar[] = [
    { channel: "Mentorship", score: 89 },
    { channel: "Events", score: 74 },
    { channel: "Jobs", score: 82 },
    { channel: "Donations", score: 67 },
  ];

  const engagementColors = ["#C4B5FD", "#F9A8D4", "#67E8F9", "#FDBA74"]; // Light Purple, Light Pink, Light Cyan, Light Orange

  const givingBack: GivingBackPoint[] = [
    { quarter: "Q1", donations: 48, volunteerHours: 62 },
    { quarter: "Q2", donations: 55, volunteerHours: 69 },
    { quarter: "Q3", donations: 53, volunteerHours: 73 },
    { quarter: "Q4", donations: 61, volunteerHours: 80 },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <ChartCard
        title="Mentorship Pipeline"
        description="Active, new, and completed mentorships."
        className="md:col-span-2 xl:col-span-2"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={mentorshipHealth}>
            <defs>
              <linearGradient id="mentorship" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor={palette[0]} stopOpacity={0.35} />
                <stop offset="95%" stopColor={palette[0]} stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="month" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Legend />
            <Area
              type="monotone"
              dataKey="active"
              stroke={palette[0]}
              fill="url(#mentorship)"
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="new"
              stroke={palette[3]}
              fill={palette[3]}
              fillOpacity={0.08}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="completed"
              stroke={palette[4]}
              fill={palette[4]}
              fillOpacity={0.08}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Job Outcomes"
        description="Impact of your posted roles."
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip content={<ChartTooltip />} />
            <Legend />
            <Pie
              data={jobImpact}
              dataKey="value"
              nameKey="label"
              innerRadius={55}
              outerRadius={85}
              paddingAngle={6}
            >
              {jobImpact.map((_, idx) => (
                <Cell
                  key={idx}
                  fill={jobOutcomesColors[idx % jobOutcomesColors.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Engagement Score"
        description="How the community interacts with you."
      >
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={engagement}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="channel" tickLine={false} axisLine={false} />
            <YAxis
              tickFormatter={(v) => `${v}%`}
              tickLine={false}
              axisLine={false}
            />
            <Tooltip content={<ChartTooltip />} />
            <Bar dataKey="score" radius={[10, 10, 6, 6]}>
              {engagement.map((_, idx) => (
                <Cell
                  key={idx}
                  fill={engagementColors[idx % engagementColors.length]}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard
        title="Giving Back"
        description="Donations and volunteer hours per quarter."
        className="md:col-span-2 xl:col-span-1"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={givingBack}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
            <XAxis dataKey="quarter" tickLine={false} axisLine={false} />
            <YAxis tickLine={false} axisLine={false} />
            <Tooltip content={<ChartTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="donations"
              stroke={palette[2]}
              strokeWidth={2.5}
              dot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="volunteerHours"
              stroke={palette[1]}
              strokeWidth={2.5}
              dot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
};
