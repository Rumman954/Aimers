import { Hero } from "@/components/home/hero";
import { Features } from "@/components/home/features";
import { Categories } from "@/components/home/categories";
import { FeaturedCourses } from "@/components/home/featured-courses";
import { Statistics } from "@/components/home/statistics";
import { LearningPaths } from "@/components/home/learning-paths";
import { Testimonials } from "@/components/home/testimonials";
import { FAQ } from "@/components/home/faq";
import { Newsletter } from "@/components/home/newsletter";

export default function HomePage() {
  return (
    <>
      <Hero />
      <Features />
      <Categories />
      <FeaturedCourses />
      <Statistics />
      <LearningPaths />
      <Testimonials />
      <FAQ />
      <Newsletter />
    </>
  );
}
