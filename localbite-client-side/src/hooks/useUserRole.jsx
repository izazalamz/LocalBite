import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

const useUserRole = () => {
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);
  const email = user?.email;

  useEffect(() => {
    if (!email) return;

    const fetchRole = async () => {
      try {
        const res = await axios.get(
          `http://localhost:3000/users/role/${email}`
        );

        setRole(res.data.role);
      } catch (error) {
        console.error("Failed to fetch user role:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRole();
  }, [email]);

  return { role, loading };
};

export default useUserRole;
