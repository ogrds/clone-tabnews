import useSWR from "swr";

const useStatus = () => {
  return useSWR("/api/v1/status", fetchAPI, {
    refreshInterval: 2000,
  });
};

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

function StatusPage() {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
      <DatabaseStatus />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useStatus();
  console.log("Status data:", data);

  let updatedAtText = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");
  }

  return <div>Ultima atualização: {updatedAtText}</div>;
}

function DatabaseStatus() {
  const { isLoading, data } = useStatus();

  if (isLoading) {
    return (
      <>
        <hr />
        <div>Carregando...</div>
      </>
    );
  }

  return (
    <div>
      <hr />
      <h2>Database</h2>
      <div>Versão: {data.dependencies.database.version}</div>
      <div>
        Conexões Abertas: {data.dependencies.database.opened_connections}
      </div>
      <div>Conexões Máximas: {data.dependencies.database.max_connections}</div>
    </div>
  );
}

export default StatusPage;
