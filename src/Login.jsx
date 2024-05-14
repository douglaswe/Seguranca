import React from 'react';
import './login.css';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Cookies from "js-cookie"
import { Google } from './assets/google';

export function Login() {

  const navigate = useNavigate();
  const [isLoggedin, setIsLoggedin] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log({ email, password });
  };

  const handleClick = () => {
    const callbackUrl = `${window.location.origin}`;
    const googleClientId = 'colocar o id do cliente aqui';
    const targetUrl = `https://accounts.google.com/o/oauth2/auth?redirect_uri=${encodeURIComponent(
      callbackUrl
    )}&response_type=token&client_id=${googleClientId}&scope=openid%20email%20profile&prompt=select_account`;
    window.location.href = targetUrl;
  };

  useEffect(() => {
    const accessTokenRegex = /access_token=([^&]+)/;
    const isMatch = window.location.href.match(accessTokenRegex);

    if (isMatch) {
      const accessToken = isMatch[1];
      Cookies.set("access_token", accessToken);
      setIsLoggedin(true);
    }
  }, []);

  useEffect(() => {
    if (isLoggedin) {
      navigate("/home");
    }
  }, [isLoggedin, navigate]);


  return (
    <div className="container">
      <form className="form"  onSubmit={handleSubmit}>
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
        <div className="btn-container">
          <br />
          <button className="btn btn-primary" onClick={handleClick}>
            <Google />
            Entrar com o Google
          </button>
        </div>
        <Link className='signup-link' to="/cadastrar">Crie uma!</Link>
      </form>
    </div>
  );
}

