export const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/search", label: "Search" },
  { href: "/watchlist", label: "Watchlist" },
] as const;

export type NavItem = (typeof NAV_ITEMS)[number];
