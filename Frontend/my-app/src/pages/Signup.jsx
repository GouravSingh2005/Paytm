import { useState } from "react";
import { Buttonwarning } from "../components/Buttonwarning";
import { ButtonComponent } from "../components/ButtonComponent";
import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading";
import { InputBox } from "../components/InputBox";
import axios from "axios";

export const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/user/signup",
        formData
      );

      localStorage.setItem("token", response.data.token);
      alert("Signup successful!");
    } catch (error) {
      console.error("Signup failed:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Signup failed. Try again.");
    }
  };

  return (
    <div className="bg-slate-300 h-screen flex justify-center">
      <div className="flex flex-col justify-center">
        <div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
          <Heading label={"Signup"} />
          <SubHeading label={"Enter your information to create an account"} />
          
          <InputBox 
            placeholder="John" 
            label="First Name" 
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
          />
          
          <InputBox 
            placeholder="Doe" 
            label="Last Name" 
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
          />
          
          <InputBox 
            placeholder="Gourav@gmail.com" 
            label="Email" 
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          
          <InputBox 
            placeholder="123456" 
            label="Password" 
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
          />
          
          <div className="pt-4">
            <ButtonComponent label={"Signup"} onClick={handleSignup} />
          </div>
          
          <Buttonwarning label={"Already have an account"} buttonText={"Sign in"} to={"/Signin"} />
        </div>
      </div>
    </div>
  );
};
