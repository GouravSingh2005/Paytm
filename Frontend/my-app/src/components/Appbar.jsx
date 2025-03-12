import { useEffect, useState } from "react";
import axios from "axios";
import { ButtonComponent } from "./ButtonComponent";
import { Link, useNavigate } from "react-router-dom";

export const Appbar = () => {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const userToken = localStorage.getItem("token");

        if (!userToken) {
            navigate("/Signin");
        } else {
            axios
                .get(`${import.meta.env.VITE_SERVER_URL}/api/v1/user/getUser`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                    },
                })
                .then((response) => {
                    setUser(response.data);
                })
                .catch((error) => {
                    console.error("Error fetching user:", error);
                    localStorage.removeItem("token");
                    navigate("/Signin");
                });
        }
    }, [navigate]);

    const signoutHandler = () => {
        localStorage.removeItem("token");
        navigate("/Signin");
    };

    return (
        <div className="shadow h-14 flex justify-between items-center md:px-10">
            <Link to="/dashboard">
                <div className="flex flex-col justify-center h-full ml-4 font-bold">
                    PAYTM APP
                </div>
            </Link>

            <div className="flex items-center justify-center gap-2">
                <ButtonComponent label="Sign out" onClick={signoutHandler} />
                <div className="flex flex-col justify-center h-full text-xl">
                    {user?.firstName}
                </div>
                <div className="rounded-full h-10 w-10 p-4 bg-slate-200 flex justify-center mr-2">
                    <div className="flex flex-col justify-center h-full text-xl">
                        {user?.firstName?.[0]?.toUpperCase() || "?"}
                    </div>
                </div>
            </div>
        </div>
    );
};
