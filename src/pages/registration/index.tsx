import RegistrationView from './Main'
import RegistrationFirstContainer from '../../components/registration/first';
import RegistrationSecondContainer from '../../components/registration/second';
import { useCallback, useEffect, useState } from 'react';
import {
  useRegistrationContext,
  RegistrationDispatchContext,
  RegistrationStateContext,
} from '../../components/registration/Context';
import { values as checkValues, isEmpty } from 'lodash';
import { message } from 'antd';

const RegistrationContainer = () => {
  const [step, setStep] = useState<number>(0)
  const { state, dispatch } = useRegistrationContext();
  const [messageApi, contextHolder] = message.useMessage();
  const {
    isFirst,
    isSecond,
    payload
  } = state
  const {
    payloadAction
  } = dispatch
  const steps = [
    {
      title: 'First',
      component: RegistrationFirstContainer,
    },
    {
      title: 'Second',
      component: RegistrationSecondContainer,
    },
  ];
  useEffect(() => {
    return () => {
      payloadAction({})
    }
  }, [])
  const next = useCallback(() => {
    const isNull = checkValues(payload).some(x => (!x || (x == undefined)))
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else if (isFirst && (isSecond || (!isNull && !isEmpty(payload)))) {
      messageApi.info('Success, Registration!');
    } else {
      messageApi.info('Error, Check again your data!');
    }
  }, [step]);
  const prev = useCallback(() => {
    setStep(step - 1);
  }, [step]);  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  return (
     <>
      {contextHolder}
       <RegistrationDispatchContext.Provider value={dispatch}>
        <RegistrationStateContext.Provider value={state}>
          <RegistrationView
            steps={steps}
            step={step}
            next={next}
            prev={prev}
            payload={payload}
          />
        </RegistrationStateContext.Provider>
      </RegistrationDispatchContext.Provider>
     </>
  )
}

export default RegistrationContainer
