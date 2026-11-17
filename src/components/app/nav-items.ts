import {
  LayoutDashboard, ArrowLeftRight, Wallet, CreditCard, PieChart, Target,
  CalendarClock, TrendingDown, Landmark, BarChart3, Sparkles, Settings, Repeat,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** Aparece na navegação inferior (mobile). */
  primary?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/painel", label: "Visão geral", icon: LayoutDashboard, primary: true },
  { href: "/transacoes", label: "Transações", icon: ArrowLeftRight, primary: true },
  { href: "/contas", label: "Contas", icon: Wallet },
  { href: "/cartoes", label: "Cartões", icon: CreditCard, primary: true },
  { href: "/orcamentos", label: "Orçamentos", icon: PieChart },
  { href: "/metas", label: "Metas", icon: Target },
  { href: "/contas-a-pagar", label: "Contas a pagar", icon: CalendarClock },
  { href: "/dividas", label: "Dívidas", icon: TrendingDown },
  { href: "/patrimonio", label: "Patrimônio", icon: Landmark },
  { href: "/assinaturas", label: "Assinaturas", icon: Repeat },
  { href: "/relatorios", label: "Relatórios", icon: BarChart3 },
  { href: "/finora-ia", label: "Finora IA", icon: Sparkles },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];

export const PRIMARY_NAV = NAV_ITEMS.filter((i) => i.primary);
