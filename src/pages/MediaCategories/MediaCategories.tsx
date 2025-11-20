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

import { DataTable } from "@/components/ui/datatable";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

import TextArea from "@/components/form/input/TextArea";
import {
  useAddMediaCategory,
  useDeleteMediaCategory,
  useMediaCategories,
  useUpdateMediaCategory,
} from "@/hooks/useMediaCategories";
import { MediaCategory } from "@/@type/MediaCategory";
import {
  MediaCategorySchema,
  MediaCategoryType,
} from "@/Schema/MediaCategorySchema";

export default function MediaCategories() {
  const [page, setPage] = useState(1);

  const [nameInput, setNameInput] = useState("");
  const [nameFilter, setNameFilter] = useState("");

  const { data, isLoading } = useMediaCategories({
    page,
    page_size: 10,
    name: nameFilter || null,
    sort: "desc",
  });

  const addCategory = useAddMediaCategory();
  const updateCategory = useUpdateMediaCategory();
  const deleteCategory = useDeleteMediaCategory();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<MediaCategory | null>(
    null
  );

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<MediaCategory | null>(
    null
  );

  const form = useForm<MediaCategoryType>({
    resolver: zodResolver(MediaCategorySchema),
  });

  const { handleSubmit, control, reset } = form;

  const categories =
    data?.results?.map((cat: MediaCategory, index: number) => ({
      ...cat,
      sn: index + 1 + (page - 1) * 10,
    })) || [];

  const applySearch = () => {
    setNameFilter(nameInput);
    setPage(1);
  };

  const openCreateModal = () => {
    reset({
      name: "",
      description: "",
    });

    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const openEditModal = (record: MediaCategory) => {
    reset({
      name: record.name,
      description: record.description ?? "",
    });

    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const confirmDelete = (record: MediaCategory) => {
    setRecordToDelete(record);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!recordToDelete?.id) return;

    deleteCategory.mutate(recordToDelete.id, {
      onSuccess: () => {
        toast.success("Media category deleted successfully");
        setIsDeleteOpen(false);
      },
      onError: (err: any) =>
        toast.error(
          err?.response?.data?.detail || "Failed to delete media category"
        ),
    });
  };

  const onSubmit = (values: MediaCategoryType) => {
    if (editingRecord) {
      updateCategory.mutate(
        { id: editingRecord.id, data: values },
        {
          onSuccess: () => {
            toast.success("Media category updated successfully");
            setIsModalOpen(false);
          },
          onError: (err: any) =>
            toast.error(
              err?.response?.data?.detail || "Failed to update media category"
            ),
        }
      );
    } else {
      addCategory.mutate(values, {
        onSuccess: () => {
          toast.success("Media category created successfully");
          setIsModalOpen(false);
        },
        onError: (err: any) =>
          toast.error(
            err?.response?.data?.detail || "Failed to create media category"
          ),
      });
    }
  };

  const columns = [
    { accessorKey: "sn", header: "S/N" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "description", header: "Description" },
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
      <Toaster position="top-right" />

      <Card className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Media Categories</h2>
          <Button onClick={openCreateModal}>
            <TbPlus className="mr-2" /> Add Media Category
          </Button>
        </div>

        <div className="flex gap-3 max-w-md">
          <Input
            placeholder="Search category name..."
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <Button variant="secondary" onClick={applySearch}>
            <TbSearch className="mr-2" /> Search
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={categories}
          isLoading={isLoading}
          page={page}
          pageSize={10}
          total={data?.count ?? 0}
          onPageChange={(p) => setPage(p)}
        />

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-lg max-h-[75vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingRecord ? "Update Category" : "Create Category"}
              </DialogTitle>
            </DialogHeader>

            <Form {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <TextArea
                          {...field}
                          rows={4}
                          placeholder="Enter description..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={addCategory.isPending || updateCategory.isPending}
                  >
                    {addCategory.isPending || updateCategory.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
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

        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Confirm Delete</DialogTitle>
            </DialogHeader>

            <p className="text-gray-600">
              Are you sure you want to delete{" "}
              <strong>{recordToDelete?.name}</strong>?
            </p>

            <DialogFooter>
              <Button
                variant="secondary"
                onClick={() => setIsDeleteOpen(false)}
                disabled={deleteCategory.isPending}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={deleteCategory.isPending}
              >
                {deleteCategory.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </>
  );
}
