import { Navbar, HeroSection, FeaturesSection, ContactSection, Footer } from '@/components/landing';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <FeaturesSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
}
