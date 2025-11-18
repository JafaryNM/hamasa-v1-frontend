import apiClient from "@/services/apiClient";

interface Entity {
  uuid: string;
}

export function createService(endpoint: string) {
  // -----------------------
  // LIST
  // -----------------------
  function list<T>(params?: unknown, extendedUrl: string = "") {
    const controller = new AbortController();
    const request = apiClient.get(`${endpoint}${extendedUrl}`, {
      signal: controller.signal,
      params,
    });

    return { request, cancel: () => controller.abort() };
  }

  // -----------------------
  // LIST BY ITEM
  // -----------------------
  function listByItem<T>(
    uuid: string,
    params?: unknown,
    extendedUrl: string = ""
  ) {
    const controller = new AbortController();
    const request = apiClient.get(`${endpoint}${extendedUrl}/${uuid}`, {
      signal: controller.signal,
      params,
    });

    return { request, cancel: () => controller.abort() };
  }

  // -----------------------
  // SHOW
  // -----------------------
  function show(uuid: string, extendedUrl: string = "") {
    const controller = new AbortController();
    const request = apiClient.get(`${endpoint}${extendedUrl}/${uuid}`, {
      signal: controller.signal,
    });

    return { request, cancel: () => controller.abort() };
  }

  // -----------------------
  // SHOW WITH PARAMS
  // -----------------------
  function showWithParams(uuid: string, extendedUrl = "", params?: unknown) {
    const controller = new AbortController();
    const request = apiClient.get(`${endpoint}${extendedUrl}/${uuid}`, {
      signal: controller.signal,
      params,
    });

    return { request, cancel: () => controller.abort() };
  }

  // -----------------------
  // POST (CREATE)
  // -----------------------
  function post<T>(extendedUrl = "", body?: unknown) {
    return apiClient.post(`${endpoint}${extendedUrl}`, body);
  }

  // alias create
  function create<T>(body?: unknown, extendedUrl = "") {
    return apiClient.post(`${endpoint}${extendedUrl}`, body);
  }

  // -----------------------
  // PUT (UPDATE ENTIRE)
  // -----------------------
  function put(uuid: string, body?: unknown, extendedUrl = "") {
    return apiClient.put(`${endpoint}${extendedUrl}/${uuid}`, body);
  }

  // -----------------------
  // PATCH (UPDATE PARTIAL)
  // -----------------------
  function patch(uuid: string, body?: unknown, extendedUrl = "") {
    return apiClient.patch(`${endpoint}${extendedUrl}/${uuid}`, body);
  }

  // -----------------------
  // DELETE
  // -----------------------
  function remove(uuid: string, extendedUrl: string = "") {
    return apiClient.delete(`${endpoint}${extendedUrl}/${uuid}`);
  }

  return {
    list,
    listByItem,
    show,
    showWithParams,

    post,
    create,

    put,
    patch,

    delete: remove,
  };
}

export default createService;
