
export interface Salary {
  min: string;
  avg: string;
  max: string;
}

export interface RoadmapStep {
  step: string;
  description: string;
  duration: string;
}

export interface Role {
  id: string;
  title: string;
  description: string;
  roadmap: RoadmapStep[];
  salary: Salary;
  demand: "High" | "Medium" | "Low" | "Very High";
  companies: string[];
  internships: string[];
  alumniCount: number;
}

export interface Domain {
  id: string;
  title: string;
  description: string;
  icon: string;
  roles: Role[];
}

export const domains: Domain[] = [
  {
    id: "software-dev",
    title: "Software Development",
    description: "Build and maintain software applications, systems, and networks.",
    icon: "Code",
    roles: [
      {
        id: "frontend-dev",
        title: "Frontend Developer",
        description: "Focus on the user interface and user experience of web applications.",
        roadmap: [
          { step: "Basics", description: "Learn HTML, CSS, JavaScript", duration: "1-2 Months" },
          { step: "Frameworks", description: "Master a framework like React or Vue", duration: "2-3 Months" },
          { step: "State Management", description: "Learn Redux, Context API", duration: "1 Month" },
          { step: "Build Tools", description: "Understand Vite, Webpack, Git", duration: "1 Month" },
        ],
        salary: { min: "$50k", avg: "$85k", max: "$130k" },
        demand: "High",
        companies: ["Google", "Meta", "Amazon", "Startups"],
        internships: ["Frontend Intern at TechCorp", "UI Engineering Intern"],
        alumniCount: 120,
      },
      {
        id: "backend-dev",
        title: "Backend Developer",
        description: "Work on server-side logic, databases, and APIs.",
        roadmap: [
          { step: "Language", description: "Learn Node.js, Python, or Java", duration: "2 Months" },
          { step: "Databases", description: "Understand SQL (Postgres) & NoSQL (MongoDB)", duration: "1-2 Months" },
          { step: "API Design", description: "Learn REST & GraphQL principles", duration: "1 Month" },
          { step: "Deployment", description: "Master Docker, AWS basics, CI/CD", duration: "1-2 Months" },
        ],
        salary: { min: "$60k", avg: "$95k", max: "$140k" },
        demand: "High",
        companies: ["Microsoft", "Netflix", "Uber"],
        internships: ["Backend Intern at DataSystems", "API Developer Intern"],
        alumniCount: 95,
      },
      {
        id: "fullstack-dev",
        title: "Full Stack Developer",
        description: "Handle both frontend and backend development.",
        roadmap: [
          { step: "Frontend", description: "HTML, CSS, JS, React", duration: "3 Months" },
          { step: "Backend", description: "Node.js, Databases, APIs", duration: "3 Months" },
          { step: "DevOps", description: "Deployment, CI/CD, Cloud", duration: "1-2 Months" },
          { step: "Architecture", description: "System Design & Scalability", duration: "1 Month" },
        ],
        salary: { min: "$70k", avg: "$100k", max: "$150k" },
        demand: "High",
        companies: ["Spotify", "Airbnb", "Small-Medium Businesses"],
        internships: ["Full Stack Intern at WebSolutions"],
        alumniCount: 150,
      },
    ],
  },
  {
    id: "artificial-intelligence",
    title: "Artificial Intelligence",
    description: "Create systems that can perform tasks that typically require human intelligence.",
    icon: "Brain",
    roles: [
      {
        id: "ai-research-scientist",
        title: "AI Research Scientist",
        description: "Conduct research to advance the field of AI and discover new algorithms.",
        roadmap: [
          { step: "Mathematics", description: "Linear Algebra, Calculus, Probability", duration: "2-3 Months" },
          { step: "Programming", description: "Python, C++", duration: "1-2 Months" },
          { step: "ML Fundamentals", description: "Supervised/Unsupervised Learning", duration: "2 Months" },
          { step: "Deep Learning", description: "Neural Networks, Backpropagation", duration: "2-3 Months" },
          { step: "Specialization", description: "NLP, Computer Vision, or RL", duration: "3 Months" },
        ],
        salary: { min: "$90k", avg: "$140k", max: "$200k+" },
        demand: "High",
        companies: ["OpenAI", "DeepMind", "Google Research", "Meta AI"],
        internships: ["AI Research Intern", "Deep Learning Intern"],
        alumniCount: 30,
      },
      {
        id: "ai-ethics-specialist",
        title: "AI Ethics Specialist",
        description: "Ensure AI systems are fair, transparent, and safe.",
        roadmap: [
          { step: "AI Basics", description: "Understand how AI models work", duration: "1-2 Months" },
          { step: "Ethics & Policy", description: "Study bias, fairness, and regulations", duration: "2 Months" },
          { step: "Auditing Tools", description: "Learn tools to detect bias in models", duration: "1-2 Months" },
          { step: "Compliance", description: "GDPR, AI Act, Legal frameworks", duration: "1 Month" },
        ],
        salary: { min: "$70k", avg: "$110k", max: "$150k" },
        demand: "Medium",
        companies: ["Microsoft", "Google", "Government Agencies"],
        internships: ["AI Policy Intern", "Responsible AI Intern"],
        alumniCount: 15,
      },
    ],
  },
  {
    id: "machine-learning",
    title: "Machine Learning",
    description: "Build and deploy algorithms that allow computers to learn from data.",
    icon: "Cpu",
    roles: [
      {
        id: "ml-engineer",
        title: "Machine Learning Engineer",
        description: "Design, build, and deploy machine learning models into production.",
        roadmap: [
          { step: "Foundations", description: "Python, NumPy, Pandas", duration: "1 Month" },
          { step: "ML Algorithms", description: "Scikit-learn, Regression, Classification", duration: "2 Months" },
          { step: "Deep Learning", description: "TensorFlow or PyTorch", duration: "2-3 Months" },
          { step: "MLOps", description: "Model deployment, Docker, Kubernetes", duration: "2 Months" },
        ],
        salary: { min: "$80k", avg: "$125k", max: "$180k" },
        demand: "High",
        companies: ["Amazon", "Netflix", "Uber", "Tesla"],
        internships: ["ML Engineer Intern", "Data Science Intern"],
        alumniCount: 65,
      },
      {
        id: "nlp-engineer",
        title: "NLP Engineer",
        description: "Work on systems that understand and generate human language.",
        roadmap: [
          { step: "Linguistics", description: "Basic understanding of language structure", duration: "1 Month" },
          { step: "Text Processing", description: "Tokenization, Stemming, Regex", duration: "1 Month" },
          { step: "NLP Models", description: "RNNs, LSTMs, Transformers (BERT/GPT)", duration: "3 Months" },
          { step: "Libraries", description: "Hugging Face, SpaCy, NLTK", duration: "1-2 Months" },
        ],
        salary: { min: "$85k", avg: "$130k", max: "$190k" },
        demand: "High",
        companies: ["Grammarly", "Duolingo", "Google", "Chatbot Startups"],
        internships: ["NLP Intern", "Language AI Intern"],
        alumniCount: 40,
      },
    ],
  },
  {
    id: "cloud-computing",
    title: "Cloud Computing",
    description: "Deliver computing services over the internet ('the cloud').",
    icon: "Cloud",
    roles: [
      {
        id: "cloud-architect",
        title: "Cloud Architect",
        description: "Design and manage cloud computing strategies and architecture.",
        roadmap: [
          { step: "Networking", description: "DNS, TCP/IP, HTTP, VPNs", duration: "1-2 Months" },
          { step: "Cloud Provider", description: "Get certified in AWS, Azure, or GCP", duration: "3 Months" },
          { step: "Infrastructure as Code", description: "Terraform, CloudFormation", duration: "1-2 Months" },
          { step: "Security", description: "IAM, Firewalls, Compliance", duration: "1 Month" },
        ],
        salary: { min: "$100k", avg: "$150k", max: "$220k" },
        demand: "High",
        companies: ["AWS", "Microsoft", "Capital One", "Enterprises"],
        internships: ["Cloud Intern", "Solutions Architect Intern"],
        alumniCount: 55,
      },
      {
        id: "devops-engineer",
        title: "DevOps Engineer",
        description: "Bridge the gap between development and operations using automation.",
        roadmap: [
          { step: "OS & Scripting", description: "Linux, Bash, Python", duration: "1-2 Months" },
          { step: "CI/CD", description: "Jenkins, GitHub Actions, GitLab CI", duration: "1-2 Months" },
          { step: "Containers", description: "Docker, Kubernetes", duration: "2-3 Months" },
          { step: "Monitoring", description: "Prometheus, Grafana, ELK Stack", duration: "1 Month" },
        ],
        salary: { min: "$90k", avg: "$135k", max: "$190k" },
        demand: "Very High",
        companies: ["All Tech Companies", "Banks", "Startups"],
        internships: ["DevOps Intern", "SRE Intern"],
        alumniCount: 85,
      },
    ],
  },
  {
    id: "data-science",
    title: "Data Science",
    description: "Analyze data to extract insights and build intelligent systems.",
    icon: "Database",
    roles: [
      {
        id: "data-analyst",
        title: "Data Analyst",
        description: "Interpret data to help make business decisions.",
        roadmap: [
          { step: "Spreadsheets", description: "Advanced Excel/Google Sheets", duration: "1 Month" },
          { step: "SQL", description: "Querying databases, Joins, Aggregations", duration: "1-2 Months" },
          { step: "Visualization", description: "Tableau, PowerBI, Looker", duration: "1-2 Months" },
          { step: "Basic Stats", description: "Probability, Distributions, Hypothesis Testing", duration: "1 Month" },
        ],
        salary: { min: "$55k", avg: "$75k", max: "$100k" },
        demand: "Medium",
        companies: ["Deloitte", "McKinsey", "Banks"],
        internships: ["Data Analysis Intern", "Business Intelligence Intern"],
        alumniCount: 80,
      },
    ],
  },
  {
    id: "cyber-security",
    title: "Cybersecurity",
    description: "Protect systems, networks, and programs from digital attacks.",
    icon: "Shield",
    roles: [
      {
        id: "security-analyst",
        title: "Security Analyst",
        description: "Monitor and protect organization's networks.",
        roadmap: [
          { step: "Networking", description: "OSI Model, TCP/IP, Protocols", duration: "1-2 Months" },
          { step: "OS Security", description: "Windows/Linux hardening", duration: "1 Month" },
          { step: "Tools", description: "Wireshark, Nmap, SIEM tools", duration: "1-2 Months" },
          { step: "Certifications", description: "CompTIA Security+, CEH", duration: "2-3 Months" },
        ],
        salary: { min: "$65k", avg: "$90k", max: "$120k" },
        demand: "High",
        companies: ["CrowdStrike", "Palo Alto Networks", "Government"],
        internships: ["SOC Analyst Intern", "Security Intern"],
        alumniCount: 60,
      },
    ],
  },
  {
    id: "product-management",
    title: "Product Management",
    description: "Guide the success of a product and lead the cross-functional team.",
    icon: "Briefcase",
    roles: [
      {
        id: "product-manager",
        title: "Product Manager",
        description: "Define product vision and strategy.",
        roadmap: [
          { step: "Market Research", description: "User interviews, Competitor analysis", duration: "1 Month" },
          { step: "Agile/Scrum", description: "Jira, Sprints, User Stories", duration: "1 Month" },
          { step: "Strategy", description: "Product Vision, Roadmapping, KPIs", duration: "1-2 Months" },
          { step: "Tech Basics", description: "Understand APIs, DBs to talk to devs", duration: "1 Month" },
        ],
        salary: { min: "$80k", avg: "$115k", max: "$160k" },
        demand: "Medium",
        companies: ["Atlassian", "Salesforce", "Tech Giants"],
        internships: ["APM Intern", "Product Intern"],
        alumniCount: 70,
      },
    ],
  },
];
