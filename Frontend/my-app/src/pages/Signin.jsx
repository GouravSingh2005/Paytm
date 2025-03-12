import { useNavigate } from "react-router-dom";
import { Buttonwarning} from "../components/Buttonwarning"; // Keep this as per your structure
import { ButtonComponent} from "../components/ButtonComponent"; // Keep this as per your structure
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

  useEffect(() => {
    const userToken = localStorage.getItem("token");
    if (userToken) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSignin = async () => {
    setError(""); // Clear previous error
    try {
      const response = await axios.post(
        import.meta.env.VITE_SERVER_URL + "/api/v1/user/signin",
        { email, password }
      );

      localStorage.setItem("token", response.data.token);
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Sign-in failed. Try again.");
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Sign in"} />
          <SubHeading label={"Enter your credentials to access your account"} />
          
          {error && <p className="text-red-500 text-sm">{error}</p>} {/* Show error if exists */}

          <InputBox
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            label={"Email"}
          />
          <InputBox
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            label={"Password"}
            type="password"
          />
          <div className="pt-4">
            <ButtonComponent onClick={handleSignin} label={"Sign in"} />
          </div>
          <Buttonwarning
            label={"Don't have an account?"}
            buttonText={"Sign up"}
            to={"/signup"}
          />
        </div>
      </div>
    </div>
  );
};
