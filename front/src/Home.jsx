import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import axios from "axios";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-toastify";
import "./login.css";

export default function Home() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = Cookies.get("token");
        if (!token) {
          throw new Error("Usuário não autenticado");
        }

        const response = await fetch("http://localhost:3003/getuser", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.error("Erro ao buscar usuário:", error);
        setError(error.message);
      }
    };

    fetchUser();
  }, []);

  const handleEdit = (user) => {
    setEditingUser(user);
    setIsModalOpen(true);
  };
/*
  const handleDelete = async () => {
    try {
      const response = await axios.delete(`http://localhost:3003/${user.id}`);
      setUser(null);
      toast.success(response.data);
    } catch (error) {
      toast.error(error.response.data);
    }
    setEditingUser(null);
  };*/

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://localhost:3003/updateuser/${editingUser.usu_id}`, 
        {
          nome: editingUser.usu_nome,
          email: editingUser.usu_email,
          telefone: editingUser.usu_telefone,
          senha: editingUser.usu_senha, 
        }
      );
      setUser(response.data); 
      setEditingUser(null);
      setIsModalOpen(false);
      toast.success("Usuário atualizado com sucesso!");
    } catch (error) {
      toast.error("Erro ao atualizar usuário.");
    }
  };

  const handleLogout = () => {
    Cookies.remove("token", { sameSite: 'None', secure: true });
    navigate("/");
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  if (error) {
    return <div>Erro: {error}</div>;
  }

  return (
    <>
      {user ? (
        <>
          <h1 style={{ alignItems: 'center', justifyContent: 'center', display: 'flex', marginTop: 20 }}>Meus dados</h1>
          <table className="table">
            <thead className="thead">
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th className="only-web">Telefone</th>
                <th></th>
                <th></th>
              </tr>
            </thead>
            <tbody className="tbody">
              <tr>
                <td className="fixed-width">{user.usu_nome}</td>
                <td className="fixed-width">{user.usu_email}</td>
                <td className="fixed-width-20 only-web">{user.usu_telefone}</td>
                <td className="align-center fixed-width-5">
                  <FaEdit onClick={() => handleEdit(user)} />
                </td>
              {/*  <td className="align-center fixed-width-5">
                  <FaTrash onClick={handleDelete} />
                </td>*/}
              </tr>
            </tbody>
          </table>
          <button className="button-sair" onClick={handleLogout}>
            Sair
          </button>
          {isModalOpen && (
            <div className="modal" style={{ display: 'block' }}>
              <div className="modal-content">
                <span className="close" onClick={closeModal}>&times;</span>
                <h2>Editar</h2>
                <form onSubmit={handleUpdateUser}>
                  <label>
                    Nome:
                    <input
                      type="text"
                      value={editingUser.usu_nome}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, usu_nome: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Email:
                    <input
                      type="email"
                      value={editingUser.usu_email}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, usu_email: e.target.value })
                      }
                    />
                  </label>
                  <label>
                    Telefone:
                    <input
                      type="text"
                      value={editingUser.usu_telefone}
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, usu_telefone: e.target.value })
                      }
                    />
                  </label>
                  <button type="submit">Salvar</button>
                </form>
              </div>
            </div>
          )}
        </>
      ) : (
        <div>Carregando...</div>
      )}
    </>
  );
}
