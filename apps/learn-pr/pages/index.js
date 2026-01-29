import LandingPage from "../../../components/shared/LandingPage";

export default function Home() {
  return (
    <LandingPage
      appName="pr"
      appTitle="Learn PR"
      appDescription="Master Public Relations strategies, media management, and brand building"
      showRegistration={true}
      isFree={false}
      ctaText="Master PR Skills"
      features={[
        {
          icon: "📢",
          title: "Communication Strategy",
          description: "Learn effective PR communication and media relations strategies.",
        },
        {
          icon: "🎯",
          title: "Brand Management",
          description: "Develop skills in brand building and reputation management.",
        },
        {
          icon: "📰",
          title: "Media Relations",
          description: "Master the art of working with media and creating impactful campaigns.",
        }
      ]}
    />
  );
}
