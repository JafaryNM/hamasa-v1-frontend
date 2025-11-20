import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormMessage,
  FormControl,
} from "@/components/ui/form";

import { TbPencil, TbTrash, TbPlus, TbSearch } from "react-icons/tb";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { toast, Toaster } from "react-hot-toast";

import {
  useClients,
  useAddClient,
  useUpdateClient,
  useDeleteClient,
} from "@/hooks/useClients";

import { Client } from "@/@type/Client";
import { ClientSchema, ClientType } from "@/Schema/ClientSchema";
import { DataTable } from "@/components/ui/datatable";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

export default function Clients() {
  const [page, setPage] = useState(1);

  // Only ONE filter: name
  const [nameInput, setNameInput] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  // Fetch with ONLY name + desc sort
  const { data, isLoading } = useClients({
    page,
    page_size: 10,
    name: nameFilter || null,
    country: null,
    sort: "desc",
  });

  const addClient = useAddClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Client | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<Client | null>(null);

  const form = useForm<ClientType>({
    resolver: zodResolver(ClientSchema),
  });

  const { handleSubmit, control, reset } = form;

  const clients =
    data?.results?.map((client: Client, index: number) => ({
      ...client,
      sn: index + 1 + (page - 1) * 10,
    })) || [];

  // SEARCH only when button is clicked
  const applySearch = () => {
    setNameFilter(nameInput);
    setPage(1);
  };

  // CREATE
  const openCreateModal = () => {
    reset({
      first_name: "",
      last_name: "",
      email: "",
      phone_number: "",
      name_of_organisation: "",
      country: "",
      role: "org_admin",
    });

    setEditingRecord(null);
    setIsModalOpen(true);
  };

  // EDIT
  const openEditModal = (record: Client) => {
    reset({ ...record });
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  // DELETE POPUP
  const confirmDelete = (record: Client) => {
    setRecordToDelete(record);
    setIsDeleteOpen(true);
  };

  // DELETE ACTION
  const handleConfirmDelete = () => {
    if (!recordToDelete?.id) return;

    deleteClient.mutate(recordToDelete.id, {
      onSuccess: () => {
        toast.success("Client deleted successfully");
        setIsDeleteOpen(false);
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.detail || "Failed to delete client");
      },
    });
  };

  // SUBMIT FORM
  const onSubmit = (values: ClientType) => {
    const payload = { ...values, role: "org_admin" };

    if (editingRecord) {
      updateClient.mutate(
        { id: editingRecord.id, data: payload },
        {
          onSuccess: () => {
            toast.success("Client updated successfully");
            setIsModalOpen(false);
          },
          onError: (err: any) =>
            toast.error(
              err?.response?.data?.detail || "Failed to update client"
            ),
        }
      );
    } else {
      addClient.mutate(payload, {
        onSuccess: () => {
          toast.success("Client created successfully");
          setIsModalOpen(false);
        },
        onError: (err: any) =>
          toast.error(err?.response?.data?.detail || "Failed to create client"),
      });
    }
  };

  const columns = [
    { accessorKey: "sn", header: "S/N" },
    { accessorKey: "name_of_organisation", header: "Organisation" },
    {
      id: "admin",
      header: "Admin",
      cell: ({ row }: any) => {
        const c: Client = row.original;
        return `${c.first_name} ${c.last_name ?? ""}`;
      },
    },
    { accessorKey: "phone_number", header: "Phone" },
    { accessorKey: "email", header: "Email" },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const record = row.original;
        return (
          <div className="flex gap-3">
            <TbPencil
              className="cursor-pointer text-blue-500"
              onClick={() => openEditModal(record)}
            />
            <TbTrash
              className="cursor-pointer text-red-500"
              onClick={() => confirmDelete(record)}
            />
          </div>
        );
      },
    },
  ];

  return (
    <>
      {/* React Hot Toast */}
      <Toaster position="top-right" />

      <Card className="p-6 space-y-6">
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold"> All Clients</h2>
          <Button onClick={openCreateModal}>
            <TbPlus className="mr-2" /> Add Client
          </Button>
        </div>

        {/* ONLY NAME FILTER */}
        <div className="flex gap-3 max-w-md">
          <Input
            placeholder="Search name..."
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <Button variant="secondary" onClick={applySearch}>
            <TbSearch className="mr-2" /> Search
          </Button>
        </div>

        {/* TABLE */}
        <DataTable
          columns={columns}
          data={clients}
          isLoading={isLoading}
          page={page}
          pageSize={10}
          total={data?.count ?? 0}
          onPageChange={(p) => setPage(p)}
        />

        {/* CREATE/EDIT MODAL */}
        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-lg max-h-[75vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRecord ? "Update Client" : "Create Client"}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={control}
                    name="first_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="last_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="name_of_organisation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Organisation</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={control}
                    name="country"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Country</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <DialogFooter>
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={addClient.isPending || updateClient.isPending}
                  >
                    {addClient.isPending || updateClient.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingRecord ? "Updating..." : "Creating..."}
                      </>
                    ) : editingRecord ? (
                      "Update"
                    ) : (
                      "Create"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* DELETE MODAL */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>

            <p className="text-gray-600">
              Are you sure you want to delete{" "}
              <strong>{recordToDelete?.name_of_organisation}</strong>?
            </p>

            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setIsDeleteOpen(false)}
                disabled={deleteClient.isPending}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={deleteClient.isPending}
              >
                {deleteClient.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </>
  );
}
