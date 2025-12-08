
export interface SkillMetric {
  subject: string;
  studentScore: number;
  industryAverage: number;
  fullMark: number;
}

export interface RoleSkillData {
  roleId: string;
  roleName: string;
  skills: SkillMetric[];
}

export const skillData: RoleSkillData[] = [
  {
    roleId: "frontend-dev",
    roleName: "Frontend Developer",
    skills: [
      { subject: "React", studentScore: 70, industryAverage: 90, fullMark: 100 },
      { subject: "TypeScript", studentScore: 60, industryAverage: 85, fullMark: 100 },
      { subject: "CSS/Tailwind", studentScore: 80, industryAverage: 85, fullMark: 100 },
      { subject: "State Mgmt", studentScore: 50, industryAverage: 80, fullMark: 100 },
      { subject: "Testing", studentScore: 40, industryAverage: 75, fullMark: 100 },
      { subject: "Performance", studentScore: 45, industryAverage: 80, fullMark: 100 },
    ],
  },
  {
    roleId: "backend-dev",
    roleName: "Backend Developer",
    skills: [
      { subject: "Node.js", studentScore: 75, industryAverage: 90, fullMark: 100 },
      { subject: "Databases", studentScore: 65, industryAverage: 85, fullMark: 100 },
      { subject: "API Design", studentScore: 70, industryAverage: 90, fullMark: 100 },
      { subject: "System Design", studentScore: 40, industryAverage: 80, fullMark: 100 },
      { subject: "Security", studentScore: 50, industryAverage: 85, fullMark: 100 },
      { subject: "DevOps", studentScore: 30, industryAverage: 75, fullMark: 100 },
    ],
  },
  {
    roleId: "fullstack-dev",
    roleName: "Full Stack Developer",
    skills: [
      { subject: "Frontend (React)", studentScore: 65, industryAverage: 85, fullMark: 100 },
      { subject: "Backend (Node)", studentScore: 60, industryAverage: 85, fullMark: 100 },
      { subject: "Database", studentScore: 70, industryAverage: 80, fullMark: 100 },
      { subject: "DevOps/Cloud", studentScore: 40, industryAverage: 75, fullMark: 100 },
      { subject: "System Design", studentScore: 45, industryAverage: 80, fullMark: 100 },
      { subject: "Testing", studentScore: 50, industryAverage: 75, fullMark: 100 },
    ],
  },
  {
    roleId: "data-scientist",
    roleName: "Data Scientist",
    skills: [
      { subject: "Python", studentScore: 85, industryAverage: 95, fullMark: 100 },
      { subject: "Statistics", studentScore: 60, industryAverage: 90, fullMark: 100 },
      { subject: "Machine Learning", studentScore: 55, industryAverage: 85, fullMark: 100 },
      { subject: "Data Viz", studentScore: 70, industryAverage: 80, fullMark: 100 },
      { subject: "SQL", studentScore: 75, industryAverage: 90, fullMark: 100 },
      { subject: "Big Data", studentScore: 40, industryAverage: 75, fullMark: 100 },
    ],
  },
  {
    roleId: "ml-engineer",
    roleName: "Machine Learning Engineer",
    skills: [
      { subject: "Python/C++", studentScore: 80, industryAverage: 95, fullMark: 100 },
      { subject: "Deep Learning", studentScore: 50, industryAverage: 90, fullMark: 100 },
      { subject: "MLOps", studentScore: 30, industryAverage: 85, fullMark: 100 },
      { subject: "Model Optimization", studentScore: 40, industryAverage: 80, fullMark: 100 },
      { subject: "Mathematics", studentScore: 70, industryAverage: 90, fullMark: 100 },
      { subject: "Cloud ML", studentScore: 35, industryAverage: 80, fullMark: 100 },
    ],
  },
  {
    roleId: "ai-researcher",
    roleName: "AI Research Scientist",
    skills: [
      { subject: "Advanced Math", studentScore: 75, industryAverage: 95, fullMark: 100 },
      { subject: "Algorithm Design", studentScore: 60, industryAverage: 95, fullMark: 100 },
      { subject: "Research Papers", studentScore: 40, industryAverage: 90, fullMark: 100 },
      { subject: "PyTorch/TensorFlow", studentScore: 65, industryAverage: 90, fullMark: 100 },
      { subject: "NLP/CV", studentScore: 50, industryAverage: 85, fullMark: 100 },
      { subject: "Ethics", studentScore: 55, industryAverage: 80, fullMark: 100 },
    ],
  },
  {
    roleId: "cloud-architect",
    roleName: "Cloud Architect",
    skills: [
      { subject: "AWS/Azure", studentScore: 50, industryAverage: 90, fullMark: 100 },
      { subject: "Networking", studentScore: 60, industryAverage: 85, fullMark: 100 },
      { subject: "Security", studentScore: 55, industryAverage: 90, fullMark: 100 },
      { subject: "IaC (Terraform)", studentScore: 30, industryAverage: 85, fullMark: 100 },
      { subject: "Cost Optimization", studentScore: 40, industryAverage: 80, fullMark: 100 },
      { subject: "Containers", studentScore: 65, industryAverage: 85, fullMark: 100 },
    ],
  },
  {
    roleId: "devops-engineer",
    roleName: "DevOps Engineer",
    skills: [
      { subject: "CI/CD Pipelines", studentScore: 55, industryAverage: 90, fullMark: 100 },
      { subject: "Docker/K8s", studentScore: 60, industryAverage: 90, fullMark: 100 },
      { subject: "Linux/Scripting", studentScore: 70, industryAverage: 85, fullMark: 100 },
      { subject: "Monitoring", studentScore: 40, industryAverage: 80, fullMark: 100 },
      { subject: "Cloud Infra", studentScore: 50, industryAverage: 85, fullMark: 100 },
      { subject: "Security (DevSecOps)", studentScore: 35, industryAverage: 80, fullMark: 100 },
    ],
  },
  {
    roleId: "cyber-security",
    roleName: "Cybersecurity Analyst",
    skills: [
      { subject: "Network Security", studentScore: 60, industryAverage: 90, fullMark: 100 },
      { subject: "Ethical Hacking", studentScore: 50, industryAverage: 85, fullMark: 100 },
      { subject: "Incident Response", studentScore: 40, industryAverage: 85, fullMark: 100 },
      { subject: "Compliance", studentScore: 30, industryAverage: 80, fullMark: 100 },
      { subject: "Cryptography", studentScore: 55, industryAverage: 85, fullMark: 100 },
      { subject: "OS Security", studentScore: 65, industryAverage: 85, fullMark: 100 },
    ],
  },
  {
    roleId: "product-manager",
    roleName: "Product Manager",
    skills: [
      { subject: "Product Strategy", studentScore: 40, industryAverage: 90, fullMark: 100 },
      { subject: "User Research", studentScore: 50, industryAverage: 85, fullMark: 100 },
      { subject: "Agile/Scrum", studentScore: 60, industryAverage: 90, fullMark: 100 },
      { subject: "Data Analytics", studentScore: 55, industryAverage: 80, fullMark: 100 },
      { subject: "Communication", studentScore: 75, industryAverage: 95, fullMark: 100 },
      { subject: "Tech Understanding", studentScore: 65, industryAverage: 80, fullMark: 100 },
    ],
  },
];
