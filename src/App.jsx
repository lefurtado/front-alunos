import { useState, useEffect } from "react";
import api from "./services/api.js";

function App() {
  const [alunos, setAlunos] = useState([]);
  const [input, setInput] = useState({
    nome: "",
    cpf: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get();
        setAlunos(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  const handleInput = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/", input);
      console.log("Novo aluno adicionado: ", res.data);
      setAlunos([...alunos, res.data]);
      setInput({ nome: "", cpf: "" });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/${id}`);
      setAlunos(alunos.filter((aluno) => aluno._id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  if (!alunos) return <div>Loading...</div>;

  return (
    <div className="flex items-center justify-center h-screen text-center">
      <div>
        <form onSubmit={handleSubmit}>
          <div className="flex flex-col items-center gap-2 border p-2 rounded-md">
            <input
              onChange={handleInput}
              className="w-full h-10 rounded-sm p-3"
              type="text"
              name="nome"
              placeholder="Nome"
            />
            <input
              onChange={handleInput}
              className="w-full h-10 rounded-sm p-3"
              type="text"
              name="cpf"
              placeholder="CPF"
            />
            <button
              className="border rounded-lg p-2 bg-slate-600 w-fit"
              type="submit"
            >
              Enviar
            </button>
          </div>
        </form>
        <div className="flex gap-4">
          {alunos.map((aluno) => (
            <ul key={aluno._id}>
              <li>Nome: {aluno.nome}</li>
              <li>CPF: {aluno.cpf}</li>
              <button
                onClick={() => handleDelete(aluno._id)}
                className="border rounded-lg p-1 bg-slate-600"
              >
                excluir
              </button>
            </ul>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
