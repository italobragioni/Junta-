import { Check, Minus } from "lucide-react";

type Cell = string | boolean;

interface Row {
  label: string;
  free: Cell;
  basic: Cell;
  pro: Cell;
}

const ROWS: Row[] = [
  { label: "Receitas por mês", free: "10", basic: "Ilimitadas", pro: "Ilimitadas" },
  { label: "Despesas por mês", free: "10", basic: "Ilimitadas", pro: "Ilimitadas" },
  { label: "Metas", free: "1", basic: "5", pro: "Ilimitadas" },
  { label: "Orçamentos", free: "1", basic: "5", pro: "Ilimitados" },
  { label: "Assinaturas", free: "3", basic: "10", pro: "Ilimitadas" },
  { label: "Análise financeira", free: "Básica", basic: "Avançada", pro: "Avançada" },
  { label: "Simulador de economia", free: true, basic: true, pro: true },
  { label: '"Posso comprar?"', free: false, basic: true, pro: true },
  { label: "Assistente com IA", free: false, basic: false, pro: true },
  { label: "Histórico", free: "3 meses", basic: "12 meses", pro: "Ilimitado" },
  { label: "Exportação", free: false, basic: "CSV", pro: "CSV + PDF" },
];

function CellValue({ value }: { value: Cell }) {
  if (value === true)
    return <Check className="mx-auto h-4 w-4 text-brand-600" aria-label="Incluído" />;
  if (value === false)
    return (
      <Minus className="mx-auto h-4 w-4 text-muted-foreground" aria-label="Não incluído" />
    );
  return <span className="text-sm">{value}</span>;
}

export function ComparisonTable() {
  return (
    <div>
      {/* Desktop / tablet table */}
      <div className="hidden overflow-hidden rounded-2xl border border-border sm:block">
        <table className="w-full border-collapse text-center">
          <thead>
            <tr className="bg-muted/50 text-sm">
              <th className="p-4 text-left font-semibold">Recurso</th>
              <th className="p-4 font-semibold">Gratuito</th>
              <th className="p-4 font-semibold">Básico</th>
              <th className="p-4 font-semibold text-brand-700">Pro</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr
                key={r.label}
                className={i % 2 === 1 ? "bg-muted/20" : undefined}
              >
                <td className="p-4 text-left text-sm font-medium">{r.label}</td>
                <td className="p-4">
                  <CellValue value={r.free} />
                </td>
                <td className="p-4">
                  <CellValue value={r.basic} />
                </td>
                <td className="bg-brand-50/40 p-4">
                  <CellValue value={r.pro} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile stacked cards */}
      <div className="space-y-4 sm:hidden">
        {(["free", "basic", "pro"] as const).map((key) => {
          const title =
            key === "free" ? "Gratuito" : key === "basic" ? "Básico" : "Pro";
          return (
            <div
              key={key}
              className="overflow-hidden rounded-2xl border border-border"
            >
              <div
                className={
                  "px-4 py-3 font-semibold " +
                  (key === "pro" ? "bg-brand-600 text-white" : "bg-muted/50")
                }
              >
                {title}
              </div>
              <ul className="divide-y divide-border">
                {ROWS.map((r) => (
                  <li
                    key={r.label}
                    className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm"
                  >
                    <span className="text-muted-foreground">{r.label}</span>
                    <span className="text-right font-medium">
                      <CellValue value={r[key]} />
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
