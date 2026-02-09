import { useEffect, useState } from "react";
import api from "../../services/api";
import Loader from "../common/Loader";

const Testimonials = () => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const response = await api.get("/testimonials");
        setTestimonials(response.data);
      } catch (err) {
        setError("Failed to load testimonials.");
      } finally {
        setLoading(false);
      }
    };

    fetchTestimonials();
  }, []);

  if (loading) return <Loader text="Loading testimonials..." />;
  if (error) return <p className="text-center text-red-600">{error}</p>;

  return (
    <section className="py-20 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900 dark:text-gray-100 mb-12">
          What People Say
        </h2>

        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial._id}
              className="p-6 bg-gray-100 dark:bg-gray-800 rounded-xl shadow hover:shadow-md transition"
            >
              <p className="text-gray-700 dark:text-gray-300 italic mb-4">
                “{testimonial.message}”
              </p>
              <div className="flex items-center space-x-4">
                {testimonial.avatar && (
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold text-gray-900 dark:text-gray-100">
                    {testimonial.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
