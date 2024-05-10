import React, { useState } from 'react';
import './login.css';
import { Link } from 'react-router-dom';

export function Login(){
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}>
        <h1 className="title">Login</h1>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="input"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Senha"
          required
          className="input"
        />
        <button type="submit" className="button">Entrar</button>
        <Link className='signup-link' to="/cadastrar">Crie uma!</Link>
      </form>
    </div>
  );
}

