import { useEffect } from "react";
import AboutIntro from "../components/about/AboutIntro";
import Skills from "../components/about/Skills";
import Experience from "../components/about/Experience";
import Education from "../components/about/Education";
import Certifications from "../components/about/Certifications";
import ScrollReveal from "../components/common/ScrollReveal";
import { setSEO } from "../utils/seo";

const About = () => {
  useEffect(() => {
    setSEO({
      title: "About Me | Bhavesh Patil - Full Stack Developer",
      description:
        "Learn more about Your Name — a passionate full stack MERN developer with experience in building scalable and performant web applications.",
      keywords:
        "About Me, Full Stack Developer, MERN, React, Node.js, MongoDB, Portfolio",
    });
  }, []);

  return (
    <div className="space-y-24">
      <ScrollReveal>
        <AboutIntro />
      </ScrollReveal>
      <ScrollReveal delay={0.05}>
        <Skills />
      </ScrollReveal>
      <ScrollReveal delay={0.08}>
        <Experience />
      </ScrollReveal>
      <ScrollReveal delay={0.1}>
        <Education />
      </ScrollReveal>
      <ScrollReveal delay={0.12}>
        <Certifications />
      </ScrollReveal>
    </div>
  );
};

export default About;
