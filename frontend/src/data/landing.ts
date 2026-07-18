export interface Feature {
  title: string;
  description: string;
  icon: "target" | "brain" | "users" | "chart" | "clock" | "shield";
}

export interface Category {
  name: string;
  slug: string;
  description: string;
  courseCount: number;
}

export interface Stat {
  label: string;
  value: number;
  suffix?: string;
}

export interface LearningPath {
  title: string;
  description: string;
  duration: string;
  courses: string[];
  level: string;
}

export interface Testimonial {
  name: string;
  role: string;
  quote: string;
  avatar: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export const features: Feature[] = [
  {
    title: "Structured learning paths",
    description:
      "Follow curated sequences that build skills progressively — no guessing what to learn next.",
    icon: "target",
  },
  {
    title: "AI-powered study support",
    description:
      "Get instant explanations, practice questions, and progress insights tailored to your pace.",
    icon: "brain",
  },
  {
    title: "Expert instructors",
    description:
      "Learn from practitioners who work in the field, not just theorists reading from slides.",
    icon: "users",
  },
  {
    title: "Track your progress",
    description:
      "Dashboards show completion rates, quiz scores, and milestones so you always know where you stand.",
    icon: "chart",
  },
  {
    title: "Learn on your schedule",
    description:
      "Self-paced modules with optional live sessions — fit education around your life, not the other way around.",
    icon: "clock",
  },
  {
    title: "Certificate of completion",
    description:
      "Earn verifiable credentials for every finished course to showcase on LinkedIn and your resume.",
    icon: "shield",
  },
];

export const categories: Category[] = [
  {
    name: "Programming",
    slug: "programming",
    description: "Web, mobile, and cloud development",
    courseCount: 2,
  },
  {
    name: "Data Science",
    slug: "data-science",
    description: "Analytics, ML, and data engineering",
    courseCount: 2,
  },
  {
    name: "Design",
    slug: "design",
    description: "UI/UX, branding, and visual design",
    courseCount: 2,
  },
  {
    name: "Business",
    slug: "business",
    description: "Marketing, finance, and entrepreneurship",
    courseCount: 2,
  },
  {
    name: "Exam Prep",
    slug: "exam-prep",
    description: "IELTS, SAT, and professional certifications",
    courseCount: 1,
  },
];

export const stats: Stat[] = [
  { label: "Active students", value: 18000, suffix: "+" },
  { label: "Courses available", value: 50, suffix: "+" },
  { label: "Expert instructors", value: 35, suffix: "+" },
  { label: "Completion rate", value: 87, suffix: "%" },
];

export const learningPaths: LearningPath[] = [
  {
    title: "Full-Stack Developer",
    description:
      "Go from HTML basics to deploying full-stack applications. Includes JavaScript, React, Node.js, and cloud fundamentals.",
    duration: "6 months",
    courses: ["Full-Stack JavaScript Mastery", "Cloud & DevOps with AWS"],
    level: "Beginner → Advanced",
  },
  {
    title: "Data Analyst to ML Engineer",
    description:
      "Master Python, statistical analysis, and machine learning. Build a portfolio of data projects employers recognize.",
    duration: "5 months",
    courses: ["Python for Data Science", "Machine Learning Fundamentals"],
    level: "Beginner → Advanced",
  },
  {
    title: "Creative Professional",
    description:
      "Develop product design and brand identity skills. Create a portfolio that wins freelance clients and job interviews.",
    duration: "4 months",
    courses: ["UI/UX Product Design", "Graphic Design & Brand Identity"],
    level: "Beginner → Intermediate",
  },
];

export const testimonials: Testimonial[] = [
  {
    name: "Fatima Rahman",
    role: "Software Engineer, Dhaka",
    quote:
      "Aimers helped me switch careers in eight months. The structured paths and AI study assistant kept me accountable when motivation dipped.",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&q=80",
  },
  {
    name: "Tomás Herrera",
    role: "Product Designer, Madrid",
    quote:
      "The design courses are practical — real briefs, real feedback. My portfolio went from empty to three case studies I am proud to share.",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
  },
  {
    name: "Amara Okafor",
    role: "Data Analyst, Lagos",
    quote:
      "I scored band 7.5 on IELTS after the prep course and landed a scholarship abroad. The timed practice tests made all the difference.",
    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80",
  },
];

export const faqItems: FAQItem[] = [
  {
    question: "How do Aimers courses work?",
    answer:
      "Each course is self-paced with video lessons, readings, quizzes, and projects. You can start anytime and access materials for the duration of your enrollment. Optional live Q&A sessions are scheduled monthly.",
  },
  {
    question: "Do I get a certificate?",
    answer:
      "Yes. Complete all modules and pass the final assessment to earn a certificate of completion. Certificates include a verification link you can share with employers.",
  },
  {
    question: "What is the AI study assistant?",
    answer:
      "Aimers AI helps you summarize lessons, generate practice questions, and clarify concepts in plain language. It is available on all enrolled courses and adapts to your learning history.",
  },
  {
    question: "Can I get a refund?",
    answer:
      "We offer a 14-day satisfaction guarantee. If the course is not the right fit, contact support within two weeks of purchase for a full refund — no questions asked.",
  },
  {
    question: "Are there prerequisites?",
    answer:
      "Each course listing shows the recommended level. Beginner courses assume no prior experience. Intermediate and advanced courses list specific skills you should have before enrolling.",
  },
];
