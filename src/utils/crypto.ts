import { privateKey } from '../constants/env';
import * as CryptoJS from 'crypto-js';

export const encrypt = (value?: string, key: string = privateKey) => {
  if (!value) {
    return '';
  }
  const mutableKey = CryptoJS.enc.Utf8.parse(key);
  const ciphertext = CryptoJS.AES.encrypt(value, mutableKey, {
    iv: mutableKey,
  }).toString();
  return ciphertext;
};

export const decrypt = (value?: string, key: string = privateKey) => {
  if (!value) {
    return '';
  }
  const mutableKey = CryptoJS.enc.Utf8.parse(key);
  const decryptedData = CryptoJS.AES.decrypt(value, mutableKey, {
    iv: mutableKey,
  });
  return decryptedData.toString(CryptoJS.enc.Utf8);
};
