import { useState, type ElementType } from "react";
import { motion } from "motion/react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import {
  Code,
  Database,
  Shield,
  Briefcase,
  ArrowLeft,
  TrendingUp,
  DollarSign,
  Building,
  GraduationCap,
  Users,
  ChevronRight,
  ChevronDown,
  BookOpen,
  Brain,
  Cpu,
  Cloud,
  Clock,
} from "lucide-react";
import { domains, type Domain, type Role, type RoadmapStep } from "../lib/domainData";
import { Link } from "react-router-dom";

const iconMap: Record<string, ElementType> = {
  Code: Code,
  Database: Database,
  Shield: Shield,
  Briefcase: Briefcase,
  Brain: Brain,
  Cpu: Cpu,
  Cloud: Cloud,
};

const colorThemes = [
  {
    main: "blue",
    cardBorder: "border-blue-200",
    hoverBorder: "hover:border-blue-400",
    iconBg: "bg-blue-100",
    iconColor: "text-blue-600",
    hoverBg: "hover:bg-blue-50",
    titleColor: "text-blue-900",
    roleBorder: "border-l-blue-500",
    badge: "bg-blue-100 text-blue-700 hover:bg-blue-200",
    accent: "text-blue-600",
    subtleBg: "bg-blue-50",
    button: "bg-blue-600 hover:bg-blue-700",
    ring: "ring-blue-500/20",
  },
  {
    main: "emerald",
    cardBorder: "border-emerald-200",
    hoverBorder: "hover:border-emerald-400",
    iconBg: "bg-emerald-100",
    iconColor: "text-emerald-600",
    hoverBg: "hover:bg-emerald-50",
    titleColor: "text-emerald-900",
    roleBorder: "border-l-emerald-500",
    badge: "bg-emerald-100 text-emerald-700 hover:bg-emerald-200",
    accent: "text-emerald-600",
    subtleBg: "bg-emerald-50",
    button: "bg-emerald-600 hover:bg-emerald-700",
    ring: "ring-emerald-500/20",
  },
  {
    main: "violet",
    cardBorder: "border-violet-200",
    hoverBorder: "hover:border-violet-400",
    iconBg: "bg-violet-100",
    iconColor: "text-violet-600",
    hoverBg: "hover:bg-violet-50",
    titleColor: "text-violet-900",
    roleBorder: "border-l-violet-500",
    badge: "bg-violet-100 text-violet-700 hover:bg-violet-200",
    accent: "text-violet-600",
    subtleBg: "bg-violet-50",
    button: "bg-violet-600 hover:bg-violet-700",
    ring: "ring-violet-500/20",
  },
  {
    main: "amber",
    cardBorder: "border-amber-200",
    hoverBorder: "hover:border-amber-400",
    iconBg: "bg-amber-100",
    iconColor: "text-amber-600",
    hoverBg: "hover:bg-amber-50",
    titleColor: "text-amber-900",
    roleBorder: "border-l-amber-500",
    badge: "bg-amber-100 text-amber-700 hover:bg-amber-200",
    accent: "text-amber-600",
    subtleBg: "bg-amber-50",
    button: "bg-amber-600 hover:bg-amber-700",
    ring: "ring-amber-500/20",
  },
  {
    main: "rose",
    cardBorder: "border-rose-200",
    hoverBorder: "hover:border-rose-400",
    iconBg: "bg-rose-100",
    iconColor: "text-rose-600",
    hoverBg: "hover:bg-rose-50",
    titleColor: "text-rose-900",
    roleBorder: "border-l-rose-500",
    badge: "bg-rose-100 text-rose-700 hover:bg-rose-200",
    accent: "text-rose-600",
    subtleBg: "bg-rose-50",
    button: "bg-rose-600 hover:bg-rose-700",
    ring: "ring-rose-500/20",
  },
  {
    main: "cyan",
    cardBorder: "border-cyan-200",
    hoverBorder: "hover:border-cyan-400",
    iconBg: "bg-cyan-100",
    iconColor: "text-cyan-600",
    hoverBg: "hover:bg-cyan-50",
    titleColor: "text-cyan-900",
    roleBorder: "border-l-cyan-500",
    badge: "bg-cyan-100 text-cyan-700 hover:bg-cyan-200",
    accent: "text-cyan-600",
    subtleBg: "bg-cyan-50",
    button: "bg-cyan-600 hover:bg-cyan-700",
    ring: "ring-cyan-500/20",
  },
];

const DomainExplorerPage = () => {
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  const toggleRole = (roleId: string) => {
    setExpandedRole(expandedRole === roleId ? null : roleId);
  };

  if (selectedDomain) {
    const domainIndex = domains.findIndex(d => d.id === selectedDomain.id);
    const theme = colorThemes[domainIndex % colorThemes.length];

    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <Button
          variant="ghost"
          className={`mb-6 pl-0 hover:pl-2 transition-all ${theme.accent} hover:bg-transparent`}
          onClick={() => setSelectedDomain(null)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Domains
        </Button>

        <div className="mb-8">
          <h1 className={`text-3xl font-bold tracking-tight mb-2 ${theme.titleColor}`}>
            {selectedDomain.title}
          </h1>
          <p className="text-muted-foreground text-lg">
            {selectedDomain.description}
          </p>
        </div>

        <div className="grid gap-6">
          {selectedDomain.roles.map((role: Role) => (
            <Card key={role.id} className={`overflow-hidden border-l-4 ${theme.roleBorder} bg-white`}>
              <CardHeader
                className={`cursor-pointer ${theme.hoverBg} transition-colors`}
                onClick={() => toggleRole(role.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className={`text-xl flex items-center gap-2 ${theme.titleColor}`}>
                      {role.title}
                      {role.demand === "High" && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 hover:bg-green-100">
                          High Demand
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1 text-[#333333]/70">
                      {role.description}
                    </CardDescription>
                  </div>
                  {expandedRole === role.id ? (
                    <ChevronDown className={`h-5 w-5 ${theme.accent}`} />
                  ) : (
                    <ChevronRight className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
              </CardHeader>
              
              {expandedRole === role.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <CardContent className="pt-0 pb-6">
                    <div className="grid md:grid-cols-2 gap-6 mt-4">
                      {/* Left Column */}
                      <div className="space-y-6">
                        {/* Salary */}
                        <div className={`${theme.subtleBg} p-4 rounded-lg`}>
                          <h3 className={`font-semibold flex items-center gap-2 mb-3 ${theme.titleColor}`}>
                            <DollarSign className={`h-4 w-4 ${theme.accent}`} />
                            Salary Insights
                          </h3>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-white p-2 rounded border">
                              <div className="text-xs text-muted-foreground">Min</div>
                              <div className="font-medium">{role.salary.min}</div>
                            </div>
                            <div className={`bg-white p-2 rounded border ${theme.cardBorder} ring-1 ${theme.ring}`}>
                              <div className={`text-xs ${theme.accent} font-medium`}>Average</div>
                              <div className={`font-bold ${theme.accent}`}>{role.salary.avg}</div>
                            </div>
                            <div className="bg-white p-2 rounded border">
                              <div className="text-xs text-muted-foreground">Max</div>
                              <div className="font-medium">{role.salary.max}</div>
                            </div>
                          </div>
                        </div>

                        {/* Roadmap */}
                        <div>
                          <h3 className={`font-semibold flex items-center gap-2 mb-3 ${theme.titleColor}`}>
                            <BookOpen className={`h-4 w-4 ${theme.accent}`} />
                            Learning Roadmap
                          </h3>
                          <div className="relative pl-4 border-l-2 border-muted space-y-6 ml-2">
                            {role.roadmap.map((step: RoadmapStep, index: number) => (
                              <div key={index} className="relative">
                                <div className={`absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 ${theme.cardBorder} ${theme.iconBg}`} />
                                <div className="space-y-1">
                                  <h4 className="text-sm font-semibold leading-none">{step.step}</h4>
                                  <p className="text-sm text-muted-foreground">{step.description}</p>
                                  <div className={`flex items-center text-xs ${theme.accent} font-medium mt-1`}>
                                    <Clock className="mr-1 h-3 w-3" />
                                    {step.duration}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Demand */}
                        <div>
                          <h3 className={`font-semibold flex items-center gap-2 mb-2 ${theme.titleColor}`}>
                            <TrendingUp className={`h-4 w-4 ${theme.accent}`} />
                            Market Demand
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            Current market demand is <strong>{role.demand}</strong>. 
                            {role.demand === "High" 
                              ? " Companies are actively looking for professionals in this field."
                              : " Steady demand with specific skill requirements."}
                          </p>
                        </div>
                      </div>

                      {/* Right Column */}
                      <div className="space-y-6">
                        {/* Companies */}
                        <div>
                          <h3 className={`font-semibold flex items-center gap-2 mb-3 ${theme.titleColor}`}>
                            <Building className={`h-4 w-4 ${theme.accent}`} />
                            Top Hiring Companies
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {role.companies.map((company: string, i: number) => (
                              <Badge key={i} variant="outline" className="bg-white">
                                {company}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Internships */}
                        <div>
                          <h3 className={`font-semibold flex items-center gap-2 mb-3 ${theme.titleColor}`}>
                            <GraduationCap className={`h-4 w-4 ${theme.accent}`} />
                            Upcoming Internships
                          </h3>
                          <ul className="space-y-2">
                            {role.internships.map((internship: string, i: number) => (
                              <li key={i} className="text-sm flex items-center gap-2">
                                <div className={`h-1.5 w-1.5 rounded-full ${theme.accent.replace('text-', 'bg-')}`} />
                                {internship}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Alumni Connection */}
                        <div className={`${theme.subtleBg} p-4 rounded-lg border ${theme.cardBorder}`}>
                          <h3 className={`font-semibold flex items-center gap-2 mb-2 ${theme.titleColor}`}>
                            <Users className={`h-4 w-4 ${theme.accent}`} />
                            Alumni Network
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Connect with <strong>{role.alumniCount}+ alumni</strong> working in this role to get guidance and mentorship.
                          </p>
                          <Button size="sm" className={`w-full ${theme.button} text-white`} asChild>
                            <Link to={`/student/alumni?domain=${selectedDomain.id}&role=${role.id}`}>
                              Find Members
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-4 max-w-7xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Domain Explorer
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Discover your career path. Explore different domains, understand roles, 
          and connect with alumni who have walked the path.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {domains.map((domain: Domain, index: number) => {
          const Icon = iconMap[domain.icon] || Briefcase;
          const theme = colorThemes[index % colorThemes.length];
          
          return (
            <Card 
              key={domain.id} 
              className={`group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 ${theme.cardBorder} ${theme.hoverBorder} bg-white`}
              onClick={() => setSelectedDomain(domain)}
            >
              <CardHeader>
                <div className={`h-12 w-12 rounded-lg ${theme.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`h-6 w-6 ${theme.iconColor}`} />
                </div>
                <CardTitle className={`text-2xl ${theme.titleColor}`}>{domain.title}</CardTitle>
                <CardDescription className="text-base mt-2 text-[#333333]/70">
                  {domain.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <span className={`font-medium ${theme.accent} mr-1`}>{domain.roles.length}</span> Roles Available
                  <ChevronRight className={`h-4 w-4 ml-auto ${theme.accent} group-hover:translate-x-1 transition-transform`} />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default DomainExplorerPage;
