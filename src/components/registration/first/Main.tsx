import React from 'react';
import { Button, Form, Input, Row } from 'antd';

const RegistrationFirstView: React.FC = ({
  onFinish,
  setValues,
  onFinishFailed,
  validateEmail,
  form,
  isDirty,
  children
}: any) => (
  <Form
    name="basic"
    form={form}
    labelCol={{ span: 8 }}
    wrapperCol={{ span: 16 }}
    style={
      { maxWidth: 600 }
    }
    initialValues={{ remember: true }}
    onValuesChange={(_, val) => setValues(val)}
    onFinish={onFinish}
    onFinishFailed={onFinishFailed}
  >
    <Form.Item
      label="Email"
      name="email"
      rules={[
        { required: true, message: 'Please input your email!' },
        { validator: validateEmail }
      ]}
    >
      <Input />
    </Form.Item>

    <Form.Item
      label="Password"
      name="password"
      rules={[{ required: true, message: 'Please input your password!' }]}
    >
      <Input.Password />
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
      <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
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

export default RegistrationFirstView;
