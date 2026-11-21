"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  User, Palette, Tags, ShieldCheck, LogOut, Plus, Pencil, Trash2, Info, Crown, ArrowRight,
} from "lucide-react";
import { formatDate } from "@/lib/format";
import { WhatsAppIcon, WHATSAPP_URL } from "@/components/brand/whatsapp-button";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter,
} from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/ui/label";
import { ColorPicker } from "@/components/ui/color-picker";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { IconBubble } from "@/components/ui/icon";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "@/components/ui/toast";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { saveProfile, saveCategory, deleteCategory } from "@/lib/actions/profile";
import { logoutAction } from "@/app/(auth)/actions";
import type { Profile, Category, CategoryType } from "@/lib/db/types";

export function SettingsView({
  profile,
  email,
  categories,
  premium,
  periodEnd,
  subStatus,
}: {
  profile: Profile | null;
  email: string | null;
  categories: Category[];
  premium: boolean;
  periodEnd: string | null;
  subStatus: string;
}) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="mt-1 text-sm text-muted-foreground">Gerencie seu perfil, aparência e categorias.</p>
      </div>

      <PlanCard premium={premium} periodEnd={periodEnd} subStatus={subStatus} />

      <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="block">
        <Card className="transition-shadow hover:shadow-card-hover">
          <CardContent className="flex items-center gap-3 p-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white" style={{ backgroundColor: "#25D366" }}>
              <WhatsAppIcon className="h-6 w-6" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="font-semibold">Falar no WhatsApp</p>
              <p className="truncate text-xs text-muted-foreground">Dúvidas, suporte ou sugestões — fale com a gente.</p>
            </div>
            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </CardContent>
        </Card>
      </a>

      <Tabs defaultValue="perfil">
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="perfil"><User className="h-4 w-4" /> Perfil</TabsTrigger>
          <TabsTrigger value="aparencia"><Palette className="h-4 w-4" /> Aparência</TabsTrigger>
          <TabsTrigger value="categorias"><Tags className="h-4 w-4" /> Categorias</TabsTrigger>
          <TabsTrigger value="privacidade"><ShieldCheck className="h-4 w-4" /> Dados</TabsTrigger>
        </TabsList>

        <TabsContent value="perfil"><ProfileSection profile={profile} email={email} /></TabsContent>
        <TabsContent value="aparencia"><AppearanceSection /></TabsContent>
        <TabsContent value="categorias"><CategoriesSection categories={categories} /></TabsContent>
        <TabsContent value="privacidade"><PrivacySection /></TabsContent>
      </Tabs>
    </div>
  );
}

function PlanCard({ premium, periodEnd, subStatus }: { premium: boolean; periodEnd: string | null; subStatus: string }) {
  return (
    <Link href="/assinar" className="block">
      <Card className="overflow-hidden transition-shadow hover:shadow-card-hover">
        <CardContent className="flex items-center gap-3 p-4">
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${premium ? "brand-gradient text-white" : "bg-muted text-muted-foreground"}`}>
            <Crown className="h-5 w-5" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="font-semibold">{premium ? "Finora Premium" : "Plano gratuito"}</p>
            <p className="truncate text-xs text-muted-foreground">
              {premium
                ? subStatus === "canceled"
                  ? `Ativo até ${periodEnd ? formatDate(periodEnd) : "—"}`
                  : periodEnd ? `Renova em ${formatDate(periodEnd)}` : "Assinatura ativa"
                : "Assine o Premium para desbloquear a Finora IA e mais"}
            </p>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        </CardContent>
      </Card>
    </Link>
  );
}

function ProfileSection({ profile, email }: { profile: Profile | null; email: string | null }) {
  const router = useRouter();
  const [name, setName] = React.useState(profile?.display_name ?? "");
  const [timezone, setTimezone] = React.useState(profile?.timezone ?? "America/Sao_Paulo");
  const [pending, setPending] = React.useState(false);

  async function save() {
    setPending(true);
    const res = await saveProfile({ displayName: name, timezone, theme: profile?.theme ?? "system" });
    setPending(false);
    if (res.ok) { toast.success("Perfil atualizado."); router.refresh(); }
    else toast.error(res.error ?? "Erro.");
  }

  return (
    <Card><CardContent className="flex flex-col gap-4 p-5">
      <Field label="Nome"><Input value={name} onChange={(e) => setName(e.target.value)} /></Field>
      <Field label="E-mail"><Input value={email ?? ""} disabled /></Field>
      <Field label="Fuso horário">
        <Select value={timezone} onValueChange={setTimezone}>
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            {["America/Sao_Paulo", "America/Manaus", "America/Belem", "America/Fortaleza", "America/Cuiaba", "America/Rio_Branco"].map((tz) => (
              <SelectItem key={tz} value={tz}>{tz.replace("America/", "").replace("_", " ")}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </Field>
      <div className="flex justify-between">
        <form action={logoutAction}>
          <Button type="submit" variant="ghost" className="text-negative"><LogOut className="h-4 w-4" /> Sair</Button>
        </form>
        <Button onClick={save} loading={pending}>Salvar</Button>
      </div>
    </CardContent></Card>
  );
}

function AppearanceSection() {
  return (
    <Card><CardContent className="flex flex-col gap-4 p-5">
      <div>
        <p className="text-sm font-medium">Tema</p>
        <p className="text-xs text-muted-foreground">Escolha claro, escuro ou automático (segue o sistema).</p>
        <div className="mt-3"><ThemeToggle /></div>
      </div>
    </CardContent></Card>
  );
}

function CategoriesSection({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [form, setForm] = React.useState<{ cat?: Category; type: CategoryType } | null>(null);
  const [toDelete, setToDelete] = React.useState<Category | null>(null);

  const expense = categories.filter((c) => c.type === "expense");
  const income = categories.filter((c) => c.type === "income");

  return (
    <div className="space-y-4">
      {(["expense", "income"] as const).map((type) => (
        <Card key={type}><CardContent className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold">{type === "expense" ? "Categorias de despesa" : "Categorias de receita"}</h3>
            <Button size="sm" variant="outline" onClick={() => setForm({ type })}><Plus className="h-4 w-4" /> Nova</Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(type === "expense" ? expense : income).map((c) => (
              <div key={c.id} className="group flex items-center gap-2 rounded-xl border border-border py-1.5 pl-2 pr-1.5 text-sm">
                <IconBubble name={c.icon} color={c.color} size="sm" />
                {c.name}
                <button onClick={() => setForm({ cat: c, type })} className="rounded p-1 text-muted-foreground hover:bg-muted" aria-label="Editar"><Pencil className="h-3 w-3" /></button>
                {!c.is_default && (
                  <button onClick={() => setToDelete(c)} className="rounded p-1 text-muted-foreground hover:text-negative" aria-label="Remover"><Trash2 className="h-3 w-3" /></button>
                )}
              </div>
            ))}
          </div>
        </CardContent></Card>
      ))}

      {form && <CategoryDialog cat={form.cat} type={form.type} onClose={() => setForm(null)} onSaved={() => { setForm(null); router.refresh(); }} />}
      <ConfirmDialog
        open={!!toDelete}
        onOpenChange={(o) => !o && setToDelete(null)}
        title="Remover categoria?"
        description={`"${toDelete?.name}" será arquivada. Lançamentos antigos mantêm o histórico.`}
        confirmLabel="Remover"
        onConfirm={async () => {
          if (!toDelete) return;
          const res = await deleteCategory(toDelete.id);
          if (res.ok) { toast.success("Removida."); router.refresh(); }
          setToDelete(null);
        }}
      />
    </div>
  );
}

function CategoryDialog({ cat, type, onClose, onSaved }: {
  cat?: Category; type: CategoryType; onClose: () => void; onSaved: () => void;
}) {
  const [name, setName] = React.useState(cat?.name ?? "");
  const [color, setColor] = React.useState(cat?.color ?? "#6366f1");
  const [pending, setPending] = React.useState(false);
  const [error, setError] = React.useState("");

  async function submit() {
    setError(""); setPending(true);
    const res = await saveCategory({ id: cat?.id, name, type, color, icon: cat?.icon ?? "tag" });
    setPending(false);
    if (res.ok) { toast.success(res.message ?? "Salvo."); onSaved(); }
    else setError(res.error ?? Object.values(res.fieldErrors ?? {})[0] ?? "Verifique os campos.");
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader><DialogTitle>{cat ? "Editar categoria" : "Nova categoria"}</DialogTitle></DialogHeader>
        <DialogBody className="flex flex-col gap-4">
          <Field label="Nome"><Input value={name} onChange={(e) => setName(e.target.value)} autoFocus /></Field>
          <Field label="Cor"><ColorPicker value={color} onChange={setColor} /></Field>
          {error && <p className="text-sm font-medium text-negative">{error}</p>}
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={submit} loading={pending}>{cat ? "Salvar" : "Criar"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function PrivacySection() {
  return (
    <Card><CardContent className="flex flex-col gap-4 p-5">
      <div className="flex items-start gap-3 rounded-xl bg-positive-soft px-4 py-3">
        <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-positive" />
        <div className="text-sm">
          <p className="font-medium text-foreground">Seus dados são privados</p>
          <p className="text-muted-foreground">Apenas você tem acesso às suas informações financeiras, com isolamento garantido no banco de dados.</p>
        </div>
      </div>
      <div className="flex items-start gap-3 rounded-xl bg-muted px-4 py-3">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
        <div className="text-sm">
          <p className="font-medium">Exportar dados</p>
          <p className="text-muted-foreground">Você pode exportar seus lançamentos em CSV na aba Transações e seus relatórios na central de Relatórios.</p>
        </div>
      </div>
    </CardContent></Card>
  );
}
