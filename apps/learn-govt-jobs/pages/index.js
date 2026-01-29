import LandingPage from "../../../components/shared/LandingPage";

export default function Home() {
  return (
    <LandingPage
      appName="govt-jobs"
      appTitle="Learn Government Jobs Preparation"
      appDescription="Comprehensive preparation for government job examinations and competitive tests"
      showRegistration={true}
      isFree={false}
      ctaText="Start Preparation"
      features={[
        {
          icon: "📚",
          title: "Exam-Focused Content",
          description: "Targeted material covering all major government examination patterns.",
        },
        {
          icon: "📝",
          title: "Practice Papers",
          description: "Extensive mock tests and previous year question papers with solutions.",
        },
        {
          icon: "🎯",
          title: "Strategy & Tips",
          description: "Expert guidance on exam strategy, time management, and success techniques.",
        }
      ]}
    />
  );
}
