import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import jsPDF from "jspdf";
import "jspdf-autotable";

const VisualizarAvaliacoes = () => {
  const { state } = useLocation();
  const alunoId = state?.alunoId;

  const [avaliacoes, setAvaliacoes] = useState([]);
  const [ultimaAvaliacao, setUltimaAvaliacao] = useState(null);
  const [penultimaAvaliacao, setPenultimaAvaliacao] = useState(null);

  useEffect(() => {
    const fetchAvaliacoes = async () => {
      try {
        const response = await fetch(`http://localhost:3000/avaliacoes/${alunoId}`);
        if (response.ok) {
          const data = await response.json();
          const sortedAvaliacoes = data.sort(
            (a, b) => new Date(b.data_avaliacao) - new Date(a.data_avaliacao)
          );
          setAvaliacoes(sortedAvaliacoes);
          setUltimaAvaliacao(sortedAvaliacoes[0]);
          setPenultimaAvaliacao(sortedAvaliacoes[1]);
        } else {
          console.error("Erro ao buscar avaliações:", response.statusText);
        }
      } catch (error) {
        console.error("Erro ao conectar com o servidor:", error);
      }
    };

    fetchAvaliacoes();
  }, [alunoId]);

  const calculateDifference = (ultima, penultima) => {
    const diff = ultima - penultima;
    const arrow = diff > 0 ? "⬆" : diff < 0 ? "⬇" : "⬅";
    return `${diff.toFixed(2)} ${arrow}`;
  };

  const generatePDF = () => {
    if (!ultimaAvaliacao || !penultimaAvaliacao) {
      alert("É necessário ter pelo menos duas avaliações para gerar o PDF.");
      return;
    }

    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Relatório de Avaliações", 20, 20);

    doc.setFontSize(12);
    doc.text("Detalhes das duas últimas avaliações:", 20, 30);
    doc.autoTable({
      startY: 35,
      head: [["Campo", "Última Avaliação", "Penúltima Avaliação"]],
      body: [
        ["Data e Hora", 
         new Date(ultimaAvaliacao.data_avaliacao).toLocaleString(),
         new Date(penultimaAvaliacao.data_avaliacao).toLocaleString()],
        ["Peso (kg)", ultimaAvaliacao.peso, penultimaAvaliacao.peso],
        ["Altura (cm)", ultimaAvaliacao.altura, penultimaAvaliacao.altura],
        ["Peitoral (mm)", ultimaAvaliacao.peitoral, penultimaAvaliacao.peitoral],
        ["Axilar Média (mm)", ultimaAvaliacao.axilar_media, penultimaAvaliacao.axilar_media],
        ["Tríceps (mm)", ultimaAvaliacao.triceps, penultimaAvaliacao.triceps],
        ["Subescapular (mm)", ultimaAvaliacao.subescapular, penultimaAvaliacao.subescapular],
        ["Abdômen (mm)", ultimaAvaliacao.abdomen, penultimaAvaliacao.abdomen],
        ["Supra-ilíaca (mm)", ultimaAvaliacao.supra_iliaca, penultimaAvaliacao.supra_iliaca],
        ["Coxa (mm)", ultimaAvaliacao.coxa, penultimaAvaliacao.coxa],
        ["IMC", ultimaAvaliacao.imc, penultimaAvaliacao.imc],
        ["Percentual de Gordura (%)", ultimaAvaliacao.percentual_gordura, penultimaAvaliacao.percentual_gordura],
        ["Percentual de Massa Magra (%)", ultimaAvaliacao.percentual_massa_magra, penultimaAvaliacao.percentual_massa_magra],
        ["Massa Gordura (kg)", ultimaAvaliacao.massa_gordura_kg, penultimaAvaliacao.massa_gordura_kg],
        ["Massa Magra (kg)", ultimaAvaliacao.massa_magra_kg, penultimaAvaliacao.massa_magra_kg],
      ],
    });

    doc.text("Comparativo entre as últimas avaliações:", 20, doc.lastAutoTable.finalY + 10);
    doc.autoTable({
      startY: doc.lastAutoTable.finalY + 15,
      head: [["Campo", "Penúltima Avaliação", "Última Avaliação", "Diferença"]],
      body: [
        ["Peso (kg)", penultimaAvaliacao.peso, ultimaAvaliacao.peso, calculateDifference(ultimaAvaliacao.peso, penultimaAvaliacao.peso)],
        ["Altura (cm)", penultimaAvaliacao.altura, ultimaAvaliacao.altura, calculateDifference(ultimaAvaliacao.altura, penultimaAvaliacao.altura)],
        ["Peitoral (mm)", penultimaAvaliacao.peitoral, ultimaAvaliacao.peitoral, calculateDifference(ultimaAvaliacao.peitoral, penultimaAvaliacao.peitoral)],
        ["Axilar Média (mm)", penultimaAvaliacao.axilar_media, ultimaAvaliacao.axilar_media, calculateDifference(ultimaAvaliacao.axilar_media, penultimaAvaliacao.axilar_media)],
        ["Tríceps (mm)", penultimaAvaliacao.triceps, ultimaAvaliacao.triceps, calculateDifference(ultimaAvaliacao.triceps, penultimaAvaliacao.triceps)],
        ["Subescapular (mm)", penultimaAvaliacao.subescapular, ultimaAvaliacao.subescapular, calculateDifference(ultimaAvaliacao.subescapular, penultimaAvaliacao.subescapular)],
        ["Abdômen (mm)", penultimaAvaliacao.abdomen, ultimaAvaliacao.abdomen, calculateDifference(ultimaAvaliacao.abdomen, penultimaAvaliacao.abdomen)],
        ["Supra-ilíaca (mm)", penultimaAvaliacao.supra_iliaca, ultimaAvaliacao.supra_iliaca, calculateDifference(ultimaAvaliacao.supra_iliaca, penultimaAvaliacao.supra_iliaca)],
        ["Coxa (mm)", penultimaAvaliacao.coxa, ultimaAvaliacao.coxa, calculateDifference(ultimaAvaliacao.coxa, penultimaAvaliacao.coxa)],
        ["IMC", penultimaAvaliacao.imc, ultimaAvaliacao.imc, calculateDifference(ultimaAvaliacao.imc, penultimaAvaliacao.imc)],
        ["Percentual de Gordura (%)", penultimaAvaliacao.percentual_gordura, ultimaAvaliacao.percentual_gordura, calculateDifference(ultimaAvaliacao.percentual_gordura, penultimaAvaliacao.percentual_gordura)],
        ["Percentual de Massa Magra (%)", penultimaAvaliacao.percentual_massa_magra, ultimaAvaliacao.percentual_massa_magra, calculateDifference(ultimaAvaliacao.percentual_massa_magra, penultimaAvaliacao.percentual_massa_magra)],
      ],
    });

    doc.save(`avaliacoes_aluno_${alunoId}.pdf`);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Avaliações do Aluno</h2>

      {ultimaAvaliacao && penultimaAvaliacao ? (
        <div style={styles.comparisonContainer}>
          <h3 style={styles.comparisonTitle}>Comparativo das Últimas Avaliações</h3>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Métrica</th>
                <th style={styles.th}>Última Avaliação ({new Date(ultimaAvaliacao.data_avaliacao).toLocaleString()})</th>
                <th style={styles.th}>Penúltima Avaliação ({new Date(penultimaAvaliacao.data_avaliacao).toLocaleString()})</th>
                <th style={styles.th}>Diferença</th>
              </tr>
            </thead>
            <tbody>
              {[
                { label: "Peso (kg)", ultima: ultimaAvaliacao.peso, penultima: penultimaAvaliacao.peso },
                { label: "Altura (cm)", ultima: ultimaAvaliacao.altura, penultima: penultimaAvaliacao.altura },
                { label: "Peitoral (mm)", ultima: ultimaAvaliacao.peitoral, penultima: penultimaAvaliacao.peitoral },
                { label: "Axilar Média (mm)", ultima: ultimaAvaliacao.axilar_media, penultima: penultimaAvaliacao.axilar_media },
                { label: "Tríceps (mm)", ultima: ultimaAvaliacao.triceps, penultima: penultimaAvaliacao.triceps },
                { label: "Subescapular (mm)", ultima: ultimaAvaliacao.subescapular, penultima: penultimaAvaliacao.subescapular },
                { label: "Abdômen (mm)", ultima: ultimaAvaliacao.abdomen, penultima: penultimaAvaliacao.abdomen },
                { label: "Supra-ilíaca (mm)", ultima: ultimaAvaliacao.supra_iliaca, penultima: penultimaAvaliacao.supra_iliaca },
                { label: "Coxa (mm)", ultima: ultimaAvaliacao.coxa, penultima: penultimaAvaliacao.coxa },
                { label: "IMC", ultima: ultimaAvaliacao.imc, penultima: penultimaAvaliacao.imc },
                { label: "Percentual de Gordura (%)", ultima: ultimaAvaliacao.percentual_gordura, penultima: penultimaAvaliacao.percentual_gordura },
                { label: "Percentual de Massa Magra (%)", ultima: ultimaAvaliacao.percentual_massa_magra, penultima: penultimaAvaliacao.percentual_massa_magra },
              ].map((row, index) => (
                <tr key={index}>
                  <td style={styles.td}>{row.label}</td>
                  <td style={styles.td}>{row.ultima}</td>
                  <td style={styles.td}>{row.penultima}</td>
                  <td style={styles.td}>{calculateDifference(row.ultima, row.penultima)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p style={styles.message}>
          {avaliacoes.length === 1
            ? "Apenas uma avaliação registrada. Adicione mais uma para comparação."
            : "Nenhuma avaliação registrada para este aluno."}
        </p>
      )}

      <h3 style={styles.subtitle}>Todas as Avaliações</h3>
      {avaliacoes.length > 0 ? (
        <ul style={styles.list}>
          {avaliacoes.map((avaliacao) => (
            <li
              key={avaliacao.id}
              style={styles.listItem}
            >
              <p><strong>Data e Hora:</strong> {new Date(avaliacao.data_avaliacao).toLocaleString()}</p>
              <p><strong>Peso:</strong> {avaliacao.peso} kg</p>
              <p><strong>Altura:</strong> {avaliacao.altura} cm</p>
              <p><strong>IMC:</strong> {avaliacao.imc} ({avaliacao.classificacao_imc})</p>
              <p><strong>Percentual de Gordura:</strong> {avaliacao.percentual_gordura}%</p>
              <p><strong>Percentual de Massa Magra:</strong> {avaliacao.percentual_massa_magra}%</p>
              <p><strong>Massa Gordura:</strong> {avaliacao.massa_gordura_kg} kg</p>
              <p><strong>Massa Magra:</strong> {avaliacao.massa_magra_kg} kg</p>
            </li>
          ))}
        </ul>
      ) : (
        <p style={styles.message}>Nenhuma avaliação encontrada.</p>
      )}

      <button style={styles.button} onClick={generatePDF}>
        Gerar PDF
      </button>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    fontFamily: "'Arial', sans-serif",
    maxWidth: "800px",
    margin: "0 auto",
  },
  title: {
    textAlign: "center",
    marginBottom: "20px",
    fontSize: "24px",
    color: "#2c3e50",
  },
  comparisonContainer: {
    marginBottom: "30px",
  },
  comparisonTitle: {
    fontSize: "20px",
    fontWeight: "bold",
    marginBottom: "10px",
    color: "#16a085",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginBottom: "20px",
  },
  th: {
    border: "1px solid #ddd",
    padding: "10px",
    backgroundColor: "#e5e8e8",
    textAlign: "center",
    fontWeight: "bold",
    color: "#34495e",
  },
  td: {
    border: "1px solid #ddd",
    padding: "8px",
    textAlign: "center",
    color: "#2c3e50",
  },
  subtitle: {
    fontSize: "18px",
    marginBottom: "10px",
    fontWeight: "bold",
    color: "#2c3e50",
  },
  list: {
    listStyle: "none",
    padding: 0,
  },
  listItem: {
    marginBottom: "15px",
    padding: "15px",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
  },
  message: {
    textAlign: "center",
    fontSize: "16px",
    color: "#e74c3c",
  },
  button: {
    display: "block",
    margin: "20px auto",
    padding: "12px 20px",
    fontSize: "16px",
    color: "#ffffff",
    backgroundColor: "#16a085",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s",
  },
};

export default VisualizarAvaliacoes;
