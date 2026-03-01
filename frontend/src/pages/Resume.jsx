import { useEffect, useState } from "react";
import ResumeViewer from "../components/resume/ResumeViewer";
import DownloadButton from "../components/resume/DownloadButton";
import ScrollReveal from "../components/common/ScrollReveal";
import { setSEO } from "../utils/seo";
import api from "../services/api";

const DEFAULT_RESUME_URL = "/assets/Bhavesh_Patil_Resume.pdf";

const Resume = () => {
  const [resumeUrl, setResumeUrl] = useState(DEFAULT_RESUME_URL);

  useEffect(() => {
    const fetchResumeFromAbout = async () => {
      try {
        const response = await api.get("/about");
        const aboutResumeUrl = response.data?.data?.resumeUrl;
        setResumeUrl(aboutResumeUrl || DEFAULT_RESUME_URL);
      } catch (error) {
        setResumeUrl(DEFAULT_RESUME_URL);
      }
    };

    fetchResumeFromAbout();
  }, []);

  useEffect(() => {
    setSEO({
      title: "Resume | Bhavesh Patil - Full Stack Developer",
      description:
        "View and download the professional resume of Bhavesh Patil, a full stack MERN developer.",
      keywords:
        "Resume, CV, Full Stack Developer, MERN, React, Node.js, MongoDB",
    });
  }, []);

  return (
    <div className="space-y-12">
      <ScrollReveal>
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Resume</h1>
          <p className="text-gray-600 dark:text-gray-400">
            View or download my latest professional resume below.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.05}>
        <div className="flex justify-center">
          <DownloadButton
            resumeUrl={resumeUrl}
            fileName="Bhavesh_Patil_Resume.pdf"
          />
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.08}>
        <ResumeViewer resumeUrl={resumeUrl} />
      </ScrollReveal>
    </div>
  );
};

export default Resume;
