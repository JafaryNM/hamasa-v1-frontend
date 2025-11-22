import { useEffect, useState } from "react";
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

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { TbPencil, TbTrash, TbPlus, TbSearch } from "react-icons/tb";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast, Toaster } from "react-hot-toast";

import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

import {
  useAddMedia,
  useDeleteMedia,
  useMedias,
  useUpdateMedia,
} from "@/hooks/useMedia";

import { Media } from "@/@type/Media";
import { MediaSchema, MediaType } from "@/Schema/MediaSchema";
import { useMedia } from "@/hooks/useMedia"; // Single record fetch
import { DataTable } from "@/components/ui/datatable";

export default function MediaPage() {
  const [page, setPage] = useState(1);
  const [nameInput, setNameInput] = useState("");
  const [nameFilter, setNameFilter] = useState("");
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);

  const { data, isLoading } = useMedias({
    page,
    page_size: 10,
    name: nameFilter || null,
    sort: "desc",
  });

  const mediaDetails = useMedia(selectedId);

  const addMedia = useAddMedia();
  const updateMedia = useUpdateMedia();
  const deleteMedia = useDeleteMedia();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<Media | null>(null);

  const form = useForm<MediaType>({
    resolver: zodResolver(MediaSchema),
    defaultValues: {
      name: "",
      category_name: "",
    },
  });

  const { handleSubmit, control, reset } = form;
  const MEDIA_CATEGORY_OPTIONS = [
    { category_name: "Social Media" },
    { category_name: "Print Media" },
    { category_name: "TV" },
    { category_name: "Radio" },
  ];

  useEffect(() => {
    if (mediaDetails.data && isModalOpen) {
      reset({
        name: mediaDetails.data.name,
        category_name: mediaDetails.data.category_name,
      });
    }
  }, [mediaDetails.data, isModalOpen]);

  const medias =
    data?.results?.map((media: Media, index: number) => ({
      ...media,
      sn: index + 1 + (page - 1) * 10,
    })) || [];

  const applySearch = () => {
    setNameFilter(nameInput);
    setPage(1);
  };

  const openCreateModal = () => {
    setSelectedId(null);
    reset({ name: "", category_name: "" });
    setIsModalOpen(true);
  };

  const openEditModal = (record: Media) => {
    setSelectedId(record.id);
    setIsModalOpen(true);
  };

  const confirmDelete = (record: Media) => {
    setRecordToDelete(record);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!recordToDelete?.id) return;

    deleteMedia.mutate(recordToDelete.id, {
      onSuccess: () => {
        toast.success("Media deleted successfully");
        setIsDeleteOpen(false);
      },
      onError: (err: any) =>
        toast.error(err?.response?.data?.detail || "Failed to delete media"),
    });
  };

  const onSubmit = (values: MediaType) => {
    if (selectedId) {
      updateMedia.mutate(
        { id: selectedId, data: values },
        {
          onSuccess: () => {
            toast.success("Media updated successfully");
            setIsModalOpen(false);
          },
          onError: (err: any) =>
            toast.error(
              err?.response?.data?.detail || "Failed to update media"
            ),
        }
      );
    } else {
      addMedia.mutate(values, {
        onSuccess: () => {
          toast.success("Media created successfully");
          setIsModalOpen(false);
        },
        onError: (err: any) =>
          toast.error(err?.response?.data?.detail || "Failed to create media"),
      });
    }
  };

  const columns = [
    { accessorKey: "sn", header: "S/N" },
    { accessorKey: "name", header: "Name" },
    { accessorKey: "category_name", header: "Category" },
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
          <h2 className="text-xl font-semibold">Media Sources</h2>
          <Button onClick={openCreateModal}>
            <TbPlus className="mr-2" /> Add Media
          </Button>
        </div>

        <div className="flex gap-3 max-w-md">
          <Input
            placeholder="Search media name..."
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
          <Button variant="secondary" onClick={applySearch}>
            <TbSearch className="mr-2" /> Search
          </Button>
        </div>

        <DataTable
          columns={columns}
          data={medias}
          isLoading={isLoading}
          page={page}
          pageSize={10}
          total={data?.count ?? 0}
          onPageChange={(p) => setPage(p)}
        />

        <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>
                {selectedId ? "Update Media" : "Create Media"}
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
                        <Input
                          value={field.value || ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={control}
                  name="category_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Media Category</FormLabel>
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>

                          <SelectContent>
                            {MEDIA_CATEGORY_OPTIONS.map((cat) => (
                              <SelectItem
                                key={cat.category_name}
                                value={cat.category_name}
                              >
                                {cat.category_name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter>
                  <Button
                    type="submit"
                    disabled={addMedia.isPending || updateMedia.isPending}
                  >
                    {addMedia.isPending || updateMedia.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : selectedId ? (
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
                disabled={deleteMedia.isPending}
              >
                Cancel
              </Button>

              <Button
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={deleteMedia.isPending}
              >
                {deleteMedia.isPending ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </>
  );
}
