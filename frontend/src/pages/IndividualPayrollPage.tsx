import { Link, useParams } from "react-router-dom";
import IndividualPayrollCard from "../components/payroll/IndividualPayrollCard";
import useFolhaIndividual from "../hooks/useFolhaIndividual";

function IndividualPayrollContent({ matricula }: { matricula: string }) {
  const { folha, error } = useFolhaIndividual(matricula);
  if (error) return <p role="alert">{error}</p>;
  if (!folha) return <p role="status">Carregando folha individual…</p>;
  return (
    <>
          <button className="print-button" onClick={() => window.print()}>Imprimir / salvar PDF</button>
          <IndividualPayrollCard employee={folha} />
    </>
  );
}

export default function IndividualPayrollPage() {
  const { matricula = "" } = useParams();
  return (
    <main>
      <Link className="no-print" to="/folha">← Voltar à folha consolidada</Link>
      <h1>Folha individual</h1>
      <IndividualPayrollContent key={matricula} matricula={matricula} />
    </main>
  );
}
