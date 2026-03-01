import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../common/Loader";
import Button from "../common/Button";

const Certifications = () => {
  const [certifications, setCertifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewCert, setPreviewCert] = useState(null);

  useEffect(() => {
    const fetchCertifications = async () => {
      try {
        const response = await api.get("/certifications");
        setCertifications(response.data?.data || []);
      } catch (err) {
        setError("Failed to load certifications.");
      } finally {
        setLoading(false);
      }
    };

    fetchCertifications();
  }, []);

  if (loading) return <Loader text="Loading certifications..." />;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <>
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
            Certifications
          </h2>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((cert) => (
              <div
                key={cert._id}
                className="p-6 bg-white dark:bg-gray-900 rounded-xl shadow hover:shadow-md transition"
              >
                {(cert.logo?.url || cert.logo) && (
                  <button
                    type="button"
                    onClick={() => setPreviewCert(cert)}
                    title="Preview certificate"
                    className="mb-3"
                  >
                    <img
                      src={cert.logo?.url || cert.logo}
                      alt={cert.title}
                      className="w-12 h-12 object-contain"
                    />
                  </button>
                )}

                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                  {cert.title}
                </h3>

                <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-1">
                  {cert.organization}
                </p>

                <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                  Issued:{" "}
                  {cert.issueDate
                    ? new Date(cert.issueDate).toLocaleDateString()
                    : "N/A"}
                </p>

                {cert.expirationDate && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                    Expires: {new Date(cert.expirationDate).toLocaleDateString()}
                  </p>
                )}

                {(cert.credentialId || cert.credentialUrl) && (
                  <div className="mt-3 flex items-center justify-between gap-3">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Credential: {cert.credentialId || "Available"}
                    </p>
                    {cert.credentialUrl && (
                      <a
                        href={cert.credentialUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="sm">View Certificate</Button>
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {previewCert && (
        <div
          className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
          onClick={() => setPreviewCert(null)}
        >
          <div
            className="relative bg-white dark:bg-gray-900 rounded-xl p-4 max-w-3xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewCert(null)}
              className="absolute top-3 right-3 text-gray-700 dark:text-gray-300"
            >
              Close
            </button>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {previewCert.title}
            </h3>
            {(previewCert.logo?.url || previewCert.logo) && (
              <img
                src={previewCert.logo?.url || previewCert.logo}
                alt={previewCert.title}
                className="w-full max-h-[75vh] object-contain rounded-lg"
              />
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Certifications;
