import React from 'react';
import { Button, Form, Input, Row } from 'antd';

const RegistrationSecondView: React.FC = ({
  onFinish,
  setValues,
  onFinishFailed,
  validateName,
  form,
  isDirty,
  children
}: any) => (
  <Form
    name="basic"
    form={form}
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={{ maxWidth: 600 }}
    initialValues={{ remember: true }}
    onValuesChange={(_, val) => setValues(val)}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
  >
    <Form.Item
      label="Full Name"
      name="name"
      rules={[
        { required: true, message: 'Please input your fullname!' },
        { validator: validateName }
      ]}
    >
      <Input />
    </Form.Item>
    <Row
      style={
        { 
          justifyContent: 'end',
          display: 'flex',
          paddingRight: '2rem',
          paddingLeft: '2rem',
       }
      }
    >
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
        {
          children
        }
      </Form.Item>
      <Form.Item 
        style={
          { 
            marginLeft: '1rem',
         }
        }
        wrapperCol={{ offset: 8, span: 16 }}>
        <Button 
          disabled={!isDirty}
          type="primary" 
          htmlType="submit"
        >
          Submit
        </Button>
      </Form.Item>
    </Row>
  </Form>
);

export default RegistrationSecondView;
