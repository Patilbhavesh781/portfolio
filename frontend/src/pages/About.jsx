import { useEffect } from "react";
import AboutIntro from "../components/about/AboutIntro";
import Skills from "../components/about/Skills";
import Experience from "../components/about/Experience";
import Education from "../components/about/Education";
import Certifications from "../components/about/Certifications";
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
      <AboutIntro />
      <Skills />
      <Experience />
      <Education />
      <Certifications />
    </div>
  );
};

export default About;
