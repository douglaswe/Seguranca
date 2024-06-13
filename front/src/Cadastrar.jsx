import { useEffect, useState } from "react";
import './cadastrar.css';
import { Link } from 'react-router-dom';

export function Cadastrar() {
 
    const handleSubmit = async (event) => {
      event.preventDefault();
      const formData = new FormData(event.target);
      const data = Object.fromEntries(formData.entries());
  
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
          // Aqui você pode redirecionar para outra página ou mostrar uma mensagem de sucesso
      } catch (error) {
          console.error('Erro ao cadastrar usuário:', error);
          // Tratar erro e mostrar mensagem adequada para o usuário
      }
  };
  

  const [termos, setTermos] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchTermos = async () => {
      try {
        const response = await fetch('http://localhost:3003/gettermo');
        if (!response.ok) {
          const errorMessage = await response.text();
          throw new Error(errorMessage);
        }
        const data = await response.json();
        setTermos(data);
        console.log(data);
      } catch (error) {
        console.error('Erro ao buscar termos:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTermos();
  }, []);
  
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

  const primeiroTermo = termos.length > 0 ? termos[0] : null;
  
  return (
    <div className="container-cadastrar">
      <form className="form-cadastrar" onSubmit={handleSubmit}>
        <h1 className="title-cadastrar">Cadastrar</h1>
        <input className="input-cadastrar" type="text" name="nome" required placeholder="Nome" />
        <input className="input-cadastrar" type="text" name="telefone" required placeholder="Telefone" />
        <input className="input-cadastrar" type="email" name="email" required placeholder="Email" />
        <input className="input-cadastrar" type="password" name="senha" required placeholder="Senha" />
        <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <input type="checkbox" style={{ cursor: 'pointer' }} name="allow" required />
          <p onClick={abrirModal} style={{ cursor: 'pointer', textDecoration: 'underline' }}>Eu aceito os Termos de uso</p>
        </label>

        {!isLoading && primeiroTermo && (
          <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <input type="checkbox" style={{ cursor: 'pointer' }} name="termo" required />
            <p>{primeiroTermo.opc_texto}</p>
          </label>
        )}

        <button className="button-cadastrar" type="submit">Cadastrar</button>
        <Link className="signup-cadastrar" to="/">Já tem uma conta? Entrar</Link>
      </form>

      {isModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={fecharModal}>&times;</span>
            <div>
              {termos.length > 0 ? termos.map((item) => (
                <div key={item.ter_id}>
                  <h3>{item.ter_texto}</h3>
                  <p>Data do termo: {formatarData(item.ter_data)}</p>
                </div>
              )) : error && <p className="error">{error}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
