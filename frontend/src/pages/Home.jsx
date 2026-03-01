import Hero from "../components/home/Hero";
import TechStack from "../components/home/TechStack";
import Stats from "../components/home/Stats";
import Testimonials from "../components/home/Testimonials";
import { useEffect } from "react";
import ScrollReveal from "../components/common/ScrollReveal";
import { setSEO } from "../utils/seo";

const Home = () => {
  useEffect(() => {
    setSEO({
      title: "Home | Bhavesh Patil - Full Stack Developer",
      description:
        "Portfolio of Bhavesh Patil, a full stack MERN developer specializing in scalable web applications, APIs, and modern UI/UX.",
      keywords:
        "Full Stack Developer, MERN Stack, React Developer, Portfolio, JavaScript, Node.js, MongoDB",
    });
  }, []);

  return (
    <div className="space-y-24">
      <ScrollReveal y={30} amount={0.25}>
        <Hero />
      </ScrollReveal>

      <ScrollReveal y={40} delay={0.05}>
        <TechStack />
      </ScrollReveal>

      <ScrollReveal y={40} delay={0.1}>
        <Stats />
      </ScrollReveal>
      {/* <Testimonials /> */}
    </div>
  );
};

export default Home;
