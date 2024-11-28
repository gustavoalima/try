import React, { useState, useEffect } from "react";

const Alunos = () => {
  const [formData, setFormData] = useState({
    nome: "",
    cep: "",
    endereco: "",
    dataNascimento: "",
    idade: "",
    sexo: "",
  });
  const [alunos, setAlunos] = useState([]);
  const [searchTerm, setSearchTerm] = useState(""); // Termo de busca
  const [filteredAlunos, setFilteredAlunos] = useState([]);
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchAlunos();
  }, []);

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

  const handleSearch = () => {
    if (!searchTerm) {
      setFilteredAlunos(alunos);
    } else {
      setFilteredAlunos(
        alunos.filter((aluno) =>
          aluno.nome.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === "cep" && value.length === 8) {
      fetch(`https://viacep.com.br/ws/${value}/json/`)
        .then((response) => response.json())
        .then((data) => {
          if (!data.erro) {
            setFormData((prev) => ({
              ...prev,
              endereco: `${data.logradouro}, `,
            }));
          } else {
            alert("CEP não encontrado.");
          }
        })
        .catch((err) => console.error("Erro ao buscar o CEP:", err));
    }

    if (name === "dataNascimento") {
      const hoje = new Date();
      const nascimento = new Date(value);
      const idade =
        hoje.getFullYear() -
        nascimento.getFullYear() -
        (hoje < new Date(hoje.getFullYear(), nascimento.getMonth(), nascimento.getDate()) ? 1 : 0);
      setFormData((prev) => ({ ...prev, idade: idade > 0 ? idade : "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.nome || !formData.cep || !formData.endereco || !formData.dataNascimento || !formData.idade || !formData.sexo) {
      alert("Todos os campos são obrigatórios!");
      return;
    }

    try {
      const method = editingId ? "PUT" : "POST";
      const url = editingId ? `http://localhost:3000/alunos/${editingId}` : "http://localhost:3000/alunos";

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nome: formData.nome,
          cep: formData.cep,
          endereco: formData.endereco,
          data_nascimento: formData.dataNascimento,
          idade: formData.idade,
          sexo: formData.sexo,
        }),
      });

      if (response.ok) {
        alert(editingId ? "Aluno atualizado com sucesso!" : "Aluno cadastrado com sucesso!");
        setFormData({
          nome: "",
          cep: "",
          endereco: "",
          dataNascimento: "",
          idade: "",
          sexo: "",
        });
        setEditingId(null);
        fetchAlunos();
      } else {
        const errorData = await response.json();
        alert(`Erro ao salvar aluno: ${errorData.error}`);
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
      alert("Erro ao salvar aluno.");
    }
  };

  const handleEdit = (aluno) => {
    setEditingId(aluno.id);
    setFormData({
      nome: aluno.nome,
      cep: aluno.cep,
      endereco: aluno.endereco,
      dataNascimento: aluno.data_nascimento,
      idade: aluno.idade,
      sexo: aluno.sexo,
    });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Tem certeza que deseja excluir este aluno?")) return;

    try {
      const response = await fetch(`http://localhost:3000/alunos/${id}`, { method: "DELETE" });
      if (response.ok) {
        alert("Aluno excluído com sucesso!");
        fetchAlunos();
      } else {
        alert("Erro ao excluir aluno.");
      }
    } catch (error) {
      console.error("Erro ao conectar com o servidor:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Gestão de Alunos</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        {[
          { label: "Nome", name: "nome", type: "text", placeholder: "Digite o nome do aluno" },
          { label: "CEP", name: "cep", type: "text", placeholder: "Digite o CEP" },
          { label: "Endereço", name: "endereco", type: "text", placeholder: "Endereço será preenchido automaticamente" },
          { label: "Data de Nascimento", name: "dataNascimento", type: "date", placeholder: "Digite a data de nascimento" },
          { label: "Idade", name: "idade", type: "text", placeholder: "Idade será calculada automaticamente", readOnly: true },
          { label: "Sexo", name: "sexo", type: "select" },
        ].map(({ label, name, type, placeholder, readOnly }) => (
          <div key={name} style={styles.inputContainer}>
            <label style={styles.label}>{label}:</label>
            {type === "select" ? (
              <select
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                style={styles.input}
              >
                <option value="">Selecione o sexo</option>
                <option value="Masculino">Masculino</option>
                <option value="Feminino">Feminino</option>
                <option value="Outro">Outro</option>
              </select>
            ) : (
              <input
                type={type}
                name={name}
                value={formData[name]}
                onChange={handleInputChange}
                placeholder={placeholder}
                readOnly={readOnly}
                style={styles.input}
              />
            )}
          </div>
        ))}
        <button type="submit" style={styles.button}>
          {editingId ? "Atualizar Aluno" : "Cadastrar Aluno"}
        </button>
      </form>

      <div style={styles.searchContainer}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar aluno por nome"
          style={styles.input}
        />
        <button onClick={handleSearch} style={{ ...styles.button, marginTop: "10px" }}>
          Buscar
        </button>
      </div>

      <div style={styles.listContainer}>
        <h3 style={styles.subtitle}>Alunos Cadastrados</h3>
        {filteredAlunos.length > 0 ? (
          <table style={styles.table}>
            <thead>
              <tr>
                {["Nome", "Endereço", "Idade", "Sexo", "Ações"].map((header) => (
                  <th key={header} style={styles.tableHeader}>
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredAlunos.map((aluno) => (
                <tr key={aluno.id}>
                  <td style={styles.tableCell}>{aluno.nome}</td>
                  <td style={styles.tableCell}>{aluno.endereco}</td>
                  <td style={styles.tableCell}>{aluno.idade}</td>
                  <td style={styles.tableCell}>{aluno.sexo}</td>
                  <td style={styles.tableCell}>
                    <button onClick={() => handleEdit(aluno)} style={styles.editButton}>
                      Editar
                    </button>
                    <button onClick={() => handleDelete(aluno.id)} style={styles.deleteButton}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p style={styles.noResults}>Nenhum aluno encontrado.</p>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: { padding: "20px", fontFamily: "Arial, sans-serif" },
  title: { textAlign: "center", marginBottom: "20px", color: "#333" },
  form: { maxWidth: "600px", margin: "0 auto", padding: "20px", backgroundColor: "#f9f9f9", borderRadius: "10px" },
  inputContainer: { marginBottom: "15px" },
  label: { display: "block", marginBottom: "5px", color: "#333" },
  input: { width: "100%", padding: "10px", border: "1px solid #ccc", borderRadius: "5px" },
  button: { width: "100%", padding: "10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px", cursor: "pointer" },
  searchContainer: { maxWidth: "400px", margin: "20px auto", textAlign: "center" },
  listContainer: { maxWidth: "800px", margin: "20px auto" },
  subtitle: { marginBottom: "10px", color: "#333", textAlign: "center" },
  table: { width: "100%", borderCollapse: "collapse" },
  tableHeader: { padding: "10px", backgroundColor: "#f0f0f0", textAlign: "left", borderBottom: "1px solid #ccc" },
  tableCell: { padding: "10px", borderBottom: "1px solid #ccc" },
  editButton: { marginRight: "10px", padding: "5px 10px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: "5px" },
  deleteButton: { padding: "5px 10px", backgroundColor: "#e74c3c", color: "#fff", border: "none", borderRadius: "5px" },
  noResults: { textAlign: "center", color: "#666" },
};

export default Alunos;
