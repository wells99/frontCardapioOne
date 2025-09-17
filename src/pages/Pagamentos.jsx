import { useBuscarPagamentos, useDeletarPagamento, useCriarPagamento, useEditarPagamento } from "../hooks/usePagamentos";
import { useState } from "react";
import { Button, Table, Drawer, Form, InputNumber, Select, DatePicker, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined, PlusCircleOutlined } from "@ant-design/icons";

export default function Pagamentos() {
  const { data: pagamentos, isLoading, refetch } = useBuscarPagamentos();
  const deletarPagamento = useDeletarPagamento();
  const criarPagamento = useCriarPagamento();
  const editarPagamento = useEditarPagamento();

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editPagamento, setEditPagamento] = useState(null);
  const [form] = Form.useForm();

  const handleDelete = (id) => {
    Popconfirm.confirm({
      title: "Tem certeza?",
      content: "Essa ação não pode ser desfeita.",
      okText: "Sim",
      cancelText: "Cancelar",
      onConfirm: () => deletarPagamento.mutate(id, { onSuccess: refetch }),
    });
  };

  const handleSubmit = (values) => {
    if (editPagamento) {
      editarPagamento.mutate(
        { id: editPagamento.id, ...values },
        {
          onSuccess: () => {
            form.resetFields();
            setDrawerOpen(false);
            setEditPagamento(null);
            refetch();
          },
        }
      );
    } else {
      criarPagamento.mutate(values, {
        onSuccess: () => {
          form.resetFields();
          setDrawerOpen(false);
          refetch();
        },
      });
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id" },
    { title: "Pedido", dataIndex: ["order", "id"], render: (id) => `#${id}` },
    { title: "Método", dataIndex: "method" },
    { title: "Valor", dataIndex: "amount", render: (valor) => `R$ ${valor.toFixed(2)}` },
    { title: "Status", dataIndex: "status" },
    { title: "Data de Pagamento", dataIndex: "paidAt", render: (date) => (date ? new Date(date).toLocaleDateString("pt-BR") : "—") },
    {
      title: "Opções",
      render: (_, record) => (
        <div className="flex gap-2">
          <Button
            icon={<EditOutlined />}
            type="link"
            onClick={() => {
              setEditPagamento(record);
              form.setFieldsValue({
                orderId: record.orderId,
                method: record.method,
                amount: record.amount,
                status: record.status,
                paidAt: record.paidAt ? new Date(record.paidAt) : null,
              });
              setDrawerOpen(true);
            }}
          />
          <Popconfirm
            title="Tem certeza?"
            okText="Sim"
            cancelText="Cancelar"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button icon={<DeleteOutlined />} type="link" danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  const statusOptions = [
    { label: "Pendente", value: "Pendente" },
    { label: "Pago", value: "Pago" },
    { label: "Cancelado", value: "Cancelado" },
  ];

  const methodOptions = [
    { label: "Cartão", value: "Cartão" },
    { label: "Dinheiro", value: "Dinheiro" },
    { label: "Pix", value: "Pix" },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-bold">Pagamentos</h2>
        
      </div>

      <Table rowKey="id" columns={columns} dataSource={pagamentos} loading={isLoading} pagination={{ pageSize: 8 }} />

      <Drawer
        title={editPagamento ? "Editar Pagamento" : "Novo Pagamento"}
        onClose={() => {
          setDrawerOpen(false);
          setEditPagamento(null);
          form.resetFields();
        }}
        open={drawerOpen}
        width={400}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Pedido ID"
            name="orderId"
            rules={[{ required: true, message: "Informe o ID do pedido" }]}
          >
            <InputNumber className="w-full" min={1} />
          </Form.Item>

          <Form.Item
            label="Método"
            name="method"
            rules={[{ required: true, message: "Selecione o método de pagamento" }]}
          >
            <Select options={methodOptions} placeholder="Selecione o método" />
          </Form.Item>

          <Form.Item
            label="Valor"
            name="amount"
            rules={[{ required: true, message: "Informe o valor" }]}
          >
            <InputNumber min={0} step={0.01} className="w-full" />
          </Form.Item>

          <Form.Item
            label="Status"
            name="status"
            rules={[{ required: true, message: "Selecione o status" }]}
          >
            <Select options={statusOptions} placeholder="Selecione o status" />
          </Form.Item>

          <Form.Item label="Data de Pagamento" name="paidAt">
            <DatePicker showTime className="w-full" />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full">
            {editPagamento ? "Editar" : "Criar"}
          </Button>
        </Form>
      </Drawer>
    </div>
  );
}
