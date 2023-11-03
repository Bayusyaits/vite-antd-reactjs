import { Button, Steps } from 'antd';

const RegistrationView = ({
  steps,
  step,
  next,
  prev,
  payload,
}: any) => {
  const Component: any = steps[step].component;
  const items = steps.map((item: any) => ({ key: item.title, title: item.title }));
  return (
    <>
      <Steps current={step} items={items} />
      <Component
        next={next}
        payload={payload}
      >
        {
          step > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </Component>
    </>
  );
};


export default RegistrationView
