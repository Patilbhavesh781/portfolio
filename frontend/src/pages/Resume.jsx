import { useEffect, useState } from "react";
import ResumeViewer from "../components/resume/ResumeViewer";
import DownloadButton from "../components/resume/DownloadButton";
import { setSEO } from "../utils/seo";

const Resume = () => {
  const [resumeUrl, setResumeUrl] = useState("/assets/resume.pdf");

  useEffect(() => {
    setSEO({
      title: "Resume | Your Name - Full Stack Developer",
      description:
        "View and download the professional resume of Your Name, a full stack MERN developer.",
      keywords:
        "Resume, CV, Full Stack Developer, MERN, React, Node.js, MongoDB",
    });
  }, []);

  return (
    <div className="space-y-12">
      <div className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">Resume</h1>
        <p className="text-gray-600 dark:text-gray-400">
          View or download my latest professional resume below.
        </p>
      </div>

      <div className="flex justify-center">
        <DownloadButton resumeUrl={resumeUrl} fileName="Your_Name_Resume.pdf" />
      </div>

      <ResumeViewer />
    </div>
  );
};

export default Resume;
