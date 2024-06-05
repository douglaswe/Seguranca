import React from 'react';
import './cadastrar.css';
import { Link } from 'react-router-dom';

export function Cadastrar(){
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ email, senha });
  };

  return (
    <div className="container-cadastrar">
      <form className="form-cadastrar" onSubmit={handleSubmit}> 
       <h1 className="title-cadastrar">Cadastrar</h1>
        <input className="input-cadastrar" type="text" name="nome" required placeholder="Nome" />
        <input className="input-cadastrar" type="text" name="sobrenome" required placeholder="Sobrenome" />
        <input className="input-cadastrar" type="email" name="email" required placeholder="Email" />
        <input className="input-cadastrar" type="password" name="senha" required placeholder="Senha" />
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" style={{cursor:'pointer'}} name="allow" />
          <Link to="/termos">Eu aceito os Termos de uso</Link> 
        </label>
        <button className="button-cadastrar" type="submit">Cadastrar</button>
        <Link className="signup-cadastrar" to="/">Já tem uma conta? Entrar</Link>
      </form>
    </div>
  );
}


