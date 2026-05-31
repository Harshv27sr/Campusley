// src/pages/HomePage.jsx
import MainLayout from '../components/layout/MainLayout'
import HeroSection from '../components/home/HeroSection'
import FeaturesSection from '../components/home/FeaturesSection'
import TrendingNotes from '../components/home/TrendingNotes'
import TopContributors from '../components/home/TopContributors'
import AIFeaturesPreview from '../components/home/AIFeaturesPreview'
import TestimonialsSection from '../components/home/TestimonialsSection'
import CTASection from '../components/home/CTASection'

export default function HomePage() {
  return (
    <MainLayout>
      <HeroSection />
      <FeaturesSection />
      <TrendingNotes />
      <AIFeaturesPreview />
      <TopContributors />
      <TestimonialsSection />
      <CTASection />
    </MainLayout>
  )
}
