import type { CategoryTotal } from "../../types/colaborador";
import { formatarMoeda } from "../../utils/formatters";

export default function PayrollCategorySummary({ categories }: { categories: CategoryTotal[] }) {
  return (
    <section className="category-summary" aria-labelledby="category-title">
      <h3 id="category-title">Resumo por categoria</h3>
      <dl className="category-grid">
        {categories.map((category) => (
          <div key={category.tipo}>
            <dt>{category.tipo} · {category.quantidadeColaboradores} colaborador(es)</dt>
            <dd>{formatarMoeda(category.total)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
