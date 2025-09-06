import { useContext, useState } from "react"
import { AntContext } from "../contexts/AntContext"
import { Button, Drawer, Form, Input, Popconfirm, Table } from "antd"
import { DeleteFilled, EditFilled, PlusCircleOutlined } from "@ant-design/icons"
import { useBuscarCategorias, useCriarCategoria, useDeletarCategoria, useEditarCategoria } from "../hooks/categoriaHooks"

const Categorias = () => {
  const [visibleCreate, setVisibleCreate] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [form] = Form.useForm()
  const { api } = useContext(AntContext)
  const { data: categorias } = useBuscarCategorias();
  const { mutateAsync: criar } = useCriarCategoria();
  const { mutateAsync: editar } = useEditarCategoria();
  const { mutateAsync: deletar } = useDeletarCategoria();

  // COLUNAS DA TABELA
  const colunas = [
    {
      title: "Nome",
      dataIndex: "name",
      key: "id",
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
          description: 'Categoria Criada com sucesso!',
        });
      },
      onError: (error) => {
        api.error({
          description: error.response?.data?.message || 'Erro ao Criar categoria.',
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
          description: 'Categoria editada com sucesso!',
        });
      },
      onError: (error) => {
        api.error({
          description: error.response?.data?.message || 'Erro ao editar categoria.',
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
          description: 'Categoria deletada com sucesso!',
        });
      },
      onError: (error) => {
        api.error({
          description: error.response?.data?.message || 'Erro ao deletar categoria.',
        });
      }

    })


  }

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-lg text-bege font-bold">Categorias</h1>
          <Button
            type="primary"
            icon={<PlusCircleOutlined />}
            onClick={() => openDrawerCreate()}
          >
            Nova Categoria
          </Button>
        </div>
        <Table
          rowKey={"id"}
          dataSource={categorias}
          columns={colunas}
        />
      </div>

      <Drawer
        title={isEditing ? "Editar Categoria" : "Criar Categoria"}
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
            <Input placeholder="Nome da categoria" />
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

export default Categorias;