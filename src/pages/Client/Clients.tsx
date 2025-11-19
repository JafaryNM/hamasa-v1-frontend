import { useState } from "react";
import {
  Table,
  Button,
  Modal,
  Input,
  Row,
  Col,
  Form as AntForm,
  Select,
  Card,
} from "antd";
import { TbPencil, TbPlus, TbTrash, TbSearch } from "react-icons/tb";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import moment from "moment";

import {
  useClients,
  useAddClient,
  useUpdateClient,
  useDeleteClient,
} from "@/hooks/useClients";

import { Client } from "@/@type/Client";
import { ClientSchema, ClientType } from "@/Schema/ClientSchema";

export default function Clients() {
  // Fetch list
  const { data, isLoading } = useClients();

  const addClient = useAddClient();
  const updateClient = useUpdateClient();
  const deleteClient = useDeleteClient();

  const [search, setSearch] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState<Client | null>(null);

  // React Hook Form
  const {
    control,
    reset,
    handleSubmit,
    formState: { errors },
  } = useForm<ClientType>({
    resolver: zodResolver(ClientSchema),
  });

  // Format table data
  const clients =
    data?.results?.map((client: Client, index: number) => ({
      ...client,
      key: client.uid,
      sn: index + 1,
    })) || [];

  // -------- Modal --------
  const openCreateModal = () => {
    reset({
      first_name: "",
      last_name: "",
      phone_number: "",
      email: "",
      name_of_organisation: "",
      country: "",
      sector: "",
      plain_password: "",
      role: "org_admin", // always default
    });
    setEditingRecord(null);
    setIsModalOpen(true);
  };

  const openEditModal = (record: Client) => {
    reset(record);
    setEditingRecord(record);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    reset();
    setIsModalOpen(false);
  };

  // -------- CREATE / UPDATE --------
  const onSubmit = (values: ClientType) => {
    const payload = {
      ...values,
      role: "org_admin", // always ensure default
    };

    if (editingRecord) {
      updateClient.mutate(
        { ...payload, uid: editingRecord.uid },
        {
          onSuccess: () => {
            toast.success("Client updated successfully");
            closeModal();
          },
          onError: (err: any) =>
            toast.error(
              err?.response?.data?.message || "Failed to update client"
            ),
        }
      );
    } else {
      addClient.mutate(payload, {
        onSuccess: () => {
          toast.success("Client created successfully");
          closeModal();
        },
        onError: (err: any) =>
          toast.error(
            err?.response?.data?.message || "Failed to create client"
          ),
      });
    }
  };

  // -------- DELETE --------
  const handleDelete = (record: Client) => {
    Modal.confirm({
      title: "Delete Client",
      content: `Are you sure you want to delete "${record.first_name} ${record.last_name}"?`,
      okType: "danger",
      onOk: () => {
        deleteClient.mutate(record.uid!, {
          onSuccess: () => toast.success("Client deleted"),
          onError: () => toast.error("Failed to delete client"),
        });
      },
    });
  };

  // -------- COLUMNS --------
  const columns = [
    { title: "S/N", dataIndex: "sn", width: 70 },

    { title: "Organisation", dataIndex: "name_of_organisation" },
    {
      title: "Organisation Admin",
      render: (c: Client) => `${c.first_name} ${c.last_name}`,
    },
    { title: "Phone", dataIndex: "phone_number" },

    { title: "Email", dataIndex: "email" },

    // {
    //   title: "Created",
    //   dataIndex: "created_at",
    //   render: (value: string) => moment(value).format("DD MMM YYYY"),
    // },

    {
      title: "Actions",
      width: 130,
      render: (_: string, record: Client) => (
        <div className="flex gap-3">
          <TbPencil
            size={18}
            className="cursor-pointer text-blue-500"
            onClick={() => openEditModal(record)}
          />
          <TbTrash
            size={20}
            className="cursor-pointer text-red-500"
            onClick={() => handleDelete(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card className="shadow-md rounded-lg p-5">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3 mb-6">
          <h2 className="text-xl font-semibold">Clients</h2>

          <Button
            type="primary"
            icon={<TbPlus size={18} />}
            onClick={openCreateModal}
          >
            Add Client
          </Button>
        </div>

        {/* Search */}
        <Row className="mb-4">
          <Col span={24}>
            <div className="flex flex-col md:flex-row gap-3">
              <Input
                placeholder="Search clients..."
                prefix={<TbSearch />}
                onChange={(e) => setSearch(e.target.value)}
              />

              <Button icon={<TbSearch />}>Search</Button>
            </div>
          </Col>
        </Row>

        {/* Table */}
        <Table
          dataSource={clients}
          columns={columns}
          rowKey="uid"
          loading={isLoading}
          bordered
        />
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        title={editingRecord ? "Update Client" : "Create Client"}
        open={isModalOpen}
        onCancel={closeModal}
        footer={null}
        centered
        width={600}
        bodyStyle={{
          padding: "24px 32px",
          maxHeight: "70vh",
          overflowY: "auto",
        }}
      >
        <AntForm layout="vertical" onFinish={handleSubmit(onSubmit)}>
          <Row gutter={16}>
            <Col span={12}>
              <AntForm.Item
                label="First Name"
                validateStatus={errors.first_name ? "error" : ""}
                help={errors.first_name?.message}
              >
                <Controller
                  name="first_name"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
              </AntForm.Item>
            </Col>

            <Col span={12}>
              <AntForm.Item
                label="Last Name"
                validateStatus={errors.last_name ? "error" : ""}
                help={errors.last_name?.message}
              >
                <Controller
                  name="last_name"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
              </AntForm.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <AntForm.Item
                label="Email"
                validateStatus={errors.email ? "error" : ""}
                help={errors.email?.message}
              >
                <Controller
                  name="email"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
              </AntForm.Item>
            </Col>

            <Col span={12}>
              <AntForm.Item
                label="Phone Number"
                validateStatus={errors.phone_number ? "error" : ""}
                help={errors.phone_number?.message}
              >
                <Controller
                  name="phone_number"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
              </AntForm.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <AntForm.Item
                label="Organisation Name"
                validateStatus={errors.name_of_organisation ? "error" : ""}
                help={errors.name_of_organisation?.message}
              >
                <Controller
                  name="name_of_organisation"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
              </AntForm.Item>
            </Col>

            <Col span={12}>
              <AntForm.Item
                label="Country"
                validateStatus={errors.country ? "error" : ""}
                help={errors.country?.message}
              >
                <Controller
                  name="country"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
              </AntForm.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <AntForm.Item
                label="Sector"
                validateStatus={errors.sector ? "error" : ""}
                help={errors.sector?.message}
              >
                <Controller
                  name="sector"
                  control={control}
                  render={({ field }) => <Input {...field} />}
                />
              </AntForm.Item>
            </Col>

            <Col span={12}>
              <AntForm.Item
                label="Password"
                validateStatus={errors.plain_password ? "error" : ""}
                help={errors.plain_password?.message}
              >
                <Controller
                  name="plain_password"
                  control={control}
                  render={({ field }) => <Input.Password {...field} />}
                />
              </AntForm.Item>
            </Col>
          </Row>

          {/* No ROLE FIELD — hidden & always org_admin */}
          <input type="hidden" {...{ value: "org_admin" }} />

          <Button
            type="primary"
            htmlType="submit"
            block
            style={{ height: 40, fontSize: 16 }}
          >
            {editingRecord ? "Update" : "Create"}
          </Button>
        </AntForm>
      </Modal>
    </div>
  );
}
