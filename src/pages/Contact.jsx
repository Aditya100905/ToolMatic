import { useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Contact = ({ theme }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [result, setResult] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult("Sending...");

    const formDataObj = new FormData();
    formDataObj.append("name", formData.name);
    formDataObj.append("email", formData.email);
    formDataObj.append("message", formData.message);
    formDataObj.append("access_key", "6a5e8a69-3549-473b-b63a-b3eda73feb13");

    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formDataObj,
      });

      const data = await response.json();

      if (data.success) {
        toast.success("Message sent successfully!");
        setResult("Form Submitted Successfully");
        setFormData({ name: "", email: "", message: "" }); // Reset form after success
      } else {
        toast.error(`Error: ${data.message}`);
        setResult(data.message);
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      setResult("Failed to submit the form.");
    }
  };

  return (
    <div
      className={`mt-10 min-h-screen py-16 px-6 ${
        theme === "dark" ? "bg-[#121212] text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg leading-relaxed mb-6">
          Have a question or suggestion? Feel free to reach out to us!
        </p>

        <form
          onSubmit={handleSubmit}
          className={`p-6 rounded-lg shadow-lg ${
            theme === "dark" ? "bg-[#1a1a1a] text-white" : "bg-white text-black"
          }`}
        >
          <div className="mb-4">
            <label className="block text-left font-semibold mb-2">Name</label>
            <input
              type="text"
              name="name"
              placeholder="Enter Name"
              value={formData.name}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-400 ${
                theme === "dark"
                  ? "bg-[#222] text-white"
                  : "bg-white text-black"
              }`}
            />
          </div>

          <div className="mb-4">
            <label className="block text-left font-semibold mb-2">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter Email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-400 ${
                theme === "dark"
                  ? "bg-[#222] text-white"
                  : "bg-white text-black"
              }`}
            />
          </div>

          <div className="mb-4">
            <label className="block text-left font-semibold mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
              placeholder="Enter your Message"
              className={`w-full px-4 py-2 border rounded-lg focus:ring focus:ring-blue-400 ${
                theme === "dark"
                  ? "bg-[#222] text-white"
                  : "bg-white text-black"
              }`}
              rows="5"
            ></textarea>
          </div>

          <button
            type="submit"
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            Send Message
          </button>

          {/* {result && <p className="mt-4 text-sm">{result}</p>} */}
        </form>
      </div>
    </div>
  );
};

export default Contact;
