import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { HeroSection } from '@/features/hero/HeroSection';
import { AboutSection } from '@/features/about/AboutSection';
import { SkillsSection } from '@/features/skills/SkillsSection';
import { PortfolioSection } from '@/features/portfolio/PortfolioSection';
import { FeaturedSection } from '@/features/portfolio/FeaturedSection';
import { ProcessSection } from '@/features/process/ProcessSection';
import { TestimonialsSection } from '@/features/testimonials/TestimonialsSection';
import { ServicesSection } from '@/features/services/ServicesSection';
import { ContactSection } from '@/features/contact/ContactSection';
import api from '@/services/api';

export const HomePage = () => {
  const { data: settings } = useQuery({
    queryKey: ['settings'],
    queryFn: () => api.get('/settings').then((r) => r.data.data),
  });

  return (
    <>
      <Helmet>
        <title>{settings?.seoTitle || 'Portfolio — Character Artist'}</title>
        <meta name="description" content={settings?.seoDescription || 'Character art, 3D sculpting, and concept design.'} />
        {settings?.ogImage && <meta property="og:image" content={settings.ogImage} />}
      </Helmet>

      <PageWrapper>
        <HeroSection />
        <AboutSection />
        <SkillsSection />
        <FeaturedSection />
        <PortfolioSection />
        <ProcessSection />
        <TestimonialsSection />
        <ServicesSection />
        <ContactSection />
      </PageWrapper>
    </>
  );
};
