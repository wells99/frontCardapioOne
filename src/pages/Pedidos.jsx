import { useContext, useState } from "react";
import { AntContext } from "../contexts/AntContext";
import { Button, Drawer, Form, Input, Popconfirm, Table, Select, InputNumber } from "antd";
import { DeleteFilled, EditFilled, PlusCircleOutlined, DollarCircleOutlined } from "@ant-design/icons";
import { useBuscarPedidos, useCriarPedido, useDeletarPedido, useEditarPedido } from "../hooks/pedidoHooks";
import { useBuscarProdutos } from "../hooks/produtoHooks";
import { useBuscarClientes } from "../hooks/clienteHooks";
import PaymentsDrawer from "../components/PaymentsDrawer";

const Pedidos = () => {
  const [visibleCreate, setVisibleCreate] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const { api } = useContext(AntContext);
  const { data: pedidos, refetch } = useBuscarPedidos();
  const { data: produtos } = useBuscarProdutos();
  const { data: clientes } = useBuscarClientes();
  const { mutateAsync: criar } = useCriarPedido();
  const { mutateAsync: deletar } = useDeletarPedido();
  const { mutateAsync: editar } = useEditarPedido();

  // COLUNAS DA TABELA
  const colunas = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Situação", dataIndex: "status", key: "status" },
    {
      title: "Total",
      dataIndex: "total",
      key: "total",
      render: (text) => `R$ ${text.toFixed(2)}`,
    },
    {
      title: "Mesa",
      dataIndex: "tableNumber",
      key: "tableNumber",
      render: (text) => text || "N/A",
    },
    {
      title: "Tipo",
      dataIndex: "orderType",
      key: "orderType",
      render: (text) => text || "N/A",
    },
    {
      title: "Cliente",
      dataIndex: ["client", "name"],
      key: "client",
      render: (text) => text || "Sem cliente",
    },
    {
      title: "Itens",
      dataIndex: "items",
      key: "items",
      render: (items) => (
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              {item.productName} ({item.quantity})
            </li>
          ))}
        </ul>
      ),
    },
    {
      title: "Opções",
      key: "x",
      width: "12%",
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
          <div
            className="w-[30px] h-[30px] flex justify-center items-center cursor-pointer duration-150 border border-transparent rounded-full hover:border-marrom group"
            onClick={() => openDrawerPayment(record.payment, record.id, record.total)}
          >
            <DollarCircleOutlined className="duration-150 !text-bege group-hover:!text-marrom" />
          </div>
        </div>
      ),
    },
  ];

  // ABRIR CRIAR
  function openDrawerCreate() {
    setVisibleCreate(true);
    setIsEditing(false);
    form.resetFields();
    form.setFieldsValue({ items: [{}] });
  }

  // ABRIR EDITAR
  function openDrawerEdit(record) {
    setIsEditing(true);
    setVisibleCreate(true);
    form.resetFields();

    const mappedItems = record.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      productName: item.productName,
    }));

    form.setFieldsValue({
      id: record.id,
      status: record.status,
      total: record.total,
      tableNumber: record.tableNumber,
      orderType: record.orderType,
      clientId: record.clientId,
      items: mappedItems,
    });
  }

  // SUBMISSÃO
  function handleSubmit(dados) {
    const itemsWithDetails = dados.items.map((item) => {
      const produtoSelecionado = produtos.find((p) => p.id === item.productId);
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice: produtoSelecionado ? produtoSelecionado.price : item.unitPrice,
        productName: produtoSelecionado ? produtoSelecionado.name : item.productName,
      };
    });

    const total = itemsWithDetails.reduce(
      (sum, item) => sum + item.quantity * item.unitPrice,
      0
    );

    const dataToSend = { ...dados, total, items: itemsWithDetails };

    if (isEditing) {
      editar(dataToSend, {
        onSuccess: () => {
          form.resetFields();
          setVisibleCreate(false);
          setIsEditing(false);
          api.success({ description: "Pedido editado com sucesso!" });
          refetch();
        },
        onError: (error) => {
          api.error({
            description: error.response?.data?.message || "Erro ao editar Pedido.",
          });
        },
      });
    } else {
      criar(dataToSend, {
        onSuccess: () => {
          form.resetFields();
          setVisibleCreate(false);
          setIsEditing(false);
          api.success({ description: "Pedido criado com sucesso!" });
          refetch();
        },
        onError: (error) => {
          api.error({
            description: error.response?.data?.message || "Erro ao criar Pedido.",
          });
        },
      });
    }
  }

  // DELETAR
  function handleDelete(id) {
    deletar(id, {
      onSuccess: () => {
        api.success({ description: "Pedido deletado com sucesso!" });
        refetch();
      },
      onError: (error) => {
        api.error({
          description: error.response?.data?.message || "Erro ao deletar Pedido.",
        });
      },
    });
  }

  // OPTIONS
  const clientesOptions = clientes?.map((c) => ({ label: c.name, value: c.id })) || [];
  const produtosOptions = produtos?.map((p) => ({ label: p.name, value: p.id, price: p.price })) || [];

  // Drawer pagamento
  const [drawerPaymentOpen, setDrawerPaymentOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [selectedOrderTotal, setSelectedOrderTotal] = useState(0);

  function openDrawerPayment(payment, orderId, total) {
    setSelectedPayment(payment || null);
    setSelectedOrderId(orderId);
    setSelectedOrderTotal(total);
    setDrawerPaymentOpen(true);
  }

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-lg text-bege font-bold">Pedidos</h1>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => openDrawerCreate()}
          >
            Novo Pedido
          </Button>
        </div>
        <Table rowKey={"id"} dataSource={pedidos} columns={colunas} />
      </div>

      <Drawer
        title={isEditing ? "Editar Pedido" : "Criar Pedido"}
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
            label="Status"
            name={"status"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Select placeholder="Selecione o status do pedido">
              <Select.Option value="pendente">Pendente</Select.Option>
              <Select.Option value="preparando">Em Preparo</Select.Option>
              <Select.Option value="pronto">Pronto</Select.Option>
              <Select.Option value="entregue">Entregue</Select.Option>
              <Select.Option value="cancelado">Cancelado</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Mesa" name={"tableNumber"}>
            <InputNumber placeholder="Número da mesa" />
          </Form.Item>

          <Form.Item
            label="Tipo do Pedido"
            name={"orderType"}
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Select placeholder="Selecione o tipo de pedido">
              <Select.Option value="entrega">Entrega</Select.Option>
              <Select.Option value="local">Mesa</Select.Option>
              <Select.Option value="retirada">Retirada</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Cliente" name={"clientId"}>
            <Select
              placeholder="Selecione um cliente (opcional)"
              showSearch
              optionFilterProp="children"
              filterOption={(input, option) =>
                (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
              }
              options={clientesOptions}
            />
          </Form.Item>

          {/* Lista de Itens */}
          <Form.List name="items">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} className="flex gap-2 items-center mb-4">
                    <Form.Item
                      {...restField}
                      name={[name, "productId"]}
                      className="flex-1 mb-0"
                      rules={[{ required: true, message: "Selecione um produto" }]}
                    >
                      <Select
                        placeholder="Selecione um produto"
                        showSearch
                        optionFilterProp="children"
                        filterOption={(input, option) =>
                          (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                        }
                        onChange={(value) => {
                          const produtoSelecionado = produtos.find((p) => p.id === value);
                          if (produtoSelecionado) {
                            const currentItems = form.getFieldValue("items");
                            currentItems[name] = {
                              ...currentItems[name],
                              unitPrice: produtoSelecionado.price,
                              productName: produtoSelecionado.name,
                            };
                            form.setFieldsValue({ items: currentItems });
                          }
                        }}
                        options={produtosOptions}
                      />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "quantity"]}
                      className="flex-1 mb-0"
                      rules={[{ required: true, message: "Insira a quantidade" }]}
                    >
                      <InputNumber placeholder="Qtd" min={1} />
                    </Form.Item>

                    <Form.Item
                      {...restField}
                      name={[name, "unitPrice"]}
                      className="flex-1 mb-0"
                    >
                      <InputNumber placeholder="Preço" disabled />
                    </Form.Item>

                    <Form.Item {...restField} name={[name, "productName"]} hidden>
                      <Input />
                    </Form.Item>

                    <Button onClick={() => remove(name)} danger icon={<DeleteFilled />} />
                  </div>
                ))}
                <Form.Item>
                  <Button
                    type="dashed"
                    onClick={() => add()}
                    block
                    icon={<PlusCircleOutlined />}
                  >
                    Adicionar Item
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Button type="primary" className="w-full" htmlType="submit">
            {isEditing ? "Editar" : "Criar"}
          </Button>
        </Form>
      </Drawer>

      <PaymentsDrawer
        open={drawerPaymentOpen}
        onClose={() => {
          setDrawerPaymentOpen(false);
          setSelectedPayment(null);
          setSelectedOrderId(null);
          setSelectedOrderTotal(null);
        }}
        payment={selectedPayment}
        orderId={selectedOrderId}
        total={selectedOrderTotal}
      />
    </>
  );
};

export default Pedidos;
