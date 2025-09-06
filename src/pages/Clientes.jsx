import { useContext, useState } from "react"
import { AntContext } from "../contexts/AntContext"
import { Button, Drawer, Form, Input, Popconfirm, Table } from "antd"
import { DeleteFilled, EditFilled, PlusCircleOutlined } from "@ant-design/icons"
import { useBuscarClientes, useCriarCliente, useDeletarCliente, useEditarCliente } from "../hooks/clienteHooks"

const Clientes = () => {
    const [visibleCreate, setVisibleCreate] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [form] = Form.useForm()
    const { api } = useContext(AntContext)
    const { data: clientes } = useBuscarClientes();
    const { mutateAsync: criar } = useCriarCliente();
    const { mutateAsync: editar } = useEditarCliente();
    const { mutateAsync: deletar } = useDeletarCliente();

    // COLUNAS DA TABELA
    const colunas = [
        {
            title: "Nome",
            dataIndex: "name",
            key: "id",
        }, {
            title: "Telefone",
            dataIndex: "phone",
            key: "phone",
        },
         {
            title: "Endereço",
            dataIndex: "address",
            key: "address",
        },
        {
            title: "Opções",
            key: "x",
            width: "9%",
            align: "center",
            render: (_, record) => (
                <div className="flex justify-between">
                    <div className="w-[30px] h-[30px] flex justify-center items-center cursor-pointer duration-150 border border-transparent rounded-full hover:border-marrom group" onClick={() => openDrawerEdit(record)}>
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
    ]

    // ABRIR CRIAR
    function openDrawerCreate() {
        setVisibleCreate(true)
        setIsEditing(false)
        form.resetFields()
    }

    // CRIAR
    function handleCreate(dados) {
        criar(dados, {
            onSuccess: (resposta) => {
                form.resetFields();
                setVisibleCreate(false);
                api.success({
                    description: 'Cliente Criado com sucesso!',
                });
            },
            onError: (error) => {
                api.error({
                    description: error.response?.data?.message || 'Erro ao Criar Cliente.',
                });
            },

        });

    }

    // ABRIR EDITAR
    function openDrawerEdit(record) {
        setIsEditing(true)
        setVisibleCreate(true)
        form.setFieldsValue({
            id: record.id,
            name: record.name,
            phone: record.phone,
            address: record.address,
        })
    }

    // EDITAR
    function handleEdit(dados) {
        editar(dados, {
            onSuccess: (resposta) => {
                form.resetFields();
                setVisibleCreate(false);
                setIsEditing(false);

                // Exiba uma notificação de sucesso.
                api.success({
                    description: 'Cliente editado com sucesso!',
                });
            },
            onError: (error) => {
                api.error({
                    description: error.response?.data?.message || 'Erro ao editar Cliente.',
                });
            },
        });
    }

    // DELETAR
    function handleDelete(id) {
        deletar(id, {
            onSuccess: (resposta) => {
                // Exiba uma notificação de sucesso.
                api.success({
                    description: 'Cliente deletada com sucesso!',
                });
            },
            onError: (error) => {
                api.error({
                    description: error.response?.data?.message || 'Erro ao deletar Cliente.',
                });
            }

        })


    }

    return (
        <>
            <div>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-lg text-bege font-bold">Clientes</h1>
                    <Button
                        type="primary"
                        icon={<PlusCircleOutlined />}
                        onClick={() => openDrawerCreate()}
                    >
                        Nova Cliente
                    </Button>
                </div>
                <Table
                    rowKey={"id"}
                    dataSource={clientes}
                    columns={colunas}
                />
            </div>

            <Drawer
                title={isEditing ? "Editar Cliente" : "Criar Cliente"}
                onClose={() => setVisibleCreate(false)}
                open={visibleCreate}
            >
                <Form
                    form={form}
                    layout="vertical"
                    onFinish={isEditing ? handleEdit : handleCreate}
                >
                    <Form.Item
                        name={"id"}
                        hidden
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        label="Nome"
                        name={"name"}
                        rules={[{ required: true, message: "Campo obrigatório!" }]}
                    >
                        <Input placeholder="Nome" />
                    </Form.Item>

                    <Form.Item
                        label="Telefone"
                        name={"phone"}
                        rules={[{ required: true, message: "Campo obrigatório!" }]}
                    >
                        <Input placeholder="Telefone" />
                    </Form.Item>

                     <Form.Item
                        label="Endereço"
                        name={"address"}
                        rules={[{ required: false }]}
                    >
                        <Input placeholder="Telefone" />
                    </Form.Item>

                    <Button
                        type="primary"
                        className="w-full"
                        htmlType="submit"
                    >
                        {isEditing ? "Editar" : "Criar"}
                    </Button>
                </Form>
            </Drawer>
        </>
    );
}

export default Clientes;