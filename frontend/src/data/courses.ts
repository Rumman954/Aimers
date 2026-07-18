import type { Course } from "@/types/course";

export const courses: Course[] = [
  {
    id: "full-stack-javascript",
    title: "Full-Stack JavaScript Mastery",
    shortDescription:
      "Build production-ready web apps with React, Node.js, and modern tooling from scratch to deployment.",
    fullDescription:
      "This comprehensive program takes you from JavaScript fundamentals through full-stack development. You'll build three portfolio projects, learn REST API design, authentication patterns, and deploy to production. Designed for learners who want job-ready skills with structured milestones and instructor feedback.",
    price: 89,
    category: "Programming",
    level: "Intermediate",
    duration: "12 weeks",
    thumbnail:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewCount: 342,
    instructorName: "Sarah Chen",
    students: 2840,
  },
  {
    id: "python-data-science",
    title: "Python for Data Science",
    shortDescription:
      "Analyze datasets, build visualizations, and apply machine learning with pandas, NumPy, and scikit-learn.",
    fullDescription:
      "Master the Python data stack through hands-on labs. You'll clean real-world datasets, create compelling visualizations, and train your first predictive models. Includes a capstone project analyzing public health data with a published report.",
    price: 79,
    category: "Data Science",
    level: "Beginner",
    duration: "10 weeks",
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviewCount: 518,
    instructorName: "Dr. Marcus Okonkwo",
    students: 4120,
  },
  {
    id: "ui-ux-product-design",
    title: "UI/UX Product Design",
    shortDescription:
      "Design user-centered digital products — research, wireframes, prototypes, and design systems in Figma.",
    fullDescription:
      "Learn the end-to-end product design process used by top tech teams. Conduct user interviews, map journeys, create high-fidelity prototypes, and present case studies for your portfolio. Includes peer critique sessions and mentor reviews.",
    price: 69,
    category: "Design",
    level: "Beginner",
    duration: "8 weeks",
    thumbnail:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewCount: 276,
    instructorName: "Elena Vasquez",
    students: 1950,
  },
  {
    id: "digital-marketing-strategy",
    title: "Digital Marketing Strategy",
    shortDescription:
      "Plan campaigns across SEO, social, email, and paid ads with measurable ROI for growing brands.",
    fullDescription:
      "Develop a marketing playbook you can apply immediately. Cover audience research, content strategy, analytics dashboards, and budget allocation. You'll launch a live mini-campaign and report results using industry-standard tools.",
    price: 59,
    category: "Business",
    level: "Intermediate",
    duration: "6 weeks",
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    reviewCount: 189,
    instructorName: "James Whitfield",
    students: 1620,
  },
  {
    id: "ielts-academic-prep",
    title: "IELTS Academic Preparation",
    shortDescription:
      "Structured prep for all four IELTS sections with timed practice, scoring rubrics, and speaking drills.",
    fullDescription:
      "Target band 7+ with weekly mock tests and personalized feedback. Covers reading strategies, writing task templates, listening techniques, and one-on-one speaking practice. Includes access to 20 full-length practice exams.",
    price: 49,
    category: "Exam Prep",
    level: "Intermediate",
    duration: "8 weeks",
    thumbnail:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewCount: 421,
    instructorName: "Priya Sharma",
    students: 3680,
  },
  {
    id: "cloud-devops-aws",
    title: "Cloud & DevOps with AWS",
    shortDescription:
      "Deploy scalable infrastructure with AWS, Docker, CI/CD pipelines, and infrastructure-as-code.",
    fullDescription:
      "Gain practical cloud skills employers demand. Provision EC2 and Lambda services, containerize applications, set up automated pipelines, and monitor production systems. Culminates in a capstone deploying a multi-tier application.",
    price: 99,
    category: "Programming",
    level: "Advanced",
    duration: "14 weeks",
    thumbnail:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviewCount: 156,
    instructorName: "Alex Rivera",
    students: 980,
  },
  {
    id: "financial-literacy-entrepreneurs",
    title: "Financial Literacy for Entrepreneurs",
    shortDescription:
      "Manage cash flow, read financial statements, and make informed funding decisions for your startup.",
    fullDescription:
      "Built for founders and small business owners. Learn bookkeeping basics, unit economics, break-even analysis, and pitch-deck financials. Includes spreadsheet templates and a session with a practicing CPA.",
    price: 45,
    category: "Business",
    level: "Beginner",
    duration: "5 weeks",
    thumbnail:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    reviewCount: 98,
    instructorName: "Nadia Al-Rashid",
    students: 740,
  },
  {
    id: "machine-learning-fundamentals",
    title: "Machine Learning Fundamentals",
    shortDescription:
      "Understand supervised and unsupervised learning, model evaluation, and neural network basics.",
    fullDescription:
      "A rigorous introduction to ML concepts without unnecessary math overhead. Implement algorithms from scratch and with frameworks, tune hyperparameters, and deploy a model to a simple API. Requires basic Python knowledge.",
    price: 94,
    category: "Data Science",
    level: "Advanced",
    duration: "11 weeks",
    thumbnail:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewCount: 203,
    instructorName: "Dr. Marcus Okonkwo",
    students: 1340,
  },
  {
    id: "graphic-design-branding",
    title: "Graphic Design & Brand Identity",
    shortDescription:
      "Create logos, brand guidelines, and marketing collateral that communicate clearly and consistently.",
    fullDescription:
      "From typography and color theory to client presentations — build a complete brand identity project for your portfolio. Covers Adobe Illustrator workflows and export standards for web and print.",
    price: 64,
    category: "Design",
    level: "Beginner",
    duration: "7 weeks",
    thumbnail:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    reviewCount: 167,
    instructorName: "Elena Vasquez",
    students: 1120,
  },
];

export function getCourseById(id: string): Course | undefined {
  return courses.find((course) => course.id === id);
}

export function getFeaturedCourses(count = 4): Course[] {
  return courses.slice(0, count);
}

export function getRelatedCourses(course: Course, count = 3): Course[] {
  return courses
    .filter((c) => c.category === course.category && c.id !== course.id)
    .slice(0, count);
}

export function getCoursesByCategory(category: string): Course[] {
  return courses.filter(
    (c) => c.category.toLowerCase() === category.toLowerCase()
  );
}
