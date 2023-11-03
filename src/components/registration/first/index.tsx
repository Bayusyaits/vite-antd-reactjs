import { useContext, useEffect, useState } from 'react';
import RegistrationFirstView from './Main'
import { Form } from 'antd';
import { RegistrationDispatchContext, RegistrationStateContext } from '../Context';
import { values as checkValues, isEmpty } from 'lodash';
const RegistrationFirstContainer = (props: any) => {
  const [values, setValues] = useState([])
  const [ form ] = Form.useForm();
  const {
    firstAction,
    isDirtyAction,
    payloadAction
  } = useContext(RegistrationDispatchContext);
  const {
    isDirty,
    payload
  } = useContext(RegistrationStateContext);
  useEffect(() => {
    const isNull = checkValues(values).some(x => (!x || (x == undefined)))
    if (!isDirty && !isNull && !isEmpty(values)) {
      isDirtyAction(true)
    } else if (isNull) {
      isDirtyAction(false)
    }
  }, [values])
  const onFinish = () => {
    form
      .validateFields()
      .catch(() => {})
      .then((data: any) => {
        payloadAction({...data, ...payload})
        if (props?.next && typeof props?.next === 'function') {
          props.next()
        }    
        firstAction(true)
      });
  };
  useEffect(() => {
    const isNull = checkValues(payload).some(x => (!x || (x == undefined)))
    if (!isNull && !isEmpty(payload)) {
      form.setFieldsValue({...payload})
    }
  }, [])
  
  const onFinishFailed = () => {
  };
  const validateEmail = async (_: any, value: any) => {
    var validRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (value && !value.toLowerCase().match(validRegex)) {    
      throw new Error('Email not valid');
    }
  };
  return (
    <>
      <RegistrationFirstView
        {...props}
        form={form}
        isDirty={isDirty}
        validateEmail={validateEmail}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        setValues={setValues}
      />
    </>
  )
}

export default RegistrationFirstContainer
