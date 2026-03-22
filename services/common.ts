"use client";

import { redirect } from "next/navigation";

import { getCookie, setCookie } from "@/libs/cookie";

import { useGlobalStore } from "../store/globalStore";
import { EHttpStatusCode } from "../types/enum";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const handleResponse = async (res: Response) => {
  try {
    // เช็คก่อนเลยว่าถ้าเป็น 204 No Content (สำเร็จแต่ไม่มีเนื้อหา) ให้ return success
    if (res.status === 204) {
      return {
        statusCode: 204,
        message: { th: "Deleted", en: "Deleted" },
        data: null,
      };
    }
    // -------------------------

    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      return {
        statusCode: res.status,
        message: {
          th: "",
          en: "",
        },
        data: await res.json(),
      };
    } else {
      // เพิ่มการเช็ค res.ok อีกชั้น เพื่อความชัวร์
      if (res.ok) {
        return {
          statusCode: res.status,
          message: { th: "Success", en: "Success" },
          data: null, // หรือ await res.text() ถ้าอยากได้ text
        };
      }

      const text = await res.text();
      throw new Error(text);
    }
  } catch (error: any) {
    const errorMessage = error?.message || JSON.stringify(error);
    console.error("API Error Detail:", errorMessage);
    throw new Error(errorMessage);
  }
};

function getAuthHeader() {
  const token = getCookie("access_token");

  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export const apiGet = async (path: string, query?: string) => {
  console.log("apiGet", path, query);

  try {
    useGlobalStore.getState().setLoading(true);
    const res = await fetch(
      `${API_BASE_URL as string}${path}${query ? `?${query}` : ""}`,
      { headers: getAuthHeader(), cache: "no-cache" }
    );

    if (
      res.status === EHttpStatusCode.INVALID_TOKEN ||
      res.status === EHttpStatusCode.UNAUTHORIZED ||
      res.status === EHttpStatusCode.FORBIDDEN
    ) {
      useGlobalStore.getState().setLoading(false);
      if (res.status === EHttpStatusCode.FORBIDDEN) {
        redirect("/forbidden");
      } else {
        await logOut();
      }
    }

    return await handleResponse(res);
  } catch (error: any) {
    if (error.digest?.startsWith("NEXT_REDIRECT")) throw error;
    console.log("error :", error);
  } finally {
    useGlobalStore.getState().setLoading(false);
  }
};

export const apiGetNoLoading = async (path: string, query?: string) => {
  console.log("apiGet no loading", path, query);

  try {
    const res = await fetch(
      `${API_BASE_URL as string}${path}${query ? `?${query}` : ""}`,
      { headers: getAuthHeader(), cache: "no-cache" }
    );

    if (
      res.status === EHttpStatusCode.INVALID_TOKEN ||
      res.status === EHttpStatusCode.UNAUTHORIZED ||
      res.status === EHttpStatusCode.FORBIDDEN
    ) {
      if (res.status === EHttpStatusCode.FORBIDDEN) {
        redirect("/forbidden");
      } else {
        await logOut();
      }
    }

    return await handleResponse(res);
  } catch (error: any) {
    if (error.digest?.startsWith("NEXT_REDIRECT")) throw error;
    console.log("error :", error);
  }
};

export const apiPost = async (path: string, payload?: any) => {
  console.log("apiPost", path);
  try {
    useGlobalStore.getState().setLoading(true);

    let body;
    const headers: HeadersInit = {
      Authorization: getAuthHeader().Authorization,
    };
    if (payload instanceof FormData) {
      body = payload;
    } else {
      body = JSON.stringify(payload);
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_BASE_URL as string}${path}`, {
      body,
      method: "POST",
      headers,
    });

    if (
      res.status === EHttpStatusCode.INVALID_TOKEN ||
      res.status === EHttpStatusCode.UNAUTHORIZED ||
      res.status === EHttpStatusCode.FORBIDDEN
    ) {
      useGlobalStore.getState().setLoading(false);
      if (res.status === EHttpStatusCode.FORBIDDEN) {
        redirect("/forbidden");
      } else {
        await logOut();
      }
    }

    return await handleResponse(res);
  } catch (error: any) {
    if (error.digest?.startsWith("NEXT_REDIRECT")) throw error;
    console.log("error :", error);
    throw new Error(JSON.stringify(error, null, 2));
  } finally {
    useGlobalStore.getState().setLoading(false);
  }
};

export const apiPut = async (path: string, payload?: any) => {
  console.log("apiPut", path, payload);
  try {
    useGlobalStore.getState().setLoading(true);

    let body;
    const headers: HeadersInit = {
      Authorization: getAuthHeader().Authorization,
    };
    if (payload instanceof FormData) {
      body = payload;
    } else {
      body = JSON.stringify(payload);
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(`${API_BASE_URL as string}${path}`, {
      body,
      method: "PUT",
      headers,
    });

    if (
      res.status === EHttpStatusCode.INVALID_TOKEN ||
      res.status === EHttpStatusCode.UNAUTHORIZED ||
      res.status === EHttpStatusCode.FORBIDDEN
    ) {
      useGlobalStore.getState().setLoading(false);
      if (res.status === EHttpStatusCode.FORBIDDEN) {
        redirect("/forbidden");
      } else {
        await logOut();
      }
    }

    return await handleResponse(res);
  } catch (error: any) {
    if (error.digest?.startsWith("NEXT_REDIRECT")) throw error;
    console.log("error :", error);
    throw new Error(JSON.stringify(error, null, 2));
  } finally {
    useGlobalStore.getState().setLoading(false);
  }
};

export const apiPatch = async (
  path: string,
  payload?: any,
  otherToken?: string
) => {
  console.log("apiPatch", path, payload);
  try {
    useGlobalStore.getState().setLoading(true);

    let body: BodyInit | undefined = undefined;
    const headers: HeadersInit = {
      Authorization: `Bearer ${otherToken ? otherToken : getAuthHeader().Authorization?.split(" ")[1]}`,
    };
    if (payload) {
      if (payload instanceof FormData) {
        body = payload;
      } else {
        body = JSON.stringify(payload);
        headers["Content-Type"] = "application/json";
      }
    }
    const res = await fetch(`${API_BASE_URL as string}${path}`, {
      body,
      method: "PATCH",
      headers,
    });

    if (
      res.status === EHttpStatusCode.INVALID_TOKEN ||
      res.status === EHttpStatusCode.UNAUTHORIZED ||
      res.status === EHttpStatusCode.FORBIDDEN
    ) {
      useGlobalStore.getState().setLoading(false);
      if (res.status === EHttpStatusCode.FORBIDDEN) {
        redirect("/forbidden");
      } else {
        await logOut();
      }
    }

    return await handleResponse(res);
  } catch (error: any) {
    if (error.digest?.startsWith("NEXT_REDIRECT")) throw error;
    console.log("Error in apiPatch :", error);
    throw new Error(JSON.stringify(error, null, 2));
  } finally {
    useGlobalStore.getState().setLoading(false);
  }
};

export const apiDelete = async (path: string) => {
  console.log("apiDelete", path);
  try {
    useGlobalStore.getState().setLoading(true);
    const res = await fetch(`${API_BASE_URL as string}${path}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: getAuthHeader().Authorization,
      },
    });

    if (
      res.status === EHttpStatusCode.INVALID_TOKEN ||
      res.status === EHttpStatusCode.UNAUTHORIZED ||
      res.status === EHttpStatusCode.FORBIDDEN
    ) {
      useGlobalStore.getState().setLoading(false);
      if (res.status === EHttpStatusCode.FORBIDDEN) {
        redirect("/forbidden");
      } else {
        await logOut();
      }
    }

    return await handleResponse(res);
  } catch (error: any) {
    if (error.digest?.startsWith("NEXT_REDIRECT")) throw error;
    console.log("error :", error);
    throw new Error(JSON.stringify(error, null, 2));
  } finally {
    useGlobalStore.getState().setLoading(false);
  }
};

function logOut() {
  // signOut();
  setCookie("access_token", "");
  redirect("/login");
}
