import { useEffect, useState } from "react";
import './cadastrar.css';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

export function Cadastrar() {
  const [termo, setTermo] = useState({});
  const [opcionais, setOpcionais] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTermos = async () => {
      try {
        const response = await fetch('http://localhost:3003/gettermo');
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }
        const data = await response.json();
        setTermo(data);
        setOpcionais(data.ter_opcionais); // Atualizado para usar data.ter_opcionais
      } catch (error) {
        console.error('Erro ao buscar termos:', error);
        setError(error.message);
      } finally {
        setIsLoading(false); // Mover para o finally para garantir que sempre será definido
      }
    };

    fetchTermos();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData.entries());
    data.termo_id = termo.ter_id;
    console.log(data);
    try {
      const response = await fetch('http://localhost:3003/cadastrar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage);
      }

      console.log('Usuário cadastrado com sucesso!');
      alert('cadastrado com sucesso')
      navigate("/");
    } catch (error) {
      console.error('Erro ao cadastrar usuário:', error);

    }
  };

  const abrirModal = () => {
    setIsModalOpen(true);
  };

  const fecharModal = () => {
    setIsModalOpen(false);
  };

  const formatarData = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, options);
  };

  if (isLoading) {
    return <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center', marginTop: 300
    }}>Carregando...</div>;
  }

  return (
    <div className="container-cadastrar">
      <form className="form-cadastrar" onSubmit={handleSubmit}>
        <h1 className="title-cadastrar">Cadastrar</h1>
        <input className="input-cadastrar" type="text" name="nome" required placeholder="Nome" />
        <input className="input-cadastrar" type="text" name="telefone" required placeholder="Telefone" />
        <input className="input-cadastrar" type="email" name="email" required placeholder="Email" />
        <input className="input-cadastrar" type="password" name="senha" required placeholder="Senha" />
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" style={{ cursor: 'pointer' }} name="termo" required />
          <p onClick={abrirModal} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Eu aceito os Termos de uso</p>
        </label>
        {opcionais.length > 0 && (
          opcionais.map((item) => (
            <label key={item.opc_id} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <input type="checkbox" style={{ cursor: 'pointer' }} name={"opc " + item.opc_id} />
              <p>{item.opc_texto}</p>
            </label>
          ))
        )}

        <button className="button-cadastrar" type="submit">Cadastrar</button>
        <br /><br />
        <Link className="signup-cadastrar" to="/">Já tem uma conta? Entrar</Link>

      </form>

      {isModalOpen && (
        <div className="modal" style={{ display: 'block' }}>
          <div className="modal-content">
            <span className="close" onClick={fecharModal}>&times;</span>
            <div>
              <h3>{termo.ter_texto}</h3>
              <p>Data do termo: {formatarData(termo.ter_data)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
