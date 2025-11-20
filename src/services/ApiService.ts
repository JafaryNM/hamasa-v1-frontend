import apiClient from "@/services/apiClient";

export const createService = (endpoint: string) => {
  const buildUrl = (extendedUrl = "", id?: string | number) =>
    id ? `${endpoint}${extendedUrl}/${id}/` : `${endpoint}${extendedUrl}/`;

  // LIST
  const list = <T>(params?: unknown, extendedUrl = "") => {
    const controller = new AbortController();
    const request = apiClient.get<T>(buildUrl(extendedUrl), {
      signal: controller.signal,
      params,
    });
    return { request, cancel: () => controller.abort() };
  };

  // SHOW SINGLE
  const show = (id: string | number, extendedUrl = "") => {
    const controller = new AbortController();
    const request = apiClient.get(buildUrl(extendedUrl, id), {
      signal: controller.signal,
    });
    return { request, cancel: () => controller.abort() };
  };

  // CREATE (POST)
  const create = <T>(payload: T, extendedUrl = "") =>
    apiClient.post(buildUrl(extendedUrl), payload);

  // UPDATE (PATCH)
  const update = <T>(id: string | number, payload: T, extendedUrl = "") =>
    apiClient.patch(buildUrl(extendedUrl, id), payload);

  // DELETE
  const remove = (id: string | number, extendedUrl = "") =>
    apiClient.delete(buildUrl(extendedUrl, id));

  return {
    list,
    show,
    create,
    update,
    delete: remove,
  };
};
