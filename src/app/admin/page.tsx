import type { Metadata } from "next";
import { AlertTriangle } from "lucide-react";
import { getAdminMetrics } from "@/lib/admin/metrics";
import { Card, CardContent } from "@/components/ui/card";
import { AdminDashboard } from "@/components/app/admin-dashboard";

export const metadata: Metadata = { title: "Admin" };
export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const m = await getAdminMetrics();

  if (!m.available) {
    return (
      <div className="mx-auto max-w-lg">
        <Card><CardContent className="flex items-start gap-3 p-5">
          <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warn" />
          <div className="text-sm">
            <p className="font-semibold">Chave de administrador do banco ausente</p>
            <p className="mt-1 text-muted-foreground">
              Para o painel ver os dados de todos os usuários, configure a variável
              <code className="mx-1 rounded bg-muted px-1">SUPABASE_SERVICE_ROLE_KEY</code>
              na Vercel e faça um Redeploy. (É a mesma chave usada pelo webhook da Cakto.)
            </p>
          </div>
        </CardContent></Card>
      </div>
    );
  }

  return <AdminDashboard m={m} />;
}
