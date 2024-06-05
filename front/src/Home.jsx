import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import './login.css';

export default function Home() {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({});

  const getUserDetails = async (accessToken) => {
    const response = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`
    );
    const data = await response.json();
    setUserDetails(data);
  };

  useEffect(() => {
    const accessToken = Cookies.get("access_token");

    if (!accessToken) {
      navigate("/");
    }

    getUserDetails(accessToken);
  }, [navigate]);


  const handleLogout = () => {
    // Remover o token de acesso dos cookies
    Cookies.remove("access_token");
    // Redirecionar o usuário de volta para a página de login
    navigate("/");
  };

  return (
    <>
      {userDetails ? (
        <div style={{display:'flex', alignItems:'center', justifyContent:'center'}}>
          <div className="card">
            <br />
            <h1>Bem vindo</h1>
            <br />
            <br />
            <img
              src={userDetails.picture}
              alt={`${userDetails.given_name} perfil`}
              className="perfil"
            />
            <br />
            <br />
            <p className="nome">{userDetails.name}</p>
            <br />
            <br />
            <p className="email">{userDetails.email}</p>
            <br />
            <br />
            <button className="button" onClick={handleLogout}>Sair</button>

          </div>
        </div>
      ) : (
        <div>
          <h1>Carregando...</h1>
        </div>
      )}
    </>
  );
}

