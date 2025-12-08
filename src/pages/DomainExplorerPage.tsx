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

const DomainExplorerPage = () => {
  const [selectedDomain, setSelectedDomain] = useState<Domain | null>(null);
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

  const toggleRole = (roleId: string) => {
    setExpandedRole(expandedRole === roleId ? null : roleId);
  };

  if (selectedDomain) {
    return (
      <div className="container mx-auto py-8 px-4 max-w-7xl">
        <Button
          variant="ghost"
          className="mb-6 pl-0 hover:pl-2 transition-all"
          onClick={() => setSelectedDomain(null)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Domains
        </Button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight mb-2">
            {selectedDomain.title}
          </h1>
          <p className="text-muted-foreground text-lg">
            {selectedDomain.description}
          </p>
        </div>

        <div className="grid gap-6">
          {selectedDomain.roles.map((role: Role) => (
            <Card key={role.id} className="overflow-hidden border-l-4 border-l-primary">
              <CardHeader
                className="cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => toggleRole(role.id)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-xl flex items-center gap-2">
                      {role.title}
                      {role.demand === "High" && (
                        <Badge variant="secondary" className="text-xs bg-green-100 text-green-800 hover:bg-green-100">
                          High Demand
                        </Badge>
                      )}
                    </CardTitle>
                    <CardDescription className="mt-1">
                      {role.description}
                    </CardDescription>
                  </div>
                  {expandedRole === role.id ? (
                    <ChevronDown className="h-5 w-5 text-muted-foreground" />
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
                        <div className="bg-muted/30 p-4 rounded-lg">
                          <h3 className="font-semibold flex items-center gap-2 mb-3">
                            <DollarSign className="h-4 w-4 text-primary" />
                            Salary Insights
                          </h3>
                          <div className="grid grid-cols-3 gap-2 text-center">
                            <div className="bg-background p-2 rounded border">
                              <div className="text-xs text-muted-foreground">Min</div>
                              <div className="font-medium">{role.salary.min}</div>
                            </div>
                            <div className="bg-background p-2 rounded border border-primary/20 ring-1 ring-primary/10">
                              <div className="text-xs text-primary font-medium">Average</div>
                              <div className="font-bold text-primary">{role.salary.avg}</div>
                            </div>
                            <div className="bg-background p-2 rounded border">
                              <div className="text-xs text-muted-foreground">Max</div>
                              <div className="font-medium">{role.salary.max}</div>
                            </div>
                          </div>
                        </div>

                        {/* Roadmap */}
                        <div>
                          <h3 className="font-semibold flex items-center gap-2 mb-3">
                            <BookOpen className="h-4 w-4 text-primary" />
                            Learning Roadmap
                          </h3>
                          <div className="relative pl-4 border-l-2 border-muted space-y-6 ml-2">
                            {role.roadmap.map((step: RoadmapStep, index: number) => (
                              <div key={index} className="relative">
                                <div className="absolute -left-[21px] top-1 h-3 w-3 rounded-full border-2 border-primary bg-background" />
                                <div className="space-y-1">
                                  <h4 className="text-sm font-semibold leading-none">{step.step}</h4>
                                  <p className="text-sm text-muted-foreground">{step.description}</p>
                                  <div className="flex items-center text-xs text-primary font-medium mt-1">
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
                          <h3 className="font-semibold flex items-center gap-2 mb-2">
                            <TrendingUp className="h-4 w-4 text-primary" />
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
                          <h3 className="font-semibold flex items-center gap-2 mb-3">
                            <Building className="h-4 w-4 text-primary" />
                            Top Hiring Companies
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {role.companies.map((company: string, i: number) => (
                              <Badge key={i} variant="outline" className="bg-background">
                                {company}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Internships */}
                        <div>
                          <h3 className="font-semibold flex items-center gap-2 mb-3">
                            <GraduationCap className="h-4 w-4 text-primary" />
                            Upcoming Internships
                          </h3>
                          <ul className="space-y-2">
                            {role.internships.map((internship: string, i: number) => (
                              <li key={i} className="text-sm flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                                {internship}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Alumni Connection */}
                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/10">
                          <h3 className="font-semibold flex items-center gap-2 mb-2">
                            <Users className="h-4 w-4 text-primary" />
                            Alumni Network
                          </h3>
                          <p className="text-sm text-muted-foreground mb-4">
                            Connect with <strong>{role.alumniCount}+ alumni</strong> working in this role to get guidance and mentorship.
                          </p>
                          <Button size="sm" className="w-full" asChild>
                            <Link to="/alumni-directory">
                              Find Mentors
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
        {domains.map((domain: Domain) => {
          const Icon = iconMap[domain.icon] || Briefcase;
          return (
            <Card 
              key={domain.id} 
              className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-2 hover:border-primary/50"
              onClick={() => setSelectedDomain(domain)}
            >
              <CardHeader>
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <Icon className="h-6 w-6" />
                </div>
                <CardTitle className="text-2xl">{domain.title}</CardTitle>
                <CardDescription className="text-base mt-2">
                  {domain.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center text-sm text-muted-foreground mt-2">
                  <span className="font-medium text-primary mr-1">{domain.roles.length}</span> Roles Available
                  <ChevronRight className="h-4 w-4 ml-auto group-hover:translate-x-1 transition-transform" />
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
