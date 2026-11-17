import {
  Utensils, Home, Car, HeartPulse, GraduationCap, PartyPopper, ShoppingBag,
  Repeat, Receipt, PawPrint, Landmark, Plane, Ellipsis, Briefcase, Laptop, Tag,
  Percent, TrendingUp, Building, Gift, PiggyBank, Banknote, Wallet, Smartphone,
  CircleDollarSign, CreditCard, Target, Wallet2, type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

const ICONS: Record<string, LucideIcon> = {
  utensils: Utensils,
  home: Home,
  car: Car,
  "heart-pulse": HeartPulse,
  "graduation-cap": GraduationCap,
  "party-popper": PartyPopper,
  "shopping-bag": ShoppingBag,
  repeat: Repeat,
  receipt: Receipt,
  "paw-print": PawPrint,
  landmark: Landmark,
  plane: Plane,
  ellipsis: Ellipsis,
  briefcase: Briefcase,
  laptop: Laptop,
  tag: Tag,
  percent: Percent,
  "trending-up": TrendingUp,
  building: Building,
  gift: Gift,
  "piggy-bank": PiggyBank,
  banknote: Banknote,
  wallet: Wallet,
  smartphone: Smartphone,
  "circle-dollar-sign": CircleDollarSign,
  "credit-card": CreditCard,
  target: Target,
};

/** Ícone por nome (string do banco). Cai em Wallet2 se não encontrar. */
export function Icon({
  name,
  className,
}: {
  name: string;
  className?: string;
}) {
  const Cmp = ICONS[name] ?? Wallet2;
  return <Cmp className={cn("h-4 w-4", className)} aria-hidden />;
}

/** Bolha colorida com ícone — usada em categorias, contas e cartões. */
export function IconBubble({
  name,
  color,
  className,
  size = "md",
}: {
  name: string;
  color?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}) {
  const dim = size === "sm" ? "h-8 w-8" : size === "lg" ? "h-12 w-12" : "h-10 w-10";
  const icon = size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5";
  return (
    <span
      className={cn("flex shrink-0 items-center justify-center rounded-xl", dim, className)}
      style={color ? { backgroundColor: `${color}1f`, color } : undefined}
    >
      <Icon name={name} className={icon} />
    </span>
  );
}
