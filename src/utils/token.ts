import { decrypt, encrypt } from './crypto';
import { deviceDetect } from 'react-device-detect';
import {
  generateRandomValue,
  getCookie,
  removeCookie,
  setCookie,
  setSpaceToDash,
} from './general';

export const getToken = () => {
  const tokenName = 'token_user';
  const token = getCookie(tokenName);
  const device = deviceDetect(window.navigator.userAgent);
  if (device?.userAgent) {
    delete device.userAgent;
  }
  let value: unknown = generateRandomValue(2);
  const values = Object.values(device);
  const name = setSpaceToDash(values.join(';'));
  const setToken = () => {
    const val = {
      [encrypt(name)]: {
        value,
        date: new Date(),
      },
    };
    setCookie(tokenName, JSON.stringify(val));
  };
  if (token) {
    const keys: any = Object.entries(JSON.parse(token));
    if (!keys || !keys.length) {
      return;
    }
    const index = keys.findIndex((el: any) => decrypt(el[0]));
    if (index > -1 && keys[index] && keys[index][1]) {
      value = keys[index][1]?.value;
    } else {
      removeCookie(tokenName);
      setToken();
    }
  } else {
    setToken();
  }
  return value;
};
