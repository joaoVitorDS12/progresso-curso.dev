import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <h1>Banco de Dados</h1>
      <DatabaseInfo />
    </>
  );
}

function UpdatedAt() {
  // a KEY do fetchAPI é o primeiro paramêtro do useSWR
  const { data, isLoading } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let UpdatedAtText = "Carregando...";

  if (!isLoading && data) {
    UpdatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return (
    <>
      <div>Última atualização: {UpdatedAtText}</div>
    </>
  );
}

function DatabaseInfo() {
  const { data, isLoading } = useSWR("/api/v1/status", fetchAPI);

  let resolve = "Carregando...";

  if (!isLoading && data) {
    resolve = data.dependencies.database;
  }

  return (
    <>
      <pre>Conexões abertas: {resolve.opened_connections}</pre>
      <pre>Conexões disponíveis: {resolve.max_connections}</pre>
      <pre>Versão do PostgreSQL: {resolve.version}</pre>
    </>
  );
}
