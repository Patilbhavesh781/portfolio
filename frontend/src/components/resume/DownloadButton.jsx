import Button from "../common/Button";

const DownloadButton = ({ resumeUrl, fileName = "My_Resume.pdf" }) => {
  return (
    <a href={resumeUrl} download={fileName}>
      <Button size="md">Download Resume</Button>
    </a>
  );
};

export default DownloadButton;
