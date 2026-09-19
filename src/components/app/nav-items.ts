import {
  LayoutDashboard,
  TrendingUp,
  TrendingDown,
  Target,
  Wallet,
  Repeat,
  Sparkles,
  Tags,
  Settings,
  User,
  type LucideIcon,
} from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  /** show in the mobile bottom bar */
  primary?: boolean;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard, primary: true },
  { href: "/despesas", label: "Despesas", icon: TrendingDown, primary: true },
  { href: "/receitas", label: "Receitas", icon: TrendingUp },
  { href: "/metas", label: "Metas", icon: Target, primary: true },
  { href: "/orcamento", label: "Orçamento", icon: Wallet },
  { href: "/assinaturas", label: "Assinaturas", icon: Repeat },
  { href: "/analise", label: "Análise", icon: Sparkles, primary: true },
  { href: "/categorias", label: "Categorias", icon: Tags },
  { href: "/perfil", label: "Perfil", icon: User },
  { href: "/configuracoes", label: "Configurações", icon: Settings },
];
