import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AppBar from "../components/AppBar";
import Balance from "../components/Balance";
import { Users } from "../components/User";

export default function Dashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ firstName: string; lastName: string } | null>(null);
  const [balance, setBalance] = useState(0);

  const fetchData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        };

       
        const userResponse = await axios.get("http://localhost:3000/api/v1/user/me", { headers });
        setUser(userResponse.data.user);

        
        const balanceResponse = await axios.get("http://localhost:3000/api/v1/account/balance", { headers });
        setBalance(balanceResponse.data.balance);
      } catch (error) {
        console.error("Failed to fetch data", error);
        navigate("/signin");
      }
    };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/signin");
      return;
    }
    fetchData();
  }, [navigate]);

  if (!user) return <div>Loading...</div>;

  return (
    <div className="flex justify-center px-4 py-4 min-h-screen">
      <div className="flex flex-col w-full">
        <AppBar name={`${user.firstName} ${user.lastName}`} />
        <div className="mt-4 justify-between">
          <Balance balance={balance} />
        </div>
        <div className="mt-4">
          <Users />
        </div>
      </div>
    </div>
  );
}
