import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MoreVertical } from "lucide-react";

export default function Signout() {
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    function signout() {
        localStorage.removeItem("token");
        navigate("/signin");
    }

    function toggleMenu() {
        setMenuOpen(!menuOpen);
    }

    return (
        <div className="relative">
            {/* Three Dot Icon */}
            <button onClick={toggleMenu} className="p-2 bg-slate-500 rounded-md text-white">
                <MoreVertical size={24} />
            </button>

            {/* Dropdown Menu */}
            {menuOpen && (
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-50">
                    <button
                        onClick={signout}
                        className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-slate-100 rounded-md"
                    >
                        Sign Out
                    </button>
                </div>
            )}
        </div>
    );
}
