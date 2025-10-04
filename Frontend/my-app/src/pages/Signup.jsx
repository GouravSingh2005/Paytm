import { useEffect, useState } from "react";
import { Buttonwarning } from "../components/Buttonwarning.jsx";
import { ButtonComponent } from "../components/ButtonComponent.jsx";
import { Heading } from "../components/Heading.jsx";
import { InputBox } from "../components/InputBox.jsx";
import { SubHeading } from "../components/SubHeading.jsx";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Signup = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // ✅ Use env variable
  const SERVER_URL =  import.meta.env.VITE_SERVER_URL;

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (userToken) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSignup = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post(`${SERVER_URL}/api/v1/user/signup`, {
        username,
        firstName,
        lastName,
        email,
        password,
      });

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed. Try again.");
      console.error("Signup error:", err);
    }

    setLoading(false);
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign up"} />
          <SubHeading label={"Enter your information to create an account"} />

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <InputBox
            name="firstName"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            label={"First Name"}
          />
          <InputBox
            name="lastName"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            label={"Last Name"}
          />
          <InputBox
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="your_username"
            label={"Username"}
          />
          <InputBox
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="example@gmail.com"
            label={"Email"}
          />
          <InputBox
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            label={"Password"}
            type="password"
          />

          <div className="pt-4">
            <ButtonComponent
              onClick={handleSignup}
              label={loading ? "Signing up..." : "Sign up"}
              disabled={loading}
            />
          </div>

          <Buttonwarning
            label={"Already have an account?"}
            buttonText={"Sign in"}
            to={"/signin"}
          />
        </div>
      </div>
    </div>
  );
};
