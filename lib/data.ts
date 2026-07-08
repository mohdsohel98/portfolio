/**
 * Single source of truth for all portfolio content.
 * Pulled from Sohel_Mansoori_Resume-E1.docx — edit here to update the site.
 */

export const profile = {
  name: "Sohel Mansoori",
  title: "Full-Stack Developer",
  tagline: "Deploying scalable web & mobile systems. Mission-ready, production-grade.",
  location: "Rewa, Madhya Pradesh, India",
  email: "khansohel8960@gmail.com",
  phone: "+91 9329163682",
  // TODO: replace with your real profile URLs
  linkedin: "https://www.linkedin.com/in/sohel-mansoori",
  github: "https://github.com/sohel-mansoori",
  resumeFile: "/Sohel_Mansoori_Resume.docx",
  summary:
    "Results-driven Full-Stack Developer with 1+ year of experience building scalable, production-ready web and mobile applications. Proficient in React.js, React Native, Node.js, NestJS, Next.js, and PHP, with strong expertise in PostgreSQL, Docker, RESTful APIs, and secure authentication (JWT/OAuth). Adept at delivering end-to-end solutions — from microservice architecture to Razorpay payment integration — with a consistent focus on code quality and performance.",
};

export interface ExperienceEntry {
  id: string;
  role: string;
  company: string;
  location: string;
  period: string;
  achievements: string[];
}

export const experience: ExperienceEntry[] = [
  {
    id: "hj-dev",
    role: "Full-Stack Developer",
    company: "HJ Infotech Software Solutions Pvt. Ltd.",
    location: "Jaipur, Rajasthan",
    period: "Jul 2026 — Present",
    achievements: [
      "Developing and maintaining a PHP-based LMS for a driving school selling courses online, building features end-to-end with PHP and JavaScript.",
      "Implemented a student progress-report tracking system with file-attachment support and delivered major UI/UX enhancements across course pages.",
      "Built a referral system to drive user acquisition and reward existing users for inviting new learners.",
    ],
  },
  {
    id: "hj-trainee",
    role: "Full-Stack Developer Trainee",
    company: "HJ Infotech Software Solutions Pvt. Ltd.",
    location: "Jaipur, Rajasthan",
    period: "Jan 2026 — Jul 2026",
    achievements: [
      "Architected EzyGo, an Uber-like ride-hailing platform — microservice architecture, PostgreSQL data models, JWT authentication, and driver onboarding & verification workflows using NestJS and React.js.",
      "Engineered Safevation MVP, an aviation safety platform (React.js, Node.js, PostgreSQL, Azure Blob, Docker) computing a Safety Score Index for aircraft airworthiness; AI-assisted coding accelerated delivery by ~34%.",
      "Built secure document verification & analysis pipelines integrated with Azure Blob Storage for compliance handling.",
    ],
  },
  {
    id: "hj-intern",
    role: "Full-Stack Developer Intern",
    company: "HJ Infotech Software Solutions Pvt. Ltd.",
    location: "Jaipur, Rajasthan",
    period: "Jul 2025 — Dec 2025",
    achievements: [
      "Developed LMS features across Admin, Instructor & User panels using Next.js, Node.js, and PostgreSQL; designed RESTful APIs and optimized relational schemas.",
      "Integrated Razorpay payments & Shiprocket delivery automation into WordPress e-commerce solutions.",
      "Introduced AI-assisted testing workflows that cut bug-resolution time.",
    ],
  },
  {
    id: "coplur",
    role: "Full-Stack Developer Trainee",
    company: "Coplur Technologies",
    location: "Remote",
    period: "Mar 2025 — Jul 2025",
    achievements: [
      "Built real-world projects using .NET Core, React.js & SQL Server applying SOLID principles and clean architecture.",
      "Deployed full-stack apps to the cloud with Git-based collaboration.",
    ],
  },
];

export interface Project {
  id: string;
  codename: string;
  name: string;
  subtitle: string;
  description: string;
  highlights: string[];
  stack: string[];
  accent: "cyan" | "violet" | "blue";
}

export const projects: Project[] = [
  {
    id: "ezygo",
    codename: "OP-01",
    name: "EzyGo",
    subtitle: "Ride-Hailing Platform",
    description:
      "Uber-like ride-hailing platform architected on microservices — PostgreSQL data models, JWT authentication, and full driver onboarding & verification workflows.",
    highlights: [
      "Microservice architecture designed from the ground up",
      "Driver onboarding & document verification workflows",
      "Secure JWT-based authentication",
    ],
    stack: ["NestJS", "React.js", "PostgreSQL", "JWT", "Microservices"],
    accent: "cyan",
  },
  {
    id: "safevation",
    codename: "OP-02",
    name: "Safevation",
    subtitle: "Aviation Safety MVP",
    description:
      "Aviation safety platform computing a Safety Score Index for aircraft airworthiness, with secure document verification pipelines for compliance handling.",
    highlights: [
      "Safety Score Index computation engine",
      "Azure Blob document pipelines for compliance",
      "AI-assisted coding accelerated delivery by ~34%",
    ],
    stack: ["React.js", "Node.js", "PostgreSQL", "Azure Blob", "Docker"],
    accent: "violet",
  },
  {
    id: "handmade",
    codename: "OP-03",
    name: "Handmade Marketplace",
    subtitle: "E-Commerce Startup · 2026 — Present",
    description:
      "Mobile marketplace empowering home-based sellers and small businesses to register and sell handmade gifts & products directly to customers.",
    highlights: [
      "React Native app with NestJS + PostgreSQL backend",
      "Razorpay payments & JWT authentication",
      "Seller KYC onboarding, admin panel & marketing landing page",
    ],
    stack: ["React Native", "NestJS", "PostgreSQL", "Razorpay", "JWT"],
    accent: "blue",
  },
  {
    id: "room-rent",
    codename: "OP-04",
    name: "Room Renting Platform",
    subtitle: "Property Rental App · Feb — Apr 2025",
    description:
      "Full-stack property rental application with role-based dashboards for owners and seekers, image uploads, and structured RESTful APIs.",
    highlights: [
      "Role-based dashboards for owners & seekers",
      "JWT auth and image upload handling",
      "Responsive React.js frontend",
    ],
    stack: ["React.js", "ASP.NET Core", "MySQL", "JWT"],
    accent: "cyan",
  },
];

export interface SkillGroup {
  label: string;
  skills: string[];
}

export const skillGroups: SkillGroup[] = [
  {
    label: "Languages",
    skills: ["JavaScript (ES6+)", "TypeScript", "PHP", "C++", "C#"],
  },
  {
    label: "Frontend",
    skills: ["React.js", "Next.js", "React Native", "HTML5", "CSS3", "Tailwind CSS"],
  },
  {
    label: "Backend",
    skills: ["Node.js", "NestJS", "Express.js", "PHP", "ASP.NET Core"],
  },
  {
    label: "Databases",
    skills: ["PostgreSQL", "MySQL", "MongoDB", "SQL Server"],
  },
  {
    label: "DevOps & Tools",
    skills: [
      "Docker",
      "Git",
      "GitHub",
      "Azure Blob",
      "REST APIs",
      "JWT",
      "OAuth 2.0",
      "Razorpay",
      "Jira",
      "Postman",
    ],
  },
];

export const leadership = {
  role: "Developer Head",
  org: "Technoverse Club, UIT Shivpuri",
  period: "Apr 2024 — Present",
  description:
    "Leading the developer wing of the campus tech community — organized and led hands-on tech workshops for 100+ members.",
};

export const education = {
  degree: "B.Tech, Computer Science & Engineering",
  school: "University Institute of Technology RGPV, Shivpuri (M.P.)",
  period: "2022 — 2026",
};
