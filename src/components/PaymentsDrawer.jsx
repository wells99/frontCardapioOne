import { Drawer, Form, InputNumber, Select, DatePicker, Button } from "antd";
import { useEffect } from "react";
import { useCriarPagamento, useEditarPagamento } from "../hooks/usePagamentos";

export default function PaymentsDrawer({ open, onClose, payment, orderId, total }) {
  const [form] = Form.useForm();
  const criarPagamento = useCriarPagamento();
  const editarPagamento = useEditarPagamento();

  useEffect(() => {
    if (payment) {
      // Preenche o formulário se existe um pagamento
      form.setFieldsValue({
        orderId: payment.orderId,
        method: payment.method,
        amount: payment.amount,
        status: payment.status,
        paidAt: payment.paidAt ? new Date(payment.paidAt) : null,
      });
    } else {
      // Se não, limpa o formulário e preenche o pedido e total
      form.resetFields();
      form.setFieldsValue({
        orderId,
        amount: total || 0, // <- pré-preenche com o total do pedido
        status: "Pendente",
      });
    }
  }, [payment, orderId, total, form]);

  const handleSubmit = (values) => {
    if (payment) {
      editarPagamento.mutate(
        { id: payment.id, ...values },
        { onSuccess: () => { form.resetFields(); onClose(); } }
      );
    } else {
      criarPagamento.mutate(values, { onSuccess: () => { form.resetFields(); onClose(); } });
    }
  };

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
    <Drawer
      title={payment ? "Editar Pagamento" : "Novo Pagamento"}
      onClose={onClose}
      open={open}
      width={400}
    >
      <Form form={form} layout="vertical" onFinish={handleSubmit}>
        <Form.Item label="Pedido ID" name="orderId">
          <InputNumber className="w-full" min={1} disabled />
        </Form.Item>

        <Form.Item label="Método" name="method" rules={[{ required: true }]}>
          <Select options={methodOptions} placeholder="Selecione o método" />
        </Form.Item>

        <Form.Item label="Valor" name="amount" rules={[{ required: true }]}>
          <InputNumber
            min={0}
            step={0.01}
            className="w-full"
            readOnly // <- aqui está o segredo
          />
        </Form.Item>

        <Form.Item label="Status" name="status" rules={[{ required: true }]}>
          <Select options={statusOptions} placeholder="Selecione o status" />
        </Form.Item>

        <Form.Item label="Data de Pagamento" name="paidAt">
          <DatePicker className="w-full" />
        </Form.Item>

        <Button type="primary" htmlType="submit" className="w-full">
          {payment ? "Editar" : "Criar"}
        </Button>
      </Form>
    </Drawer>
  );
}
