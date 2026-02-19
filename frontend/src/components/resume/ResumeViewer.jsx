const ResumeViewer = ({ resumeUrl }) => {
  if (!resumeUrl) {
    return (
      <p className="text-center text-red-600">
        Resume is not available right now.
      </p>
    );
  }

  return (
    <div className="w-full h-[80vh] border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden shadow">
      <iframe
        src={resumeUrl}
        title="Resume Viewer"
        className="w-full h-full"
      />
    </div>
  );
};

export default ResumeViewer;
