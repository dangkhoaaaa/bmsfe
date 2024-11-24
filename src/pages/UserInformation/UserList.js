import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "https://bms-fs-api.azurewebsites.net/api/User/GetListUser",
          {
            params: { status: "active", pageIndex: 1, pageSize: 10 },
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.isSuccess) {
          setUsers(response.data.data.data);
        } else {
          setError("Failed to fetch users.");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="user-list-container">
      <h1>User List</h1>
      <table className="user-table">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>
                <img
                  src={user.avatar || "https://via.placeholder.com/50"}
                  alt={`${user.firstName} ${user.lastName}`}
                  className="user-avatar"
                />
              </td>
              <td>{`${user.firstName} ${user.lastName}`}</td>
              <td>{user.email}</td>
              <td>{user.phone}</td>
              <td>
                {/* Pass the `id` in the URL */}
                <button onClick={() => navigate(`/user/${user.id}`)}>
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserList;
