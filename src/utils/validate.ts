type NumberProps = {
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  quantity?: number;
  isNumber?: boolean;
  allowDecimal?: boolean;
  requred?: boolean;
  value?: string;
};
export const validateInput = (
  e: any,
  onChange: (p: string | number) => void,
  validate: NumberProps
) => {
  const { isNumber, maxLength, allowDecimal, value } = validate;
  const isDot = e.keyCode === 190;
  const isVal =
    allowDecimal &&
    (!value || (value && value.toString().split('.').length > 1)) &&
    isDot;
  const key = e.key;
  let rgxNumber = /^[0-9]+$/;
  // eslint-disable-next-line
  const rgxSpecialChar = /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  const code = [37, 39, 8, 9, 17, 91];
  if (allowDecimal) {
    rgxNumber = /^[0-9.]+$/;
  }
  if (rgxSpecialChar.test(key)) {
    e.preventDefault();
  }
  if (isVal) {
    e.preventDefault();
  } else if (isNumber && !rgxNumber.test(key) && !code.includes(e.keyCode)) {
    e.preventDefault();
  } else if (
    maxLength &&
    e.target.value &&
    e.target.value.length >= Number(maxLength) &&
    !code.includes(e.keyCode)
  ) {
    e.preventDefault();
  }
};

export const validateBlur = (
  e: any,
  onChange: (p: string | number) => void,
  validate: NumberProps
) => {
  const { isNumber, allowDecimal } = validate;
  const val = e?.target?.value;
  if (
    isNumber &&
    allowDecimal &&
    val &&
    val.length > 1 &&
    val.toString().charAt(val.length - 1) === '.'
  ) {
    onChange(val.substring(0, val.length - 1));
  }
};

export const onKeyDown = (e: any, regex: RegExp = /[^a-zA-Z0-9\s_-]/g) => {
  const { key } = e.nativeEvent;
  if (regex.test(key)) {
    e.preventDefault();
  }
};
