export const ROLE_REDIRECTS: Record<string, string> = {
  dashboard: "/",
  order: "/order",
  table: "/table",
  stock: "/stock",
  menu: "/menu",
  restaurant: "/restaurant",
};

export const getRedirectPath = (role: string) => {
  return ROLE_REDIRECTS[role] || "/"; // default ไปหน้า Dashboard
};
