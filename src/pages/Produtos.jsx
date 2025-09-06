import { useContext, useState } from "react"
import { AntContext } from "../contexts/AntContext"
import {
  Button, Drawer, Form, Input, InputNumber, Popconfirm, Table, Image, Select
} from "antd"
import {
  DeleteFilled, EditFilled, PlusCircleOutlined
} from "@ant-design/icons"
import { useBuscarCategorias } from './../hooks/categoriaHooks';
import {
  useBuscarProdutos,
  useCriarProduto,
  useEditarProduto,
  useDeletarProduto
} from "../hooks/produtoHooks"

const Produtos = () => {
  const [visibleDrawer, setVisibleDrawer] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [form] = Form.useForm()
  const { api } = useContext(AntContext);

  const { data: produtos } = useBuscarProdutos()
  const { data: categorias, isFetched: carregouCategorias } = useBuscarCategorias()
  const { mutateAsync: criar } = useCriarProduto()
  const { mutateAsync: editar } = useEditarProduto()
  const { mutateAsync: deletar } = useDeletarProduto()

  const colunas = [
    {
      title: "Imagem",
      dataIndex: "imageUrl",
      key: "imageUrl",
      width: "10%",
      align: "center",
      render: (url) => (
        <Image
          src={url}
          alt="Produto"
          width={60}
          height={60}
          style={{ objectFit: "cover", borderRadius: 8 }}
        />
      )
    },
    {
      title: "Nome",
      dataIndex: "name",
      key: "name",
      render: (text) => text?.replaceAll('"', '')
    },
    {
      title: "Descrição",
      dataIndex: "description",
      key: "description",
      render: (text) => text?.replaceAll('"', '')
    },
    {
      title: "Preço (R$)",
      dataIndex: "price",
      key: "price",
      render: (valor) => valor
    },
    {
      title: "Opções",
      key: "opcoes",
      width: "12%",
      align: "center",
      render: (_, record) => (
        <div className="flex justify-between">
          <div
            className="w-[30px] h-[30px] flex justify-center items-center cursor-pointer duration-150 border border-transparent rounded-full hover:border-marrom group"
            onClick={() => openDrawerEdit(record)}
          >
            <EditFilled className="duration-150 !text-bege group-hover:!text-marrom" />
          </div>
          <Popconfirm
            title="Deseja excluir?"
            okText="Sim"
            cancelText="Não"
            onConfirm={() => handleDelete(record.id)}
          >
            <div className="w-[30px] h-[30px] flex justify-center items-center cursor-pointer duration-150 border border-transparent rounded-full hover:border-marrom group">
              <DeleteFilled className="duration-150 !text-bege group-hover:!text-marrom" />
            </div>
          </Popconfirm>
        </div>
      )
    }
  ]

  const openDrawerCreate = () => {
    setVisibleDrawer(true)
    setIsEditing(false)
    form.resetFields()
  }

  const openDrawerEdit = (record) => {
    setVisibleDrawer(true)
    setIsEditing(true)
    form.setFieldsValue({
      ...record,
      name: record.name?.replaceAll('"', ''),
      description: record.description?.replaceAll('"', ''),
      // Não preenche o campo de arquivo, pois ele não pode ser editado diretamente.
      // O `imageUrl` é apenas para visualização.
      image: undefined,
      categoryId: record.categoryId || record.category?.id || undefined
    })
  }

  // Função auxiliar para criar o FormData
  const createFormData = (dados) => {
    const formData = new FormData();
    formData.append("name", dados.name);
    formData.append("description", dados.description);
    formData.append("price", dados.price);
    // Note que o backend espera "image" e não "imageUrl"
    if (dados.image instanceof File) {
      formData.append("image", dados.image);
    }
    console.log(dados);


    // Adicione o ID apenas se estiver editando
    if (dados.id) {
      formData.append("id", dados.id);
    }
    // Adicione a categoria
    if (dados.categoryId) {
      formData.append("categoryId", dados.categoryId);
    }
    return formData;
  };

  const handleCreate = (dados) => {
    const formData = createFormData(dados);
    criar(formData, {
      onSuccess: (resposta) => {
        form.resetFields();
        // Aqui, você exibe uma notificação de sucesso
        // Supondo que a API retorne um objeto com 'type' e 'description'
        api.success({
          description: 'Produto adicionado com sucesso!',
        });
      },
      onError: (error) => {
        api.error({
          description: error.response?.data?.message || 'Erro ao Criar categoria.',
        });
      },
    })
  }

  const handleEdit = (dados) => {
    const formData = createFormData(dados);
    editar(formData, { // A função editar precisa aceitar FormData
      onSuccess: (res) => {
        form.resetFields()
        setVisibleDrawer(false)
        setIsEditing(false)
        api.success({
          description: 'Produto editado com sucesso!',
        });
      },
      onError: (error) => {
        api.error({
          description: error.response?.data?.message || 'Erro ao Criar categoria.',
        });
      },
    })
  }

  const handleDelete = (id) => {
    deletar(id, {
      onSuccess: (res) => {
        api.success({
          description: 'Produto deletado com sucesso!',
        });
      }, onError: (error) => {
        api.error({
          description: error.response?.data?.message || 'Erro ao Criar categoria.',
        })}
      })
  }

  return (
    <>
      <div>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-lg text-bege font-bold">Produtos</h1>
          <Button type="primary" icon={<PlusCircleOutlined />} onClick={openDrawerCreate}>
            Novo Produto
          </Button>
        </div>
        <Table rowKey="id" dataSource={produtos} columns={colunas} />
      </div>

      <Drawer
        title={isEditing ? "Editar Produto" : "Criar Produto"}
        onClose={() => setVisibleDrawer(false)}
        open={visibleDrawer}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={isEditing ? handleEdit : handleCreate}
        >
          <Form.Item name="id" hidden>
            <Input />
          </Form.Item>

          <Form.Item
            label="Nome"
            name="name"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Descrição"
            name="description"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Input.TextArea rows={2} />
          </Form.Item>

          <Form.Item
            label="Preço (R$)"
            name="price"
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <InputNumber min={0} step={0.01} className="w-full" />
          </Form.Item>

          <Form.Item
            label="Imagem"
            name="image"
            valuePropName="image"
            // Use `null` para evitar que o Ant Design tente renderizar um valor inicial,
            // o que causaria um erro.
            initialValue={null}
            getValueFromEvent={(e) => {
              // Se o evento for de upload de arquivo, retorna o primeiro arquivo
              if (e && e.target && e.target.files && e.target.files.length > 0) {
                return e.target.files[0];
              }
              // Caso contrário, retorna o valor de `e` (se for um array) ou `null`
              return e || null;
            }}
            rules={[{ required: false}]}
          >
            <input type="file" accept="image/*" className="border-neutral-100 border p-1 rounded-md"/>
          </Form.Item>

          <Form.Item
            label="Categoria"
            name="categoryId" // Mudado de 'id' para 'categoryId' para evitar conflito
            rules={[{ required: true, message: "Campo obrigatório!" }]}
          >
            <Select
              showSearch
              options={carregouCategorias && categorias.map(categoria => {
                return {
                  label: categoria.name,
                  value: categoria.id
                }
              }) || []}
            />
          </Form.Item>

          <Button type="primary" htmlType="submit" className="w-full mt-2">
            {isEditing ? "Salvar Alterações" : "Criar Produto"}
          </Button>
        </Form>
      </Drawer>
    </>
  )
}

export default Produtos