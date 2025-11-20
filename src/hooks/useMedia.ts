import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { PaginatedResponse } from "@/@type/PaginationResponse";
import mediaService from "@/services/mediaService";
import { Media } from "@/@type/Media";

export const useMedias = (params: Record<string, any>) => {
  return useQuery({
    queryKey: ["medias", params],
    queryFn: async () => {
      const { request } = mediaService.list<PaginatedResponse<Media>>(params);
      const res = await request;
      return res.data;
    },
    keepPreviousData: true,
  });
};

export const useMedia = (id?: string) => {
  return useQuery({
    queryKey: ["media", id],
    queryFn: async () => {
      if (!id) return null;
      const { request } = mediaService.show(id);
      const res = await request;
      return res.data;
    },
    enabled: !!id, // only run when id exists
  });
};

export const useAddMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<Media>) => mediaService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medias"] });
    },
  });
};

export const useUpdateMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; data: Partial<Media> }) =>
      mediaService.update(payload.id, payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medias"] });
    },
  });
};

export const useDeleteMedia = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mediaService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["medias"] });
    },
  });
};
