import { useContext, useEffect, useState } from 'react';
import RegistrationSecondView from './Main'
import { Form } from 'antd';
import { RegistrationDispatchContext, RegistrationStateContext } from '../Context';
import { values as checkValues, isEmpty } from 'lodash';
const RegistrationSecondContainer = (props: any) => {
  const [values, setValues] = useState([])
  const [ form ] = Form.useForm();
  const {
    secondAction,
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
        secondAction(true)
        payloadAction({...data, ...payload})
        if (props?.next && typeof props?.next === 'function') {
          props.next()
        }    
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
  const validateName = async (_: any, value: any) => {
    var validRegex = /^(?=.{1,40}$)[a-zA-Z]+(?:[-'\s][a-zA-Z]+)*$/;
    if (value && !value.toLowerCase().match(validRegex)) {    
      throw new Error('Name not valid');
    }
  };
  return (
    <>
      <RegistrationSecondView
        {...props}
        form={form}
        isDirty={isDirty}
        validateName={validateName}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        setValues={setValues}
      />
    </>
  )
}

export default RegistrationSecondContainer
