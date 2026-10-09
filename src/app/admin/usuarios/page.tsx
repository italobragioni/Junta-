import { hasServiceRole } from "@/lib/env";
import { listAdminUsers } from "@/lib/admin/users";
import { UsersTable } from "./users-table";

export const metadata = { title: "Usuários" };

export default async function AdminUsersPage() {
  if (!hasServiceRole()) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-900">
        O painel de usuários requer a chave de serviço do Supabase
        (SUPABASE_SERVICE_ROLE_KEY) no servidor.
      </div>
    );
  }

  const users = await listAdminUsers();

  return (
    <div>
      <h1 className="mb-1 text-2xl font-extrabold">Usuários</h1>
      <p className="mb-5 text-sm text-muted-foreground">
        Todos os cadastros, com o plano de cada um. Você pode conceder ou
        remover o Premium manualmente.
      </p>
      <UsersTable users={users} />
    </div>
  );
}
