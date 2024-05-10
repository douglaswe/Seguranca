import React from 'react';
import './cadastrar.css';
import { Link } from 'react-router-dom';

export function Cadastrar(){
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ email, senha });
  };

  return (
    <div className="container">
      <form className="form" onSubmit={handleSubmit}> 
       <h1 className="title">Cadastrar</h1>
        <input className="input" type="text" name="nome" required placeholder="Nome" />
        <input className="input" type="text" name="sobrenome" required placeholder="Sobrenome" />
        <input className="input" type="email" name="email" required placeholder="Email" />
        <input className="input" type="password" name="senha" required placeholder="Senha" />
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" name="allow" />
          Eu aceito os Termos de uso
        </label>
        <button className="button" type="submit">Cadastrar</button>
        <p className="signup-link"><Link to="/">Crie uma!</Link></p>
        <p >
          Já tem uma conta ? <a href="#">Login</a>
        </p>
      </form>
    </div>
  );
}


