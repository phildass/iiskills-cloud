import LandingPage from "../../../components/shared/LandingPage";

export default function Home() {
  return (
    <LandingPage
      appName="math"
      appTitle="Learn Mathematics"
      appDescription="Build strong mathematical foundations and problem-solving skills"
      showRegistration={true}
      isFree={false}
      ctaText="Start Learning Math"
      features={[
        {
          icon: "🔢",
          title: "Core Mathematics",
          description: "Comprehensive coverage of fundamental mathematical concepts and techniques.",
        },
        {
          icon: "📐",
          title: "Problem Solving",
          description: "Develop analytical thinking and systematic problem-solving approaches.",
        },
        {
          icon: "🧮",
          title: "Applied Mathematics",
          description: "Real-world applications and practical uses of mathematical principles.",
        }
      ]}
    />
  );
}
