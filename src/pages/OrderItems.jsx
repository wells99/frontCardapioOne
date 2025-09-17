import { useContext, useState } from "react";
import { AntContext } from "../contexts/AntContext";
import {
  Button,
  Drawer,
  Form,
  Input,
  Popconfirm,
  Table,
  Select,
  InputNumber,
} from "antd";
import {
  DeleteFilled,
  EditFilled,
  PlusCircleOutlined,
} from "@ant-design/icons";

import {
  useBuscarOrderItems,
  useCriarOrderItem,
  useEditarOrderItem,
  useDeletarOrderItem,
} from "../hooks/orderItemHooks";
import { useBuscarPedidos } from "../hooks/pedidoHooks";
import { useBuscarProdutos } from "../hooks/produtoHooks";

const OrderItems = () => {
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const { api } = useContext(AntContext);

  const { data: orderItems, refetch } = useBuscarOrderItems();
  const { data: pedidos } = useBuscarPedidos();
  const { data: produtos } = useBuscarProdutos();

  const { mutateAsync: criar } = useCriarOrderItem();
  const { mutateAsync: editar } = useEditarOrderItem();
  const { mutateAsync: deletar } = useDeletarOrderItem();

  // ------------------------------
  // COLUNAS DA TABELA
  // ------------------------------
  const colunas = [
    { title: "ID", dataIndex: "id", key: "id" },
    {
      title: "Pedido",
      dataIndex: ["order", "id"],
      key: "order",
      render: (id) => `#${id}`,
    },
    {
      title: "Produto",
      dataIndex: ["product", "name"],
      key: "product",
    },
    {
      title: "Quantidade",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Preço Unitário",
      dataIndex: "unitPrice",
      key: "unitPrice",
      render: (v) => `R$ ${v.toFixed(2)}`,
    },
    {
      title: "Opções",
      key: "x",
      width: "9%",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-between">
          <div
            className="w-[30px] h-[30px] flex justify-center items-center cursor-pointer duration-150 border border-transparent rounded-full hover:border-marrom group"
            onClick={() => openDrawerEdit(record)}
          >
            <EditFilled className=" duration-150 !text-bege group-hover:!text-marrom" />
          </div>
          <Popconfirm
            title="Deseja excluir?"
            okText="Sim"
            cancelText="Não"
            onConfirm={() => handleDelete(record.id)}
          >
            <div className="w-[30px] h-[30px] flex justify-center items-center cursor-pointer duration-150 border border-transparent rounded-full hover:border-marrom group">
              <DeleteFilled className=" duration-150 !text-bege group-hover:!text-marrom" />
            </div>
          </Popconfirm>
        </div>
      ),
    },
  ];

  // ------------------------------
  // ABRIR CRIAR
  // ------------------------------
  function openDrawerCreate() {
    setVisibleCreate(true);
    setIsEditing(false);
    form.resetFields();
  }

  // ------------------------------
  // ABRIR EDITAR
  // ------------------------------
  function openDrawerEdit(record) {
    setIsEditing(true);
    setVisibleCreate(true);
    form.resetFields();
    form.setFieldsValue({
      id: record.id,
      orderId: record.orderId,
      productId: record.productId,
      quantity: record.quantity,
      unitPrice: record.unitPrice,
    });
  }

  // ------------------------------
  // SUBMIT (CRIAR/EDITAR)
  // ------------------------------
  function handleSubmit(dados) {
    if (isEditing) {
      editar(dados, {
        onSuccess: () => {
          api.success({ description: "Item de pedido editado com sucesso!" });
          form.resetFields();
          setVisibleCreate(false);
          setIsEditing(false);
          refetch();
        },
        onError: (error) => {
          api.error({
            description:
              error.response?.data?.message ||
              "Erro ao editar Item de Pedido.",
          });
        },
      });
    } else {
      criar(dados, {
        onSuccess: () => {
          api.success({ description: "Item de pedido criado com sucesso!" });
          form.resetFields();
          setVisibleCreate(false);
          refetch();
        },
        onError: (error) => {
          api.error({
            description:
              error.response?.data?.message ||
              "Erro ao criar Item de Pedido.",
          });
        },
      });
    }
  }

  // ------------------------------
  // DELETAR
  // ------------------------------
  function handleDelete(id) {
    deletar(id, {
      onSuccess: () => {
        api.success({ description: "Item de pedido deletado com sucesso!" });
        refetch();
      },
      onError: (error) => {
        api.error({
          description:
            error.response?.data?.message || "Erro ao deletar Item de Pedido.",
        });
      },
    });
  }

  // ------------------------------
  // OPTIONS PARA SELECTS
  // ------------------------------
  const pedidosOptions =
    pedidos?.map((p) => ({
      label: `#${p.id} - ${p.client?.name || "Sem cliente"}`,
      value: p.id,
    })) || [];

  const produtosOptions =
    produtos?.map((p) => ({
      label: p.name,
      value: p.id,
      price: p.price,
    })) || [];

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-lg text-bege font-bold">Itens de Pedido</h1>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => openDrawerCreate()}
          >
            Novo Item
          </Button>
        </div>

        <Table rowKey={"id"} dataSource={orderItems} columns={colunas} />
      </div>

      <Drawer
        title={isEditing ? "Editar Item" : "Criar Item"}
        onClose={() => {
          setVisibleCreate(false);
          setIsEditing(false);
          form.resetFields();
        }}
        open={visibleCreate}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item name={"id"} hidden>
            <Input />
          </Form.Item>

          <Form.Item
            label="Pedido"
            name={"orderId"}
            rules={[{ required: true, message: "Selecione um pedido!" }]}
          >
            <Select
              placeholder="Selecione o pedido"
              options={pedidosOptions}
            />
          </Form.Item>

          <Form.Item
            label="Produto"
            name={"productId"}
            rules={[{ required: true, message: "Selecione um produto!" }]}
          >
            <Select
              placeholder="Selecione o produto"
              options={produtosOptions}
              onChange={(value) => {
                const produtoSelecionado = produtos.find((p) => p.id === value);
                if (produtoSelecionado) {
                  form.setFieldsValue({ unitPrice: produtoSelecionado.price });
                }
              }}
            />
          </Form.Item>

          <Form.Item
            label="Quantidade"
            name={"quantity"}
            rules={[{ required: true, message: "Informe a quantidade!" }]}
          >
            <InputNumber min={1} className="w-full" />
          </Form.Item>

          <Form.Item
            label="Preço Unitário"
            name={"unitPrice"}
            rules={[{ required: true, message: "Informe o preço!" }]}
          >
            <InputNumber min={0} step={0.01} className="w-full" />
          </Form.Item>

          <Button type="primary" className="w-full" htmlType="submit">
            {isEditing ? "Editar" : "Criar"}
          </Button>
        </Form>
      </Drawer>
    </>
  );
};

export default OrderItems;
