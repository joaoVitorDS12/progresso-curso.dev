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
      <StatusPageInfos />
    </>
  );
}

function StatusPageInfos() {
  // a KEY do fetchAPI é o primeiro paramêtro do useSWR
  const { data, isLoading } = useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });

  let Loading = "Carregando...";
  let UpdatedAtText = Loading;
  let Dependencies = Loading;

  if (!isLoading && data) {
    UpdatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  if (!isLoading && data) {
    Dependencies = JSON.stringify(data.dependencies.database, null, 2);
  }

  return (
    <>
      <div>Última atualização: {UpdatedAtText}</div>
      <h1>Banco de Dados</h1>
      <pre>{Dependencies}</pre>
    </>
  );
}
