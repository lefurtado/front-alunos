import { useAlunos } from "./hooks/useAlunos";

function App() {
  const {
    alunos,
    isLoading,
    input,
    handleInput,
    createAlunoFn,
    deleteAlunoFn,
  } = useAlunos();

  // função que lida com o submit do formulário para criação de um aluno, recebe
  // data como parametro
  async function handleSubmit() {
    try {
      await createAlunoFn(input);
    } catch (err) {
      alert("Erro ao cadastrar aluno!");
    }
  }

  // função que lida com o delete do aluno que também recebe data como parametro
  async function handleDelete(id) {
    try {
      await deleteAlunoFn(id);
    } catch (err) {
      alert("Erro ao deletar aluno!");
    }
  }

  // caso o isLoading seja true, ou seja, ainda esteja carregando os dados
  // dos alunos, uma div com o conteúdo carregando é mostrado ao usuário
  if (isLoading) {
    return <div>Carregando...</div>;
  }

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
