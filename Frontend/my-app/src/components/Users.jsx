import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export const Users = () => {
  const [users, setUsers] = useState([]);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`http://localhost:3000/api/v1/user/bulk?filter=${filter}`)
      .then((response) => {
        setUsers(response.data.users);
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
      });
  }, [filter]);

  return (
    <>
      <div className="font-bold mt-6 text-lg">Users</div>
      <div className="mt-4 mb-10">
        <input
          onChange={(e) => setFilter(e.target.value)}
          type="text"
          placeholder="Search users..."
          className="w-full px-2 py-1 border rounded border-slate-200"
        />
      </div>

      <div>
        {users.map((user) => (
          <UserComponent key={user._id || user.firstName} user={user} navigate={navigate} />
        ))}
      </div>
    </>
  );
};

const UserComponent = ({ user, navigate }) => {
  return (
    <div className="flex justify-between p-4 border-b">
      <div className="flex items-center">
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center items-center text-xl font-bold mr-2">
          {user.firstName ? user.firstName[0]?.toUpperCase() : "?"}
        </div>
        <div>
          <div>{user.firstName} {user.lastName}</div>
        </div>
      </div>

      <div className="flex items-center">
        <button
          onClick={() => navigate(`/send?id=${user._id}&name=${user.firstName}`)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Send Money
        </button>
      </div>
    </div>
  );
};
