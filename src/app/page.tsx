import HeroSection from "@/components/HeroSection";
import ExperienceSection from "@/components/ExperienceSection";
import ContentSections from "@/components/ContentSections";
import BlogsPreview from "@/components/BlogsPreview";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <HeroSection />
      <ExperienceSection />
      <ContentSections />
      <BlogsPreview />
      <Footer />
    </main>
  );
}
