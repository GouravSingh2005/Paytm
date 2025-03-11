import { Buttonwarning } from "../components/Buttonwarning";
import { ButtonComponent } from "../components/ButtonComponent";
import { Heading } from "../components/Heading";
import { InputBox } from "../components/InputBox";
import { SubHeading } from "../components/SubHeading";



export const Signin = () => {
  return (
    <div className="bg-slate-300 min-h-screen flex justify-center items-center">
      <div className="rounded-lg bg-white w-80 text-center p-4 shadow-lg">
        <Heading label="Sign in" />
        <SubHeading label="Enter your credentials to access your account" />
        <InputBox placeholder="Enter your email" label="Email" />
        <InputBox placeholder="Enter your password" label="Password" type="password" />
        <div className="pt-4">
          <ButtonComponent label="Sign in" />
        </div>
        <div className="pt-2">
          <Buttonwarning label="Don't have an account?" buttonText="Sign up" to="/signup" />
        </div>
      </div>
    </div>
  );
};
