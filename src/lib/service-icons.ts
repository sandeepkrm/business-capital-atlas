import {
  Banknote, BadgePoundSterling, Briefcase, Building, Building2, CalendarClock, CreditCard, Factory, FileText, Gauge, Hammer,
  HandCoins, Home, Landmark, Layers, LineChart, Lock, Receipt, RefreshCw, Rocket, ShieldCheck, Sprout, Truck, User, Users, Wallet, Zap,
  type LucideIcon,
} from "lucide-react";

const map: Record<string, LucideIcon> = {
  "business-loans": Banknote,
  "unsecured-business-loans": ShieldCheck,
  "secured-business-loans": Lock,
  "working-capital-finance": Wallet,
  "short-term-business-loans": Zap,
  "bad-credit-business-loans": RefreshCw,
  "limited-company-business-loans": Building2,
  "business-loans-for-women": Users,
  "business-loans-for-sole-traders": User,
  "small-business-loans": Briefcase,
  "start-up-loans": Rocket,
  "asset-finance": Truck,
  "finance-leasing": CalendarClock,
  "alternative-finance": Layers,
  "construction-finance": Hammer,
  "growth-guarantee-scheme": Landmark,
  "property-finance": Home,
  "bridging-loans": Building,
  "business-expansion-finance": LineChart,
  "sme-funding": Sprout,
  "cash-flow-solutions": Gauge,
  "business-credit-cards": CreditCard,
  "invoice-finance": FileText,
  "invoice-discounting": Receipt,
  "invoice-factoring": HandCoins,
  "merchant-cash-advance": BadgePoundSterling,
  "revolving-credit-facility": RefreshCw,
};

export const serviceIcon = (slug: string): LucideIcon => map[slug] ?? Factory;
