import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <UpdatedAt />
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
      <h1>Status</h1>
      <div>Última atualização: {UpdatedAtText}</div>
    </>
  );
}

function DatabaseInfo() {
  const { data, isLoading } = useSWR("/api/v1/status", fetchAPI);

  let databaseStatusInformation = "Carregando...";

  if (!isLoading && data) {
    databaseStatusInformation = (
      <>
        <div>
          Conexões abertas: {data.dependencies.database.opened_connections}
        </div>
        <div>
          Conexões disponíveis: {data.dependencies.database.max_connections}
        </div>
        <div>Versão do PostgreSQL: {data.dependencies.database.version}</div>
      </>
    );
    return (
      <>
        <h1>Database</h1>
        <pre>{databaseStatusInformation}</pre>
      </>
    );
  }
}
