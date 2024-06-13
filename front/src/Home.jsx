import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import './login.css';

export default function Home() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Função para buscar usuários da API
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3003/getusers');
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }
        const data = await response.json();
        setUsers(data);
        console.log(data)
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        setError(error.message);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="card">
        <br />
        <h1>Bem vindo</h1>
        <div>
        <h1>Lista de Usuários</h1>
<ul>
  {users.map(user => (
    <li key={user.usu_id}>
      <ul>
        <li>Nome: {user.usu_nome}</li>
        <li>Email: {user.usu_email}</li>
        <li>Telefone: {user.usu_telefone}</li>
        <li>{user.usu_senha}</li>
      </ul>
    </li>
  ))}
</ul>

        
        </div>
      </div>
    </div>
  );
}
