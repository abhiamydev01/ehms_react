import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { encryptRoute } from "./../components/routeEncryptor";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import ApiServices from "../utils/ApiServices";


function Signin() {
  const navigate = useNavigate();
  const [emailOrPhone, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!emailOrPhone) {
      setLoading(false);
      return toast.error("Please fill enter email");

    }
    if (!password) {
      setLoading(false);
      return toast.error("Please fill enter password");
    }

    const payload = {
      emailOrPhone: emailOrPhone,
      password: password,
    }
    try {
      const response = await ApiServices.signIn(payload);

      const data = response.data;
      console.log("Login response:", response);

      if (response.status && data.success) {



        if (data.role === "admin") {
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role);
          localStorage.setItem("userId", data.id);
          localStorage.setItem("name", data.name);
          localStorage.setItem("email", data.email);

          toast.success("Login successful ");
          navigate(`/${encryptRoute("dashboard")}`);
        } else {
          toast.error("Access denided.");
          setLoading(false);
        }
        // else if (data.role === "nurse") navigate("/dashboard/nurse/appointment");
        // else if (data.role === "doctor") navigate("/dashboard/doctor");
      } else {
        toast.error(data.message || "Invalid credentials");
        setLoading(false);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Try again!");
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-sky-200 to-white">
      <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-lg p-8 w-[430px] text-center border border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Welcome Back!</h2>
        <p className="text-gray-500 text-sm mt-1">Sign in to continue to EHMS.</p>

        <form className="mt-6 space-y-4" onSubmit={handleLogin}>
          <label className="block mb-1 text-sm text-left pl-1 font-medium text-gray-700">Email</label>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            value={emailOrPhone}
            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-sky-200 focus:outline-none text-sm"
          />

          <div className="relative">
            <label className="block mb-1 text-sm text-left pl-1 font-medium text-gray-700">Password</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-1 focus:ring-sky-200 focus:outline-none text-sm pr-10"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-sky-300 text-white rounded-lg font-medium border border-transparent hover:bg-transparent hover:border-sky-300 hover:text-sky-300 transition-all duration-300"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <div className="text-right">
            <a href="#" className="text-sm text-gray-500 hover:text-sky-500">Forgot password?</a>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Signin;
