import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import clientService from "@/services/clientService";
import { Client } from "@/@type/Client";
import { PaginatedResponse } from "@/@type/PaginationResponse";

// ===============================
// GET CLIENTS WITH PAGINATION
// ===============================
export const useClients = (params: Record<string, any>) => {
  return useQuery({
    queryKey: ["clients", params], // react-query re-runs on page/search change
    queryFn: async () => {
      const { request } = clientService.list<PaginatedResponse<Client>>(params);
      const res = await request;
      return res.data;
    },
    keepPreviousData: true, // smooth pagination
  });
};

// ===============================
// CREATE CLIENT
// ===============================
export const useAddClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<Client>) => clientService.create(payload), // POST /clients/

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};

// ===============================
// UPDATE CLIENT (PATCH)
// ===============================
export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; data: Partial<Client> }) =>
      clientService.update(payload.id, payload.data), // PATCH /clients/:id/

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};

// ===============================
// DELETE CLIENT
// ===============================
export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => clientService.delete(id),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};
