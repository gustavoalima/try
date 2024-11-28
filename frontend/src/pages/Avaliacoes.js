import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Avaliacoes = () => {
  const [searchTerm, setSearchTerm] = useState(""); // Texto da busca
  const [alunos, setAlunos] = useState([]); // Lista de alunos do banco
  const [filteredAlunos, setFilteredAlunos] = useState([]); // Lista de alunos filtrados
  const navigate = useNavigate(); // Navegação entre telas

  // Buscar alunos no banco de dados ao carregar o componente
  useEffect(() => {
    const fetchAlunos = async () => {
      try {
        const response = await fetch("http://localhost:3000/alunos");
        if (response.ok) {
          const data = await response.json();
          setAlunos(data);
          setFilteredAlunos(data);
        } else {
          console.error("Erro ao buscar alunos:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
      }
    };

    fetchAlunos();
  }, []);

  // Filtrar alunos com base no termo da busca
  const handleSearch = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (term.trim() === "") {
      setFilteredAlunos(alunos);
    } else {
      setFilteredAlunos(
        alunos.filter((aluno) =>
          aluno.nome.toLowerCase().includes(term.toLowerCase())
        )
      );
    }
  };

  // Lidar com a navegação para a tela de registro de avaliações
  const handleRegisterAvaliacao = (aluno) => {
    if (aluno.sexo === "Masculino") {
      navigate("/dashboard/avaliacao-masculina", {
        state: { alunoId: aluno.id, nome: aluno.nome, idade: aluno.idade },
      });
    } else if (aluno.sexo === "Feminino") {
      navigate("/dashboard/avaliacao-feminina", {
        state: { alunoId: aluno.id, nome: aluno.nome, idade: aluno.idade },
      });
    } else {
      alert("Gênero do aluno não reconhecido.");
    }
  };

  // Lidar com a navegação para visualizar as avaliações
  const handleViewAvaliacoes = (aluno) => {
    navigate("/dashboard/visualizar-avaliacoes", { state: { alunoId: aluno.id } });
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Avaliações</h2>
      <p style={styles.subtitle}>Busque pelo aluno para registrar ou consultar avaliações.</p>
      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Digite o nome do aluno"
          value={searchTerm}
          onChange={handleSearch}
          style={styles.searchInput}
        />
      </div>
      <div>
        <h3 style={styles.resultsTitle}>Resultados:</h3>
        {filteredAlunos.length > 0 ? (
          <ul style={styles.list}>
            {filteredAlunos.map((aluno) => (
              <li key={aluno.id} style={styles.listItem}>
                <span style={styles.listItemText}>{aluno.nome}</span>
                <span style={styles.listItemSubtext}>{aluno.sexo}</span>
                <div style={styles.buttonContainer}>
                  <button
                    style={styles.button}
                    onClick={() => handleRegisterAvaliacao(aluno)}
                  >
                    Registrar Avaliação
                  </button>
                  <button
                    style={{ ...styles.button, backgroundColor: "#7f8c8d" }}
                    onClick={() => handleViewAvaliacoes(aluno)}
                  >
                    Visualizar Avaliações
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p style={styles.noResults}>Nenhum aluno encontrado.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "700px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    fontFamily: "'Arial', sans-serif",
  },
  title: {
    textAlign: "center",
    fontSize: "24px",
    color: "#2c3e50",
    marginBottom: "10px",
  },
  subtitle: {
    textAlign: "center",
    fontSize: "14px",
    color: "#7f8c8d",
    marginBottom: "20px",
  },
  searchContainer: {
    marginBottom: "20px",
  },
  searchInput: {
    width: "100%",
    padding: "12px",
    border: "1px solid #ccc",
    borderRadius: "8px",
    fontSize: "16px",
  },
  resultsTitle: {
    fontSize: "18px",
    color: "#2c3e50",
    marginBottom: "10px",
  },
  list: {
    listStyleType: "none",
    padding: 0,
  },
  listItem: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "12px",
    borderBottom: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#fff",
    marginBottom: "10px",
    transition: "background-color 0.3s",
  },
  listItemText: {
    fontWeight: "bold",
    color: "#34495e",
  },
  listItemSubtext: {
    color: "#7f8c8d",
  },
  buttonContainer: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
  },
  button: {
    padding: "8px 12px",
    backgroundColor: "#2c3e50",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    fontSize: "14px",
  },
  noResults: {
    textAlign: "center",
    fontSize: "16px",
    color: "#e74c3c",
  },
};

export default Avaliacoes;
