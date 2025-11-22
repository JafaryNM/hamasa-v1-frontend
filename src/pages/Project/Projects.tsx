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
import { Card } from "@/components/ui/card";

import { TbTrash, TbEye, TbPlus, TbSearch } from "react-icons/tb";
import { Toaster, toast } from "react-hot-toast";
import { DataTable } from "@/components/ui/datatable";

import { useNavigate } from "react-router-dom";

import { Project } from "@/@type/Project";
import { useDeleteProject, useProjects } from "@/hooks/useProject";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

/* ---------------- STATUS BADGE ---------------- */
const StatusBadge = ({ status }: { status: string }) => {
  const variant: Record<string, string> = {
    Submitted: "bg-blue-500",
    Approved: "bg-green-500",
    Analyzed: "bg-yellow-500",
    Verified: "bg-purple-500",
  };

  return <Badge className={`${variant[status]} text-white`}>{status}</Badge>;
};

/* ---------------- STATUS OPTIONS ---------------- */
const PROJECT_STATUSES = ["Submitted", "Approved", "Analyzed", "Verified"];

export default function Projects() {
  const navigate = useNavigate();

  // search + pagination
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const pageSize = 10;

  const { data, isLoading } = useProjects({
    page,
    page_size: pageSize,
    search: search || null,
  });

  const deleteProject = useDeleteProject();

  const [selectedProject, setSelectedProject] = useState<Project | any>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleView = (project: Project) => {
    setSelectedProject(project);
    setViewOpen(true);
  };

  const handleDelete = (project: Project) => {
    setSelectedProject(project);
    setDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (!selectedProject) return;

    deleteProject.mutate(selectedProject.id, {
      onSuccess: () => {
        toast.success("Project deleted successfully!");
        setDeleteOpen(false);
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.detail || "Delete failed");
      },
    });
  };

  /* ------------------------------------------
     Add S/N + Dummy Status
  ------------------------------------------- */
  const STATUS_LIST = ["Submitted", "Approved", "Analyzed", "Verified"];

  const projectsWithSN = (data?.results ?? []).map((project, index) => ({
    ...project,
    sn: index + 1 + (page - 1) * pageSize,
    status: STATUS_LIST[index % STATUS_LIST.length],
  }));

  /* ------------------------------------------
     TABLE COLUMNS
  ------------------------------------------- */
  const columns: any = [
    { accessorKey: "sn", header: "S/N" },
    { accessorKey: "title", header: "Project Title" },
    { accessorKey: "description", header: "Description" },

    // STATUS COLUMN WITH BADGE

    {
      accessorKey: "media_sources",
      header: "Media Sources",
      cell: ({ row }: any) =>
        (row.original.media_sources ?? []).map((m: any) => m.name).join(", ") ||
        "None",
    },
    {
      accessorKey: "thematic_areas",
      header: "Thematic Areas",
      cell: ({ row }: any) =>
        (row.original.thematic_areas ?? []).length > 0
          ? row.original.thematic_areas[0].title
          : "None",
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }: any) => <StatusBadge status={row.original.status} />,
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }: any) => {
        const project = row.original;

        return (
          <div className="flex gap-3">
            <TbEye
              className="cursor-pointer text-green-600"
              onClick={() => handleView(project)}
            />

            {/* REMOVED EDIT */}

            <TbTrash
              className="cursor-pointer text-red-600"
              onClick={() => handleDelete(project)}
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
        {/* HEADER */}
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Projects</h2>

          <Button onClick={() => navigate("/addproject")}>
            <TbPlus className="mr-2" /> Add Project
          </Button>
        </div>

        {/* SEARCH */}
        <div className="flex gap-3 max-w-xl">
          {/* Search by title */}
          <Input
            placeholder="Search project..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-40"
          />

          {/* Search by status (not required) */}
          <Select onValueChange={(value) => setStatusFilter(value)}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Filter by Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Submitted">Submitted</SelectItem>
              <SelectItem value="Approved">Approved</SelectItem>
              <SelectItem value="Analyzed">Analyzed</SelectItem>
              <SelectItem value="Verified">Verified</SelectItem>
            </SelectContent>
          </Select>

          {/* Search button */}
          <Button variant="secondary" onClick={() => setPage(1)}>
            <TbSearch className="mr-2" /> Search
          </Button>
        </div>

        {/* TABLE */}
        <DataTable
          columns={columns}
          data={projectsWithSN}
          isLoading={isLoading}
          page={page}
          pageSize={pageSize}
          total={data?.count ?? 0}
          onPageChange={setPage}
        />

        {/* VIEW MODAL */}
        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="max-w-xl">
            <DialogHeader>
              <DialogTitle>Project Details</DialogTitle>
            </DialogHeader>

            {selectedProject && (
              <div className="space-y-2">
                <p>
                  <strong>Title:</strong> {selectedProject.title}
                </p>
                <p>
                  <strong>Description:</strong> {selectedProject.description}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <StatusBadge status={selectedProject.status} />
                </p>

                <p>
                  <strong>Media Sources:</strong>{" "}
                  {(selectedProject.media_sources ?? [])
                    .map((m) => m.name)
                    .join(", ") || "None"}
                </p>

                <p>
                  <strong>Thematic Area:</strong>{" "}
                  {(selectedProject.thematic_areas ?? []).length > 0
                    ? selectedProject.thematic_areas[0].title
                    : "None"}
                </p>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* DELETE MODAL */}
        <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader>
              <DialogTitle>Delete Project</DialogTitle>
            </DialogHeader>

            <p className="py-4">
              Are you sure you want to delete{" "}
              <strong>{selectedProject?.title}</strong>?
            </p>

            <DialogFooter>
              <Button variant="secondary" onClick={() => setDeleteOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete}>
                Delete
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </>
  );
}
