import { Link } from "react-router-dom";

export function Buttonwarning({ label, buttonText, to }) {
  return (
    <div className="py-2 text-sm flex justify-center items-center">
      <div>{label}</div>
      <Link className="pointer underline pl-1 cursor-pointer text-blue-600 hover:text-blue-800" to={to}>
        {buttonText}
      </Link>
    </div>
  );
}
