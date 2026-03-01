const toEmbeddableResumeUrl = (url) => {
  if (!url) return url;

  try {
    const parsed = new URL(url);

    // Google Drive: convert shared/view links to preview link for iframe
    if (parsed.hostname.includes("drive.google.com")) {
      const pathMatch = parsed.pathname.match(/\/file\/d\/([^/]+)/);
      const queryId = parsed.searchParams.get("id");
      const fileId = pathMatch?.[1] || queryId;

      if (fileId) {
        return `https://drive.google.com/file/d/${fileId}/preview`;
      }
    }

    // Dropbox: convert share links to raw file links
    if (parsed.hostname.includes("dropbox.com")) {
      parsed.searchParams.delete("dl");
      parsed.searchParams.set("raw", "1");
      return parsed.toString();
    }
  } catch (error) {
    // Non-absolute URLs (like /assets/...) are valid as-is
    return url;
  }

  return url;
};

const ResumeViewer = ({ resumeUrl }) => {
  if (!resumeUrl) {
    return (
      <p className="text-center text-red-600">
        Resume is not available right now.
      </p>
    );
  }

  const embeddableUrl = toEmbeddableResumeUrl(resumeUrl);

  return (
    <div className="w-full h-[80vh] border border-gray-300 dark:border-gray-700 rounded-xl overflow-hidden shadow">
      <iframe
        src={embeddableUrl}
        title="Resume Viewer"
        className="w-full h-full"
      />
    </div>
  );
};

export default ResumeViewer;
