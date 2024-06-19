import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:3003/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ usu_email: email, usu_senha: password }),
      });
      
      const data = await response.json();
      console.log("Resposta do servidor:", data);

      if (response.ok) {
        localStorage.setItem("token", data.token);
        setMessage("Login successful");
        navigate("/home");
      } else {
        setMessage(data.error || "Login failed");
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setMessage("Login failed");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/home");
    }
  }, [navigate]);

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1 className="title">Login</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          className="input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          className="input"
        />
        <button type="submit" className="button">
          Entrar
        </button>
        {message && <p>{message}</p>}
        <Link className="signup-link" to="/cadastrar">
          Crie uma!
        </Link>
      </form>
    </div>
  );
}
