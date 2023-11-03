import {  Col, Row, Table  } from 'antd';

const HomeTableView = ({
  data,
  components,
  isLoading,
  onTableChange,
  rowKey,
  handleSave,
  handleValidate,
  sharedOnCell,
  validate,
  success,
  setSuccess,
  isDisabled,
}: any) => {


  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      width: '100px',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
      onCell: sharedOnCell,
      editable: true,
      suffix: 'th',
      width: '50px',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      width: '100px',
      key: 'address',
    },
  ];
  const mutableColumns = columns.map((col: any) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: any, index: number) => ({
        record,
        suffix: col.suffix,
        editable: col.editable,
        dataIndex: col.dataIndex,
        title: col.title,
        handleSave,
        data,
        disabled: isDisabled,
        handleValidate,
        validate,
        success,
        setSuccess,
        index,
      }),
    };
  });
  return (
    <>
      <Row style={{ marginTop: '12px' }}>
        <Col flex={'auto'}>
          <Row style={{ marginBottom: '12px', marginTop: '12px' }}>
            <Table
              bordered
              columns={mutableColumns}
              components={components}
              dataSource={data?.content || []}
              loading={isLoading}
              rowClassName={() => 'editable-row'}
              onChange={onTableChange}
              pagination={false}
              rowKey={rowKey}
              sticky
              scroll={{ x: 1500 }}
              style={{ width: '100%' }}
            />
          </Row>
        </Col>
      </Row>
    </>
  );
};
export default HomeTableView