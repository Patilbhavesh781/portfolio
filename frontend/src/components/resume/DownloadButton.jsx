import Button from "../common/Button";

const DownloadButton = ({ resumeUrl, fileName = "Bhavesh_Patil_Resume.pdf" }) => {
  return (
    <a href={resumeUrl} download={fileName}>
      <Button size="md">Download Resume</Button>
    </a>
  );
};

export default DownloadButton;
