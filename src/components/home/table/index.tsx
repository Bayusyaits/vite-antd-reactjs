import { useEffect, useState } from 'react';
import HomeTableView from './Main'
import { Form } from 'antd';
import { cloneDeep, isEmpty } from 'lodash';
import { EditableContext, EditableCell } from './Context';

const HomeTableContainer = ({
  data,
  isLoading,
  isDisabled,
}: any) => {
  const [validate, setValidate]: any = useState([]);
  const [mutableData, setMutableData] = useState(data)
  const [success, setSuccess] = useState<any>([]);
  const handleSave = async (row: any) => {
    if (isDisabled) {
      return;
    }
    const newData = cloneDeep(data);
    const index = newData.content.findIndex(
      (item: any) => Number(row.id) === Number(item.id)
    );
    if (newData.content[index]) {
      newData.content[index] = row;
      setMutableData({ ...newData });
    }
  };
  const handleValidate: any = (
    index: number,
    record: any,
    dataIndex: string,
    value: string | number
  ) => {
    let bool = true;
    if (isDisabled) {
      return false;
    }
    const val = cloneDeep(validate);
    const obj: any = {}
    if ((dataIndex === 'age' &&
        Number(value) > 60)) {
        obj.age = {
        validateStatus: 'error',
        errorMsg: `Maksimal usia ${
          record.name
        } adalah 60th`,
      };
      bool = false;
    } 
    if (!val[index]) {
      val[index] = {
        [dataIndex]: {}
      }
    }
    if (obj && !isEmpty(obj) && val[index]) {
      val[index] = {...obj}
    } else {
      val[index] = {}
    }
    setValidate([...val])
    return bool;
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const EditableRow: any = ({ index, ...obj }: any) => {
    const [form] = Form.useForm();
    return (
      <Form initialValues={data.content} form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...obj} />
        </EditableContext.Provider>
      </Form>
    );
  };

  const components = {
    body: {
      row: EditableRow,
      cell: EditableCell,
    },
  };
  const sharedOnCell = () => {
    return {};
  };
  const handleSetSuccess = (val: any) => {
    setSuccess(val);
  };
  useEffect(() => {
    return () => {
      setSuccess([]);
    };
  }, []);
  return (
    <HomeTableView
      data={mutableData}
      components={components}
      isLoading={isLoading}
      rowKey={'id'}
      handleSave={handleSave}
      success={success}
      setSuccess={handleSetSuccess}
      validate={validate !== undefined ? validate : []}
      isDisabled={false}
      handleValidate={handleValidate}
      sharedOnCell={sharedOnCell}
    />
  )
}

export default HomeTableContainer
