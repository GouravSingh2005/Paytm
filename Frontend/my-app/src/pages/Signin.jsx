import { useNavigate } from "react-router-dom";
import { Buttonwarning } from "../components/Buttonwarning";
import { ButtonComponent } from "../components/ButtonComponent";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";
import { useEffect, useState } from "react";
import axios from "axios";

export const Signin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(""); // State for handling errors
  const navigate = useNavigate();

  // ✅ Use env variable
  const SERVER_URL = "http://localhost:3001";

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (userToken) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSignin = async () => {
    setError(""); // Clear previous errors

    if (!email.trim() || !password.trim()) {
      setError("Email and password are required!");
      return;
    }

    try {
      const response = await axios.post(`${SERVER_URL}/api/v1/user/signin`, {
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Sign-in failed. Try again.");
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center items-center">
      <div className="rounded-lg bg-white w-80 text-center p-6 shadow-md">
        <Heading label="Sign in" />
        <SubHeading label="Enter your credentials to access your account" />

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <InputBox
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          label="Email"
          value={email}
        />
        <InputBox
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          label="Password"
          type="password"
          value={password}
        />
        <div className="pt-4">
          <ButtonComponent onClick={handleSignin} label="Sign in" />
        </div>
        <Buttonwarning
          label="Don't have an account?"
          buttonText="Sign up"
          to="/signup"
        />
      </div>
    </div>
  );
};
