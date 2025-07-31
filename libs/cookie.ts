export const setCookie = (name: string, value: string) => {
  const expires = new Date(Date.now() + 3 * 864e5).toUTCString();

  document.cookie = `${name}=${value}; expires=${expires}; path=/`;
};

export const getCookie = (name: string) => {
  const match = document.cookie
    .split("; ")
    .find((cookie) => cookie.startsWith(`${name}=`));

  return match ? match.split("=")[1] : undefined;
};
