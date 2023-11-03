import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { validateInput } from '../../../utils/validate';
import { Form, Input } from 'antd';

export const EditableContext: any = createContext(null);
export const EditableCell = (props: any) => {
  const {
    title,
    editable,
    children,
    dataIndex,
    record,
    index,
    suffix,
    validate,
    handleSave,
    success,
    setSuccess,
    handleValidate,
    ...restProps
  } = props
  const [editing, setEditing] = useState(false);
  const inputRef: any = useRef(null);
  const form: any = useContext(EditableContext);
  const content = restProps?.data?.content || [];
  useEffect(() => {
    if (editing) {
      inputRef.current.focus();
    }
  }, [editing]);
  const toggleEdit = (val: any) => {
    setEditing(!editing);
    const value = val.target.value;
    form.setFieldsValue({
      [dataIndex]: value,
    });
  };
  const save = async (e: any) => {
    try {
      toggleEdit(e);
      if (e.target.value) {
        const val = await form.validateFields();
        await handleSave({
          ...record,
          ...val,
        });
      }
      const suc = success;
      const bool = await handleValidate(
        index,
        record,
        dataIndex,
        e.target.value
      );
      if (index !== undefined) {
        suc[index] = bool;
        setSuccess(suc);
      }
    } catch (errInfo) {
      //
    }
  };
  let errorMsg = null;
  let validateStatus: '' | 'success' | 'warning' | 'error' | 'validating' = '';
  if (
    validate &&
    validate.length &&
    validate[index] &&
    validate[index]?.[dataIndex]?.errorMsg
  ) {
    errorMsg = validate[index]?.[dataIndex]?.errorMsg;
    validateStatus = validate[index]?.[dataIndex]?.validateStatus;
  }
  let childNode = children;
  const value =
    children && Array.isArray(children) && children.length
      ? children[children.length - 1]
      : '';
  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{
          margin: 0,
        }}
        name={dataIndex}
        rules={[
          {
            required: true,
            message: `${title} is required.`,
          },
        ]}
      >
        <Input
          style={{
            width: '100%',
          }}
          max={suffix === 'th' ? 100 : undefined}
          placeholder="0"
          suffix={suffix}
          ref={inputRef}
          disabled={restProps?.disabled}
          onBlur={save}
          onKeyDown={(e) =>
            validateInput(e, () => {}, {
              minLength: 1,
              maxLength: suffix === 'th' ? 2 : undefined,
              allowDecimal: suffix === 'th',
              isNumber: true,
            })
          }
        />
      </Form.Item>
    ) : (
      <Form.Item
        style={{
          margin: 0,
        }}
        help={errorMsg}
        validateStatus={validateStatus}
      >
        <Input
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onFocus={toggleEdit}
          value={value}
          disabled={restProps?.isDisabled}
        />
      </Form.Item>
    );
  }

  if (dataIndex === 'rangeOmzetUpper' && index === content.length - 1) {
    childNode = <></>;
  }

  return <td {...restProps}>{childNode}</td>;
};