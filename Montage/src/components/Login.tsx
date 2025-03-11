import { useNavigate } from "react-router-dom";
export default function Login() {

    const navigate = useNavigate();
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="w-full max-w-md p-8">
          <h2 className="text-3xl font-semibold text-center mb-6">Sign In</h2>
          <form>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2" htmlFor="username">
                User name or email
              </label>
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2" htmlFor="password">
                Password
              </label>
              <input
                type="password"
                className="w-full p-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-[#011627] text-white py-2 rounded-lg hover:bg-gray-800"
              
            >                                                                           
              Sign In
            </button>
            <div className="flex justify-center items-center my-4">
              <span className="text-gray-500">Trouble Signing In?</span>
            </div>
            <div className="flex items-center justify-center">
              <hr className="w-1/4 border-gray-300" />
              <span className="mx-2 text-gray-500">OR</span>
              <hr className="w-1/4 border-gray-300" />
            </div>
            <button
              type="button"
              className="w-full mt-4 bg-gray-200 text-black py-2 rounded hover:bg-gray-300"
              onClick={() => navigate("/register")}
            >
              Create an Account
            </button>
          </form>
          <footer className="text-center mt-8 text-gray-500 text-sm">
            <p>Collective Assembly © 2025</p>
            <div className="flex justify-center space-x-4 mt-2">
              <a href="#" className="hover:underline">Privacy & Legal</a>
              <a href="#" className="hover:underline">Contact</a>
              <a href="#" className="hover:underline">Careers</a>
              <a href="#" className="hover:underline">Partners</a>
              <a href="#" className="hover:underline">Store</a>
            </div>
          </footer>
        </div>
      </div>
    );
  }
  