import Shared404 from "../../../components/shared/Shared404";
import Footer from "@iiskills/ui/src/Footer";

export default function Custom404() {
  return (
    <>
      <Shared404
        appName="Learn Biology"
        appId="learn-biology"
        emoji="🧬"
        description="Explore the fascinating world of living organisms with our Biology courses. From cell biology to ecology, understand life at every level. Cross-links with Chemistry and Physics. Part of our free Foundation Suite."
      />
      <Footer />
    </>
  );
}
