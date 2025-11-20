import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PaginatedResponse } from "@/@type/PaginationResponse";
import { MediaCategory } from "@/@type/MediaCategory";
import mediaCategoryService from "@/services/mediaCategoryService";

export const useMediaCategories = (params: Record<string, any>) => {
  return useQuery({
    queryKey: ["media-categories", params],
    queryFn: async () => {
      const { request } =
        mediaCategoryService.list<PaginatedResponse<MediaCategory>>(params);
      const res = await request;
      return res.data;
    },
    keepPreviousData: true,
  });
};

export const useAddMediaCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<MediaCategory>) =>
      mediaCategoryService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-categories"] });
    },
  });
};

export const useUpdateMediaCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; data: Partial<MediaCategory> }) =>
      mediaCategoryService.update(payload.id, payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-categories"] });
    },
  });
};

export const useDeleteMediaCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => mediaCategoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["media-categories"] });
    },
  });
};
