import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { PaginatedResponse } from "@/@type/PaginationResponse";
import projectCategoryService from "@/services/projectCategoryService";
import { ProjectCategory } from "@/@type/ProjectCategory";

export const useProjectCategories = (params: Record<string, any>) => {
  return useQuery({
    queryKey: ["project-categories", params],
    queryFn: async () => {
      const { request } =
        projectCategoryService.list<PaginatedResponse<ProjectCategory>>(params);
      const res = await request;
      return res.data;
    },
    keepPreviousData: true,
  });
};

export const useAddProjectCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<ProjectCategory>) =>
      projectCategoryService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-categories"] });
    },
  });
};

export const useUpdateProjectCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; data: Partial<ProjectCategory> }) =>
      projectCategoryService.update(payload.id, payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-categories"] });
    },
  });
};

export const useDeleteProjectCategory = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectCategoryService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["project-categories"] });
    },
  });
};
