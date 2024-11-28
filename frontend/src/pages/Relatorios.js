import React, { useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

const Relatorios = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [alunos, setAlunos] = useState([]);
  const [selectedAluno, setSelectedAluno] = useState(null);
  const [avaliacoes, setAvaliacoes] = useState([]);

  // Buscar alunos pelo nome
  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/alunos?nome_like=${searchTerm}`);
      setAlunos(response.data);
    } catch (error) {
      console.error("Erro ao buscar alunos:", error);
    }
  };

  // Buscar as avaliações do aluno selecionado
  const handleSelectAluno = async (aluno) => {
    try {
      setSelectedAluno(aluno);
      const response = await axios.get(`http://localhost:3000/avaliacoes?aluno_id=${aluno.id}`);
      const sortedAvaliacoes = response.data.sort((a, b) => new Date(b.data) - new Date(a.data));
      setAvaliacoes(sortedAvaliacoes.slice(0, 2)); // Pegando as duas últimas avaliações
    } catch (error) {
      console.error("Erro ao buscar avaliações:", error);
    }
  };

  // Gerar PDF comparativo
  const generatePDF = () => {
    if (avaliacoes.length < 2) {
      alert("É necessário ter pelo menos duas avaliações para gerar o relatório.");
      return;
    }

    const [ultima, penultima] = avaliacoes;

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Relatório de Avaliações - ${selectedAluno.nome}`, 10, 10);

    doc.setFontSize(12);
    doc.text("Última Avaliação:", 10, 30);
    doc.text(`Data: ${ultima.data}`, 10, 40);
    doc.text(`Peso: ${ultima.peso} kg`, 10, 50);
    doc.text(`IMC: ${ultima.imc}`, 10, 60);
    doc.text(`Percentual de Gordura: ${ultima.percentual_gordura} %`, 10, 70);
    doc.text(`Percentual de Massa Magra: ${ultima.percentual_massa_magra} %`, 10, 80);

    doc.text("Penúltima Avaliação:", 10, 100);
    doc.text(`Data: ${penultima.data}`, 10, 110);
    doc.text(`Peso: ${penultima.peso} kg`, 10, 120);
    doc.text(`IMC: ${penultima.imc}`, 10, 130);
    doc.text(`Percentual de Gordura: ${penultima.percentual_gordura} %`, 10, 140);
    doc.text(`Percentual de Massa Magra: ${penultima.percentual_massa_magra} %`, 10, 150);

    doc.text("Comparativo:", 10, 170);
    doc.text(`Diferença de Peso: ${(ultima.peso - penultima.peso).toFixed(2)} kg`, 10, 180);
    doc.text(
      `Diferença de IMC: ${(ultima.imc - penultima.imc).toFixed(2)}`,
      10,
      190
    );
    doc.text(
      `Diferença de Percentual de Gordura: ${(ultima.percentual_gordura - penultima.percentual_gordura).toFixed(2)} %`,
      10,
      200
    );
    doc.text(
      `Diferença de Percentual de Massa Magra: ${(ultima.percentual_massa_magra - penultima.percentual_massa_magra).toFixed(2)} %`,
      10,
      210
    );

    doc.save(`Relatorio_${selectedAluno.nome}.pdf`);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Relatórios</h2>
      <div style={styles.searchContainer}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar aluno por nome"
          style={styles.input}
        />
        <button onClick={handleSearch} style={styles.button}>
          Buscar
        </button>
      </div>
      {alunos.length > 0 && (
        <div style={styles.alunosList}>
          {alunos.map((aluno) => (
            <div
              key={aluno.id}
              onClick={() => handleSelectAluno(aluno)}
              style={styles.alunoItem}
            >
              {aluno.nome}
            </div>
          ))}
        </div>
      )}
      {selectedAluno && (
        <div style={styles.avaliacoesContainer}>
          <h3 style={styles.subtitle}>Avaliações de {selectedAluno.nome}</h3>
          {avaliacoes.length > 0 ? (
            <>
              {avaliacoes.map((avaliacao, index) => (
                <div key={avaliacao.id} style={styles.avaliacaoItem}>
                  <p>Avaliação {index + 1}</p>
                  <p>Data: {avaliacao.data}</p>
                  <p>Peso: {avaliacao.peso} kg</p>
                  <p>IMC: {avaliacao.imc}</p>
                  <p>Percentual de Gordura: {avaliacao.percentual_gordura} %</p>
                  <p>
                    Percentual de Massa Magra: {avaliacao.percentual_massa_magra} %
                  </p>
                </div>
              ))}
              <button onClick={generatePDF} style={styles.button}>
                Gerar PDF
              </button>
            </>
          ) : (
            <p>Nenhuma avaliação encontrada para este aluno.</p>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
    maxWidth: "800px",
    margin: "0 auto",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
  },
  searchContainer: {
    textAlign: "center",
    marginBottom: "20px",
  },
  input: {
    padding: "10px",
    width: "70%",
    borderRadius: "5px",
    border: "1px solid #ccc",
    marginRight: "10px",
  },
  button: {
    padding: "10px 20px",
    backgroundColor: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
  },
  alunosList: {
    marginBottom: "20px",
  },
  alunoItem: {
    padding: "10px",
    backgroundColor: "#f9f9f9",
    border: "1px solid #ddd",
    borderRadius: "5px",
    marginBottom: "10px",
    cursor: "pointer",
  },
  avaliacoesContainer: {
    marginTop: "20px",
  },
  subtitle: {
    marginBottom: "10px",
  },
  avaliacaoItem: {
    backgroundColor: "#f9f9f9",
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ddd",
    marginBottom: "10px",
  },
};

export default Relatorios;
