import { useContext, useState } from "react"
import { AntContext } from "../contexts/AntContext"
import { Button, Drawer, Form, Input, Popconfirm, Table } from "antd"
import { DeleteFilled, EditFilled, PlusCircleOutlined } from "@ant-design/icons"
import { useBuscarEmpresas, useCriarEmpresa, useDeletarEmpresa, useEditarEmpresa } from "../hooks/empresaHooks"

const Empresa = () => {
    const [visibleCreate, setVisibleCreate] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [form] = Form.useForm()
    const { api } = useContext(AntContext)
    const { data: clientes } = useBuscarEmpresas();
    const { mutateAsync: criar } = useCriarEmpresa();
    const { mutateAsync: deletar } = useDeletarEmpresa();
    const { mutateAsync: editar } = useEditarEmpresa();

    // COLUNAS DA TABELA
    const colunas = [
        {
            title: "Empresa",
            dataIndex: "name",
            key: "id",
        }, {
            title: "Telefone",
            dataIndex: "phone",
        },
         {
            title: "CNPJ",
            dataIndex: "cnpj",
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
                // Aqui, você exibe uma notificação de sucesso
                // Supondo que a API retorne um objeto com 'type' e 'description'
                api.success({
                    description: 'Empresa Criada com sucesso!',
                });
            },
            onError: (error) => {
                api.error({
                    description: error.response?.data?.message || 'Erro ao Criar Empresa.',
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
            cnpj: record.cnpj,
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
                    description: 'Empresa editada com sucesso!',
                });
            },
            onError: (error) => {
                api.error({
                    description: error.response?.data?.message || 'Erro ao editar Empresa.',
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
                    description: 'Empresa deletada com sucesso!',
                });
            },
            onError: (error) => {
                api.error({
                    description: error.response?.data?.message || 'Erro ao deletar Empresa.',
                });
            }

        })


    }

    return (
        <>
            <div>
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-lg text-bege font-bold">Empresas</h1>
                    <Button
                        type="primary"
                        icon={<PlusCircleOutlined />}
                        onClick={() => openDrawerCreate()}
                    >
                        Nova Empresa
                    </Button>
                </div>
                <Table
                    rowKey={"id"}
                    dataSource={clientes}
                    columns={colunas}
                />
            </div>

            <Drawer
                title={isEditing ? "Editar Empresa" : "Criar Empresa"}
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
                        label="Empresa"
                        name={"name"}
                        rules={[{ required: true, message: "Campo obrigatório!" }]}
                    >
                        <Input placeholder="Empresa " />
                    </Form.Item>

                    <Form.Item
                        label="Telefone"
                        name={"phone"}
                        rules={[{ required: true, message: "Campo obrigatório!" }]}
                    >
                        <Input placeholder="Telefone" />
                    </Form.Item>

                     <Form.Item
                        label="CNPJ"
                        name={"cnpj"}
                        rules={[{ required: true, message: "Campo obrigatório!" }]}
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

export default Empresa;