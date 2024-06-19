import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./login.css";

export default function Home() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {

    const fetchUsers = async () => {
      try {
        const response = await fetch("http://localhost:3003/getusers");
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
        setError(error.message);
      }
    };

    fetchUsers();
  }, []);

  // Função para lidar com o logout
  const handleLogout = () => {
    Cookies.remove("token", { sameSite: 'None', secure: true });
    navigate("/");
  };

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div className="card">
        <br />
        <h1>Bem vindo</h1>
        <div>
          <h1>Lista de Usuários</h1>
          <ul>
            {users.map((user) => (
              <li key={user.usu_id}>
                <ul>
                  <li>Email: {user.usu_email}</li>
                </ul>
              </li>
            ))}
          </ul>
          <button className="button-sair" onClick={handleLogout}>
            Sair
          </button>
        </div>
      </div>
    </div>
  );
}
