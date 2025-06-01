import Button from "./Button";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

type UserType = {
  firstName: string;
  lastName: string;
  username: string;
  password?: string;
  _id: string;
};

export const Users = () => {
  const [users, setUsers] = useState<UserType[]>([]);
  const [filter, setFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/user/bulk?filter=${filter}`,
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
        setUsers(response.data.users);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const timer = setTimeout(fetchData, 500);
    return () => {
      clearTimeout(timer);
    };
  }, [filter]);

  return (
    <>
      <div className="text-lg font-bold text-black mt-6">Users</div>

      <div className="my-2">
        <input
          onChange={(e) => setFilter(e.target.value)}
          placeholder="Search Users...."
          className="w-full px-2 py-1 border rounded border-slate-200 text-slate-500"
        />
      </div>

      <div>
        {users.map((user) => (
          <User key={user._id} user={user} navigate={navigate} />
        ))}
      </div>
    </>
  );
};

function User({
  user,
  navigate,
}: {
  user: UserType;
  navigate: ReturnType<typeof useNavigate>;
}) {
  return (
    <div className="flex justify-between my-2 p-2 border rounded-md">
      <div className="flex">
        <div className="rounded-full h-12 w-12 bg-slate-200 flex justify-center items-center mr-2 text-xl">
          {user.firstName[0]}
        </div>
        <div className="flex flex-col justify-center">
          <div>
            {user.firstName} {user.lastName}
          </div>
        </div>
      </div>

      <div className="flex items-center">
        <Button
          onClick={() =>
            navigate(`/send?id=${user._id}&name=${user.firstName}`)
          }
          buttonText={"Send Money"}
        />
      </div>
    </div>
  );
}
