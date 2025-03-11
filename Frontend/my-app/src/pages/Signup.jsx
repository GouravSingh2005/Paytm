import { Buttonwarning } from "../components/Buttonwarning";
import {ButtonComponent} from "../components/ButtonComponent"
import { Heading } from "../components/Heading";
import { SubHeading } from "../components/SubHeading";
import { InputBox } from "../components/InputBox";




export const Signup=()=>{
return <div className="bg-slate-300 h-screen flex justify-center">
<div className="flex flex-col justify-center">
<div className="rounded-lg bg-white w-80 text-center p-2 h-max px-4">
<Heading label={"Signup"}/>
<SubHeading label={"Enter your information to create an account"}/>
<InputBox placeholder="john" label={"First Name"}/>
<InputBox placeholder="Doe" label={"Last Name"}/>
<InputBox placeholder="Gourav@gmail.com" label={"Email"}/>
<InputBox placeholder="123456" label={"Password"}/>
<div className="pt-4">
<ButtonComponent label={"Signup"}/>
</div>
<Buttonwarning label={"Already have an account"} buttonText={"Sign in"} to={"/Signin"}/>
</div>
</div>
</div>
}
