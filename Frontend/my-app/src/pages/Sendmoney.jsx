import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { useEffect, useState } from "react";

export const SendMoney = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id");
  const name = searchParams.get("name");
  const [amount, setAmount] = useState("");

  useEffect(() => {
    const userToken = localStorage.getItem("token");

    
    if (!userToken) {
      navigate("/signin");
    }
  }, [navigate]);

  const handleTransfer = async () => {
    try {
      const SERVER_URL = import.meta.env.VITE_SERVER_URL || "http://localhost:3000";
      const token = localStorage.getItem("token");

      if (!token) {
        alert("Session expired. Please log in again.");
        navigate("/signin");
        return;
      }

      
      const transferAmount = Number(amount);
      if (transferAmount <= 0 || isNaN(transferAmount)) {
        alert("Please enter a valid amount.");
        return;
      }

      const res = await axios.post(
        `${SERVER_URL}/api/v1/account/transfer`,
        { to: id, amount: transferAmount },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      navigate(`/paymentstatus?message=${encodeURIComponent(res?.data.message)}`);
    } catch (error) {
      console.error("Transaction Error:", error);

      if (error?.response?.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("token");
        navigate("/signin");
      } else {
        alert(error?.response?.data?.message || "Transaction failed. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="h-full flex flex-col justify-center">
        <div className="border h-min text-card-foreground max-w-md p-4 space-y-8 w-96 bg-white shadow-lg rounded-lg">
          <div className="flex flex-col p-6">
            <h2 className="text-3xl font-bold text-center">Send Money</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 rounded-full bg-green-500 flex items-center justify-center">
                <span className="text-2xl text-white">
                  {name && name.length > 0 && name[0].toUpperCase()}
                </span>
              </div>
              <h3 className="text-2xl font-semibold">{name}</h3>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Amount (in Rs)</label>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  placeholder="Enter amount"
                />
              </div>
              <button
                onClick={handleTransfer}
                className="justify-center rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 w-full bg-green-500 text-white"
              >
                Initiate Transfer
              </button>
              <button
                onClick={() => navigate("/dashboard")}
                className="justify-center rounded-md text-sm font-medium transition-colors h-10 px-4 py-2 w-full bg-red-500 text-white"
              >
                Cancel & Go Back
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
