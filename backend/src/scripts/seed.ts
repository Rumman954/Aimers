import bcrypt from "bcryptjs";
import { connectDB } from "../config/db.js";
import { env } from "../config/env.js";
import { User } from "../models/User.js";
import { Course } from "../models/Course.js";
import { Review } from "../models/Review.js";
import { Enrollment } from "../models/Enrollment.js";
import { Interaction } from "../models/Interaction.js";

const seedCourses = [
  {
    title: "Full-Stack JavaScript Mastery",
    slug: "full-stack-javascript",
    shortDescription:
      "Build production-ready web apps with React, Node.js, and modern tooling from scratch to deployment.",
    fullDescription:
      "This comprehensive program takes you from JavaScript fundamentals through full-stack development. You'll build three portfolio projects, learn REST API design, authentication patterns, and deploy to production.",
    price: 89,
    category: "Programming",
    level: "Intermediate" as const,
    duration: "12 weeks",
    thumbnail:
      "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewCount: 342,
    students: 2840,
    tags: ["javascript", "react", "nodejs"],
  },
  {
    title: "Python for Data Science",
    slug: "python-data-science",
    shortDescription:
      "Analyze datasets, build visualizations, and apply machine learning with pandas, NumPy, and scikit-learn.",
    fullDescription:
      "Master the Python data stack through hands-on labs. You'll clean real-world datasets, create compelling visualizations, and train your first predictive models.",
    price: 79,
    category: "Data Science",
    level: "Beginner" as const,
    duration: "10 weeks",
    thumbnail:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviewCount: 518,
    students: 4120,
    tags: ["python", "pandas", "ml"],
  },
  {
    title: "UI/UX Product Design",
    slug: "ui-ux-product-design",
    shortDescription:
      "Design user-centered digital products — research, wireframes, prototypes, and design systems in Figma.",
    fullDescription:
      "Learn the end-to-end product design process used by top tech teams. Conduct user interviews, map journeys, and create high-fidelity prototypes.",
    price: 69,
    category: "Design",
    level: "Beginner" as const,
    duration: "8 weeks",
    thumbnail:
      "https://images.unsplash.com/photo-1561070791-2526d30994b5?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewCount: 276,
    students: 1950,
    tags: ["figma", "ux", "ui"],
  },
  {
    title: "Digital Marketing Strategy",
    slug: "digital-marketing-strategy",
    shortDescription:
      "Plan campaigns across SEO, social, email, and paid ads with measurable ROI for growing brands.",
    fullDescription:
      "Develop a marketing playbook you can apply immediately. Cover audience research, content strategy, analytics dashboards, and budget allocation.",
    price: 59,
    category: "Business",
    level: "Intermediate" as const,
    duration: "6 weeks",
    thumbnail:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    reviewCount: 189,
    students: 1620,
    tags: ["seo", "ads", "marketing"],
  },
  {
    title: "IELTS Academic Preparation",
    slug: "ielts-academic-prep",
    shortDescription:
      "Structured prep for all four IELTS sections with timed practice, scoring rubrics, and speaking drills.",
    fullDescription:
      "Target band 7+ with weekly mock tests and personalized feedback. Includes access to 20 full-length practice exams.",
    price: 49,
    category: "Exam Prep",
    level: "Intermediate" as const,
    duration: "8 weeks",
    thumbnail:
      "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewCount: 421,
    students: 3680,
    tags: ["ielts", "english", "exam"],
  },
  {
    title: "Cloud & DevOps with AWS",
    slug: "cloud-devops-aws",
    shortDescription:
      "Deploy scalable infrastructure with AWS, Docker, CI/CD pipelines, and infrastructure-as-code.",
    fullDescription:
      "Gain practical cloud skills employers demand. Provision EC2 and Lambda services, containerize applications, and set up automated pipelines.",
    price: 99,
    category: "Programming",
    level: "Advanced" as const,
    duration: "14 weeks",
    thumbnail:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviewCount: 156,
    students: 980,
    tags: ["aws", "devops", "docker"],
  },
  {
    title: "Financial Literacy for Entrepreneurs",
    slug: "financial-literacy-entrepreneurs",
    shortDescription:
      "Manage cash flow, read financial statements, and make informed funding decisions for your startup.",
    fullDescription:
      "Built for founders and small business owners. Learn bookkeeping basics, unit economics, and pitch-deck financials.",
    price: 45,
    category: "Business",
    level: "Beginner" as const,
    duration: "5 weeks",
    thumbnail:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    reviewCount: 98,
    students: 740,
    tags: ["finance", "startup"],
  },
  {
    title: "Machine Learning Fundamentals",
    slug: "machine-learning-fundamentals",
    shortDescription:
      "Understand supervised and unsupervised learning, model evaluation, and neural network basics.",
    fullDescription:
      "A rigorous introduction to ML concepts. Implement algorithms from scratch and with frameworks, then deploy a model to a simple API.",
    price: 94,
    category: "Data Science",
    level: "Advanced" as const,
    duration: "11 weeks",
    thumbnail:
      "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewCount: 203,
    students: 1340,
    tags: ["ml", "ai", "python"],
  },
  {
    title: "Graphic Design & Brand Identity",
    slug: "graphic-design-branding",
    shortDescription:
      "Create logos, brand guidelines, and marketing collateral that communicate clearly and consistently.",
    fullDescription:
      "From typography and color theory to client presentations — build a complete brand identity project for your portfolio.",
    price: 64,
    category: "Design",
    level: "Beginner" as const,
    duration: "7 weeks",
    thumbnail:
      "https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    reviewCount: 167,
    students: 1120,
    tags: ["branding", "illustrator"],
  },
  {
    title: "React Native Mobile Apps",
    slug: "react-native-mobile",
    shortDescription:
      "Build cross-platform iOS and Android apps with React Native, Expo, and native device APIs.",
    fullDescription:
      "Ship mobile apps from one codebase. Cover navigation, state management, offline storage, and store submission basics.",
    price: 84,
    category: "Programming",
    level: "Intermediate" as const,
    duration: "10 weeks",
    thumbnail:
      "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviewCount: 214,
    students: 1560,
    tags: ["react-native", "mobile"],
  },
  {
    title: "SQL & Database Design",
    slug: "sql-database-design",
    shortDescription:
      "Model relational data, write efficient queries, and design schemas that scale with your product.",
    fullDescription:
      "Learn practical SQL for analysts and developers. Includes joins, indexing, normalization, and a capstone schema project.",
    price: 55,
    category: "Data Science",
    level: "Beginner" as const,
    duration: "6 weeks",
    thumbnail:
      "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    reviewCount: 301,
    students: 2210,
    tags: ["sql", "database"],
  },
  {
    title: "Public Speaking Confidence",
    slug: "public-speaking-confidence",
    shortDescription:
      "Craft clear talks, manage nerves, and deliver presentations that hold attention in any room.",
    fullDescription:
      "Weekly speaking labs with recorded feedback. Build a personal talk, handle Q&A, and practice storytelling frameworks.",
    price: 39,
    category: "Business",
    level: "Beginner" as const,
    duration: "4 weeks",
    thumbnail:
      "https://images.unsplash.com/photo-1475721027785-f74eccf877e2?auto=format&fit=crop&w=800&q=80",
    rating: 4.9,
    reviewCount: 412,
    students: 2890,
    tags: ["speaking", "soft-skills"],
  },
  {
    title: "Cybersecurity Essentials",
    slug: "cybersecurity-essentials",
    shortDescription:
      "Protect systems with threat modeling, secure coding habits, and hands-on defensive labs.",
    fullDescription:
      "Understand common attack vectors and how to defend against them. Includes password security, network basics, and incident response drills.",
    price: 88,
    category: "Programming",
    level: "Intermediate" as const,
    duration: "9 weeks",
    thumbnail:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviewCount: 178,
    students: 1090,
    tags: ["security", "network"],
  },
  {
    title: "Content Writing for the Web",
    slug: "content-writing-web",
    shortDescription:
      "Write clear landing pages, blogs, and product copy that convert readers into customers.",
    fullDescription:
      "Practice SEO-aware writing, editing workflows, and brand voice. Build a portfolio of five published pieces.",
    price: 42,
    category: "Business",
    level: "Beginner" as const,
    duration: "5 weeks",
    thumbnail:
      "https://images.unsplash.com/photo-1455390582262-044cdead277a?auto=format&fit=crop&w=800&q=80",
    rating: 4.5,
    reviewCount: 145,
    students: 980,
    tags: ["writing", "seo"],
  },
  {
    title: "Photography Fundamentals",
    slug: "photography-fundamentals",
    shortDescription:
      "Master exposure, composition, and lighting to capture sharper, more intentional photographs.",
    fullDescription:
      "Camera settings made practical. Includes outdoor shoots, portrait lighting basics, and Lightroom editing workflows.",
    price: 58,
    category: "Design",
    level: "Beginner" as const,
    duration: "6 weeks",
    thumbnail:
      "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewCount: 267,
    students: 1740,
    tags: ["photography", "lightroom"],
  },
  {
    title: "SAT Math Intensive",
    slug: "sat-math-intensive",
    shortDescription:
      "Target higher SAT Math scores with strategy drills, timed sections, and error-pattern coaching.",
    fullDescription:
      "Focused practice on algebra, problem solving, and advanced math. Weekly timed tests with score tracking.",
    price: 52,
    category: "Exam Prep",
    level: "Intermediate" as const,
    duration: "8 weeks",
    thumbnail:
      "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviewCount: 334,
    students: 2450,
    tags: ["sat", "math", "exam"],
  },
  {
    title: "TypeScript for Professionals",
    slug: "typescript-professionals",
    shortDescription:
      "Level up JavaScript projects with strong typing, generics, and scalable TypeScript patterns.",
    fullDescription:
      "Move from any-typed code to production TypeScript. Covers utility types, strict mode, and integrating TS into React and Node apps.",
    price: 72,
    category: "Programming",
    level: "Intermediate" as const,
    duration: "7 weeks",
    thumbnail:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewCount: 198,
    students: 1320,
    tags: ["typescript", "javascript"],
  },
  {
    title: "Product Management Foundations",
    slug: "product-management-foundations",
    shortDescription:
      "Define roadmaps, prioritize features, and ship products that solve real user problems.",
    fullDescription:
      "Learn discovery interviews, PRDs, prioritization frameworks, and stakeholder communication used by modern product teams.",
    price: 76,
    category: "Business",
    level: "Intermediate" as const,
    duration: "8 weeks",
    thumbnail:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&w=800&q=80",
    rating: 4.6,
    reviewCount: 156,
    students: 890,
    tags: ["product", "roadmap"],
  },
  {
    title: "TOEFL Speaking & Writing",
    slug: "toefl-speaking-writing",
    shortDescription:
      "Raise TOEFL Speaking and Writing scores with templates, timed practice, and scoring feedback.",
    fullDescription:
      "Task-by-task strategies for independent and integrated responses. Includes recorded speaking reviews and essay scoring.",
    price: 54,
    category: "Exam Prep",
    level: "Intermediate" as const,
    duration: "7 weeks",
    thumbnail:
      "https://images.unsplash.com/photo-1488190211105-8b0e65b80b4e?auto=format&fit=crop&w=800&q=80",
    rating: 4.7,
    reviewCount: 289,
    students: 2010,
    tags: ["toefl", "english"],
  },
  {
    title: "Motion Design with After Effects",
    slug: "motion-design-after-effects",
    shortDescription:
      "Animate logos, UI, and explainer clips with After Effects for social and product marketing.",
    fullDescription:
      "Learn keyframing, easing, typography animation, and export presets. Finish with a motion reel for your portfolio.",
    price: 81,
    category: "Design",
    level: "Intermediate" as const,
    duration: "9 weeks",
    thumbnail:
      "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=800&q=80",
    rating: 4.8,
    reviewCount: 142,
    students: 760,
    tags: ["motion", "after-effects"],
  },
];

async function seed() {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Course.deleteMany({}),
    Review.deleteMany({}),
    Enrollment.deleteMany({}),
    Interaction.deleteMany({}),
  ]);

  const passwordHash = await bcrypt.hash(env.DEMO_PASSWORD, 12);

  const demoStudent = await User.create({
    name: "Demo Student",
    email: env.DEMO_EMAIL,
    passwordHash,
    role: "student",
  });

  const instructor = await User.create({
    name: "Aimers Instructor",
    email: "instructor@aimers.com",
    passwordHash: await bcrypt.hash("Instructor@1234", 12),
    role: "instructor",
  });

  const instructors = [
    { name: "Sarah Chen", user: instructor },
    { name: "Dr. Marcus Okonkwo", user: instructor },
    { name: "Elena Vasquez", user: instructor },
    { name: "James Whitfield", user: instructor },
    { name: "Priya Sharma", user: instructor },
    { name: "Alex Rivera", user: instructor },
    { name: "Nadia Al-Rashid", user: instructor },
  ];

  const courses = await Course.insertMany(
    seedCourses.map((course, index) => {
      const lead = instructors[index % instructors.length];
      return {
        ...course,
        images: [course.thumbnail],
        instructor: lead.user._id,
        instructorName: lead.name,
        status: "published" as const,
      };
    })
  );

  console.log("Seed complete");
  console.log(`Users: 2 (demo student + instructor)`);
  console.log(`Courses: ${courses.length}`);
  console.log(`Demo login: ${env.DEMO_EMAIL} / ${env.DEMO_PASSWORD}`);
  console.log(`Instructor: instructor@aimers.com / Instructor@1234`);
  console.log(`Demo student id: ${demoStudent._id}`);

  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
