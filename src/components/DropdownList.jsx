import { DownOutlined } from '@ant-design/icons';
import { Button, Dropdown, Space } from 'antd';

const DropdownList = ({ lista, onClick }) => {
  const menuProps = {
    items: lista,       // lista dinâmica recebida por props
    onClick: onClick || (() => {}), // fallback caso não seja passado
  };

  return (
    <Space wrap>
      <Dropdown menu={menuProps}>
        <Button>
          <Space>
            Categorias
            <DownOutlined />
          </Space>
        </Button>
      </Dropdown>
    </Space>
  );
};

export default DropdownList;
