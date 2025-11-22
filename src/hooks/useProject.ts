import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { PaginatedResponse } from "@/@type/PaginationResponse";
import { Project } from "@/@type/Project";
import projectService from "@/services/projectService";

export const useProjects = (params: Record<string, any>) => {
  return useQuery({
    queryKey: ["projects", params],
    queryFn: async () => {
      const { request } =
        projectService.list<PaginatedResponse<Project>>(params);
      const res = await request;
      return res.data;
    },
    keepPreviousData: true,
  });
};

export const useProject = (id?: string) => {
  return useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      if (!id) return null;
      const { request } = projectService.show(id);
      const res = await request;
      return res.data;
    },
    enabled: !!id,
  });
};

export const useAddProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<Project>) => projectService.create(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; data: Partial<Project> }) =>
      projectService.update(payload.id, payload.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};

export const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => projectService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
};
