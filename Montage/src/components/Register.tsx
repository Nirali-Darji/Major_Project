import { useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

export default function Register() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div className="flex h-screen">
      {/* Left Side */}
      <div className="w-1/4 bg-[#011627] text-white p-10 flex flex-col justify-center">
        <h1 className="text-3xl font-bold mb-6">Montage</h1>
        <h2 className="text-2xl font-semibold">Get started for free</h2>
        <p className="mt-2">Only pay for what you need</p>

        <div className="mt-6 space-y-4">
          <Feature
            text="Get started fast"
            description="Start for free. Designing with Montage Studio is always free so you can sign up and get started without friction."
          />
          <Feature
            text="Access free design tools"
            description="Use our design tools to create the perfect design for your next home or ADU project!"
          />
          <Feature
            text="Trusted by industry leaders"
            description="Join our growing network of registered architects designing and developing projects with Montage Studio."
          />
        </div>
      </div>

      {/* Right Side */}
      <div className="w-3/4 flex justify-center items-center p-10">
        <div className="max-w-md w-full">
          <h2 className="text-3xl font-bold mb-6">Create your account</h2>

          <form className="space-y-4">
            <div className="flex space-x-4">
              <label className="flex items-center space-x-2">
                <input type="radio" name="accountType" defaultChecked />
                <span>Individual</span>
              </label>
              <label className="flex items-center space-x-2">
                <input type="radio" name="accountType" />
                <span>Business</span>
              </label>
            </div>

            <InputField label="Full name" type="text" />
            <InputField label="Email" type="email" />
            <InputField label="User name" type="text" />
            <InputField label="Password" type="password" />

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={isChecked}
                onChange={() => setIsChecked(!isChecked)}
              />
              <span>
                I agree to the Montage{" "}
                <a href="#" className="text-blue-500">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-500">
                  Privacy Policy
                </a>
                .
              </span>
            </label>

            <button
              type="submit"
              className={`w-full p-3 rounded-lg text-white ${
                isChecked
                  ? "bg-[#011627] hover:bg-gray-800"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
              disabled={!isChecked}
            >
              Create Account
            </button>

            <p className="text-center mt-4">
              Already have an account?
              <Link to="/login" className="text-blue-500">
                Log in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

function Feature({ text, description }: { text: string; description: string }) {
  return (
    <div className="flex items-start space-x-3">
      <FaCheckCircle className="text-blue-500" size={30} />
      <div>
        <h3 className="font-semibold">{text}</h3>
        <p className="text-sm text-gray-300">{description}</p>
      </div>
    </div>
  );
}

function InputField({ label, type }: { label: string; type: string }) {
  return (
    <div>
      <label className="block mb-1 font-medium">{label}</label>
      <input
        type={type}
        className="w-full p-2 border rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
    </div>
  );
}
