import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import clientService from "@/services/clientService";
import { Client } from "@/@type/Client";
import { PaginatedResponse } from "@/@type/PaginationResponse";

// ---------------------------------------------------
// GET ALL CLIENTS
// ---------------------------------------------------
export const useClients = (params?: Record<string, any>) => {
  return useQuery({
    queryKey: ["clients", params],
    queryFn: () =>
      clientService
        .list<PaginatedResponse<Client>>(params)
        .request.then((res) => res.data),
  });
};

// ---------------------------------------------------
// ADD CLIENT
// ---------------------------------------------------
export const useAddClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (
      newClient: Omit<Client, "uid" | "created_at" | "updated_at">
    ) => clientService.create(newClient),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};

// ---------------------------------------------------
// UPDATE CLIENT
// ---------------------------------------------------
export const useUpdateClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (client: Client) => clientService.update(client),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
  });
};

// ---------------------------------------------------
// DELETE CLIENT
// ---------------------------------------------------
export const useDeleteClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (uid: string) => {
      console.log("Deleting:", `/clients/${uid}/`);
      return clientService.delete(uid);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },

    onError: (error) => {
      console.error("Delete failed:", error);
    },
  });
};
