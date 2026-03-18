export const setCookie = (name: string, value: string) => {
  if (typeof document === "undefined") return;
  const expires = new Date(Date.now() + 3 * 864e5).toUTCString();

  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

export const getCookie = (name: string) => {
  if (typeof document === "undefined") return;
  const match = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${name}=`));

  return match ? match.split("=")[1] : undefined;
};

export const removeCookie = (name: string) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};
