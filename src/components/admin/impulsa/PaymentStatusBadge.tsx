import { cn } from "@/lib/utils";

const STATUS_STYLES: Record<string, { label: string; className: string }> = {
  pending: { label: "Pendiente", className: "bg-amber-100 text-amber-800" },
  paid: { label: "Pagado", className: "bg-green-100 text-green-800" },
  failed: { label: "Fallido", className: "bg-red-100 text-red-800" },
  cancelled: { label: "Cancelado", className: "bg-zinc-200 text-zinc-700" },
  refunded: { label: "Reembolsado", className: "bg-blue-100 text-blue-800" },
  in_kind_pending: { label: "Especie · pendiente", className: "bg-purple-100 text-purple-800" },
  in_kind_confirmed: { label: "Especie · confirmada", className: "bg-emerald-100 text-emerald-800" },
};

export const PaymentStatusBadge = ({ status }: { status: string | null | undefined }) => {
  const s = STATUS_STYLES[status ?? ""] ?? { label: status ?? "—", className: "bg-muted text-muted-foreground" };
  return (
    <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", s.className)}>
      {s.label}
    </span>
  );
};

export default PaymentStatusBadge;
