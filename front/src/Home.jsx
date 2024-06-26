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
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [termo, setTermo] = useState(null);

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

        const termoResponse = await axios.get(
          `http://localhost:3003/gettermo/${data.usu_id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setTermo(termoResponse.data);
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

  const handleDelete = async () => {
    try {
      const response = await axios.delete(
        `http://localhost:3003/deleteuser/${user.usu_id}`
      );
      setUser(null);
      toast.success(response.data.message);
      handleLogout();
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const handleLogout = () => {
    Cookies.remove("token", { sameSite: "None", secure: true });
    navigate("/");
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openDeleteModal = () => {
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
  };

  if (error) {
    return <div>Erro: {error}</div>;
  }

  const formatarData = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  return (
    <>
      {user ? (
        <>
          <h1
            style={{
              alignItems: "center",
              justifyContent: "center",
              display: "flex",
              marginTop: 20,
            }}
          >
            Meus dados
          </h1>
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
                  <FaEdit style={{cursor:"pointer"}} onClick={() => handleEdit(user)} />
                </td>
                <td className="align-center fixed-width-5">
                  <FaTrash style={{cursor:"pointer"}} onClick={openDeleteModal} />
                </td>
              </tr>
            </tbody>
          </table>
          <button className="button-sair" onClick={handleLogout}>
            Sair
          </button>

          {termo && (
            <div className="termo-details">
              <h2>Detalhes dos Termos</h2>
              <p>Versão: {termo.ter_versao}</p>
              <p>Data do termo: {formatarData(termo.ter_data)}</p>
              <p>{termo.ter_texto}</p>
              <h3>Termos opcionais:</h3>
              <ul>
                {termo.ter_opcionais.map((opcional) => (
                  <li key={opcional.opc_id}>
                    {opcional.opc_texto} -{" "}
                    {opcional.opc_aceitado ? "Aceito" : "Não Aceito"}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {isModalOpen && (
            <div className="modal" style={{ display: "block" }}>
              <div className="modal-content">
                <span className="close" onClick={closeModal}>
                  &times;
                </span>
                <h2>Editar</h2>
                <form onSubmit={handleUpdateUser}>
                  <label>
                    Nome:
                    <input
                      type="text"
                      value={editingUser.usu_nome}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          usu_nome: e.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    Email:
                    <input
                      type="email"
                      value={editingUser.usu_email}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          usu_email: e.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    Telefone:
                    <input
                      type="text"
                      value={editingUser.usu_telefone}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          usu_telefone: e.target.value,
                        })
                      }
                    />
                  </label>
                  <label>
                    Senha:
                    <input
                      type="password"
                      value={editingUser.usu_senha}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          usu_senha: e.target.value,
                        })
                      }
                    />
                  </label>
                  <button type="submit">Salvar</button>
                </form>
              </div>
            </div>
          )}

          {isDeleteModalOpen && (
            <div className="modal" style={{ display: "block" }}>
              <div className="modal-delete">
                <h2>Confirmar Exclusão</h2>
                <p>Você realmente deseja apagar a conta?</p>
                <button className="button" onClick={handleDelete}>
                  Sim
                </button>
                <button className="button" onClick={closeDeleteModal}>
                  Não
                </button>
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
