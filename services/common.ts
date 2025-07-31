"use client";

import { signOut } from "next-auth/react";

import { getCookie } from "@/libs/cookie";

import { useGlobalStore } from "../store/globalStore";
import { EHttpStatusCode } from "../types/enum";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const handleResponse = async (res: Response) => {
  try {
    const contentType = res.headers.get("content-type");

    if (contentType && contentType.includes("application/json")) {
      return await res.json();
    } else {
      const text = await res.text();
      throw new Error(text);
    }
  } catch (error) {
    throw new Error(JSON.stringify(error, null, 2));
  }
};

function getAuthHeader() {
  const token = getCookie("accessToken");

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
      res.status === EHttpStatusCode.UNAUTHORIZED
    ) {
      await signOut();
    }
    return await handleResponse(res);
  } catch (error) {
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
      res.status === EHttpStatusCode.UNAUTHORIZED
    ) {
      await signOut();
    }
    return await handleResponse(res);
  } catch (error) {
    console.log("error :", error);
  }
};

export const apiPost = async (path: string, payload?: any) => {
  console.log("apiPost", path, payload);
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
      res.status === EHttpStatusCode.UNAUTHORIZED
    ) {
      await signOut();
    }
    return await handleResponse(res);
  } catch (error) {
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
      res.status === EHttpStatusCode.UNAUTHORIZED
    ) {
      await signOut();
    }
    return await handleResponse(res);
  } catch (error) {
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
      res.status === EHttpStatusCode.UNAUTHORIZED
    ) {
      await signOut();
    }
    return await handleResponse(res);
  } catch (error) {
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
      res.status === EHttpStatusCode.UNAUTHORIZED
    ) {
      await signOut();
    }
    return await handleResponse(res);
  } catch (error) {
    console.log("error :", error);
    throw new Error(JSON.stringify(error, null, 2));
  } finally {
    useGlobalStore.getState().setLoading(false);
  }
};
