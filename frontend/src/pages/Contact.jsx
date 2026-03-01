import { useEffect } from "react";
import ContactForm from "../components/contact/ContactForm";
import ContactInfo from "../components/contact/ContactInfo";
import ScrollReveal from "../components/common/ScrollReveal";
import { setSEO } from "../utils/seo";

const Contact = () => {
  useEffect(() => {
    setSEO({
      title: "Contact | Bhavesh Patil - Full Stack Developer",
      description:
        "Get in touch with Bhavesh Patil for freelance work, job opportunities, collaborations, or technical consulting.",
      keywords:
        "Contact, Hire Developer, Freelance Developer, MERN Stack Developer, Software Engineer",
    });
  }, []);

  return (
    <div className="space-y-16">
      <ScrollReveal>
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-4">Contact Me</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Have a project in mind or just want to say hello? I'd love to hear from you.
          </p>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.06}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <ContactInfo />
          <ContactForm />
        </div>
      </ScrollReveal>
    </div>
  );
};

export default Contact;
