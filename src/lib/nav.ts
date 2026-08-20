import {
  Bot,
  ClipboardList,
  LayoutDashboard,
  Mail,
  NotebookPen,
  Search,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

export type NavItem = {
  to: string;
  label: string;
  icon: LucideIcon;
  blurb: string;
};

export const NAV_ITEMS: NavItem[] = [
  {
    to: "/",
    label: "Dashboard",
    icon: LayoutDashboard,
    blurb: "Your productivity overview and quick actions.",
  },
  {
    to: "/email",
    label: "Smart Email Generator",
    icon: Mail,
    blurb: "Draft professional emails for any audience and tone.",
  },
  {
    to: "/meeting-notes",
    label: "Meeting Notes Summarizer",
    icon: NotebookPen,
    blurb: "Turn raw notes into summaries, decisions and action items.",
  },
  {
    to: "/task-planner",
    label: "AI Task Planner",
    icon: ClipboardList,
    blurb: "Prioritise your workload and get a daily schedule.",
  },
  {
    to: "/research",
    label: "AI Research Assistant",
    icon: Search,
    blurb: "Get structured briefings on any workplace topic.",
  },
  {
    to: "/chat",
    label: "AI Workplace Chatbot",
    icon: Bot,
    blurb: "Ask anything about your day-to-day work.",
  },
  {
    to: "/about",
    label: "About / Responsible AI",
    icon: ShieldCheck,
    blurb: "How to use this assistant responsibly.",
  },
];

export const TOOL_ITEMS = NAV_ITEMS.filter(
  (item) => item.to !== "/" && item.to !== "/about",
);
