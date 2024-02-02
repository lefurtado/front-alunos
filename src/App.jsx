import { useState } from "react";
import api from "./services/api.js";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function App() {
  // criado instancia do queryClient para utilização posterior
  const queryClient = useQueryClient();
  // state que segura o estado dos inputs
  const [input, setInput] = useState({
    nome: "",
    cpf: "",
  });

  // função que faz a chamada na API para trazer os dados dos alunos
  // que existem no bando de dados
  const fetchData = async () => {
    try {
      // metodo que faz com que a resposta retorne os dados da API
      const res = await api.get();
      return res.data;
    } catch (error) {
      throw new Error("Erro ao carregar dados do servidor!");
    }
  };

  // função que faz a chamada na API para criação de um aluno no banco de dados
  const createAluno = async () => {
    try {
      // método post para criação do aluno no DB
      const res = await api.post("/", input);
      return res.data;
    } catch (error) {
      throw new Error("Erro ao carregar dados do servidor!");
    }
  };

  // função que faz a chamada na API para exclusão de um aluno e recebe
  // como parâmetro o id desse aluno
  const deleteAluno = async (id) => {
    try {
      // executa o método delete do axio mandando pra URL o ID do aluno
      // que está sendo recebido como parâmetro da função
      const res = await api.delete(`/${id}`);
      return res.data;
    } catch (err) {
      alert("Erro ao deletar aluno!");
    }
  };

  // função que lida com o submit do formulário para criação de um aluno, recebe
  // data como parametro
  async function handleSubmit(data) {
    try {
      await createAlunoFn({
        name: data.nome,
        cpf: data.cpf,
      });
    } catch (err) {
      alert("Erro ao cadastrar aluno!");
    }
  }

  // função que lida com o delete do aluno que também recebe data como parametro
  async function handleDelete(data) {
    try {
      await deleteAlunoFn(data);
    } catch (err) {
      alert("Erro ao deletar aluno!");
    }
  }

  // chamada do useQuery para mostrar os dados em
  // tela sem precisar usar useState, utilizando a "queryKey"
  // é possível armazenar um estado HTTP que ficará escutando essa key
  // por toda a aplicação
  const { data: alunos, isLoading } = useQuery({
    queryKey: ["alunos"],
    // a "queryFn" é utilizada pra fazer a chamada da função que fará o
    // fetch dos dados que serão mostrados
    queryFn: fetchData,
  });

  // o hook useMutation serve para criação, alteração e exclusão de algum
  // item no banco de dados, essa lista que vem do banco de dados
  // irá alterar e será necessário fazer alteração em tempo real
  // na tela para mostrar a tabela atualizada
  const { mutateAsync: createAlunoFn } = useMutation({
    mutationFn: createAluno,
  });

  // o uso do useMutation aqui vem em conjunto com a função "onSuccess"
  // que serve pra atualizar a query assim que o aluno for deletado do db,
  // ela escuta a queryKey criada pelo useQuery e reexecuta uma chamada
  // fetch para mostrar os dados atualizados apenas quando a função
  // deleteAluno for executada
  const { mutateAsync: deleteAlunoFn } = useMutation({
    mutationFn: deleteAluno,
    onSuccess() {
      queryClient.invalidateQueries(["alunos"]);
    },
  });

  // caso o isLoading seja true, ou seja, ainda esteja carregando os dados
  // dos alunos, uma div com o conteúdo carregando é mostrado ao usuário
  if (isLoading) {
    return <div>Carregando...</div>;
  }

  // trata o input
  const handleInput = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

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
          {alunos?.map((aluno) => (
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
