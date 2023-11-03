import { Space, Badge } from 'antd';
import { toast } from 'react-toastify';
import * as localForage from 'localforage';
import Cookies from 'js-cookie';
import { IUserData } from 'interfaces/UserData.interface';
import { ITableSort } from 'interfaces/TableSort.interface';
import { cloneDeep } from 'lodash';
import { APP_MENU } from 'constants/menus';
import {
  ICheck,
  IGetData,
  IParamsLocation,
} from 'containers/DigiPos/ResellerSegment/store.interface';

const getUserData = async (): Promise<IUserData | null> => {
  const data = await localForage.getItem<IUserData>('USER_DATA');
  if (data) return data;
  else return null;
};

const getMatchArray = (val: any) => {
  if (!val) {
    return;
  }
  const a = val;
  const v = [];
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) v.push(a[i]);
    }
  }
  return v;
};

const isJsonString = (str: string) => {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
};

const hasUniqueArray = (val: any) => {
  if (!val) {
    return;
  }
  const a = val;
  for (let i = 0; i < a.length; ++i) {
    for (let j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j]) a.splice(j--, 1);
    }
  }
  return a;
};

const setUserData = async (params: any) => {
  const getUser = await getUserData();
  if (getUser) {
    await localForage.removeItem('USER_DATA');
  }
  const save = await localForage.setItem('USER_DATA', cloneDeep(params));
  if (save) return save;
  else return null;
};

const setCookie = (name: string, val: any) => {
  Cookies.set(name, val);
};

const setSpaceToDash = (val: string, operator: string = '-') => {
  if (!val) {
    return;
  }
  return val?.toString().replace(/\s+/g, operator).toLowerCase();
};

const mappingData = (val: any) => {
  let dataColumns: any = [];
  if (val?.content && val.content.length) {
    for (let i = 0; i < val.content.length; i++) {
      if (dataColumns.length === 0) {
        const obj = Object.keys(val.content[i]);
        dataColumns = obj.map((el: any) => {
          return {
            title: el,
            dataIndex: el,
            render: (text: string) => (
              <div style={{ textAlign: 'justify' }}>
                <span>{text || '-'}</span>
              </div>
            ),
            sorter: {
              multiple: 1,
            },
          };
        });
        break;
      }
    }
  }
  return {
    dataColumns,
    list: val,
  };
};

const setSpaceToUpperCase = (val: string, operator: string = '_') => {
  if (!val) {
    return;
  }
  return val?.toString().replace(/\s+/g, operator).toUpperCase();
};

const getCookie = (name: string) => {
  if (name) {
    return Cookies.get(name);
  }
  return false;
};

const removeCookie = (name: string) => {
  Cookies.remove(name);
};

const generateRandomValue = (length: number = 2) => {
  return Math.random().toString(36).substr(length);
};

const generateMenuTree: any = (data: any, pid = null): any => {
  return data.reduce((r: any, e: any) => {
    if (e.parentId === pid) {
      const obj = {
        key: e.menuId,
        label: e.badge ? (
          <Space
            direction="horizontal"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingRight: '2px',
            }}
          >
            <span>{e.label}</span>
            <Badge
              count={e.count}
              size={'small'}
              style={{
                backgroundColor: 'white',
                color: 'black',
                alignSelf: 'end',
                alignContent: 'center',
              }}
            />
          </Space>
        ) : (
          e.label
        ),
        children: e.children,
        icon: (
          <img
            alt={e.label}
            className="anticon anticon-mail ant-menu-item-icon"
            src={e.icon}
          />
        ),
        type: e.type,
      };
      const children = generateMenuTree(data, e.menuId);
      if (children.length) obj.children = children;
      r.push(obj);
    }
    return r;
  }, []);
};

const reverseGenerateMenuTree: any = (data: any, pid = null): any => {
  return data.reduce((r: any, e: any) => {
    if (e.menuId === pid) {
      const obj = {
        menuId: e.menuId,
        label: e.badge ? (
          <Space
            direction="horizontal"
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              paddingRight: '2px',
            }}
          >
            <span>{e.label}</span>
            <Badge
              count={10}
              size={'small'}
              style={{
                backgroundColor: 'white',
                color: 'black',
                alignSelf: 'end',
                alignContent: 'center',
              }}
            />
          </Space>
        ) : (
          e.label
        ),
        children: e.children,
        icon: (
          <img
            alt={e.label}
            className="anticon anticon-mail ant-menu-item-icon"
            src={e.icon}
          />
        ),
        type: e.type,
      };
      const children = reverseGenerateMenuTree(data, e.parentId);
      if (children.length) obj.children = children;
      r.push(obj);
    }
    return r;
  }, []);
};

const flattenMenuTree: any = (array: any) => {
  const res: any[] = [];
  array.forEach((e: any) => {
    res.push({
      menuId: e.menuId,
      label: e.label,
    });
    e?.children?.forEach(function (child: any) {
      flattenMenuTree([child]).forEach(function (childItem: any) {
        res.push(childItem);
      });
    });
  });
  return res;
};

const logoutUser = async (): Promise<boolean> => {
  await localForage.clear();
  return true;
};

export const showModal = (
  code: number,
  message: string,
  showDialog: boolean = true
) => {
  switch (code) {
    case 1:
      if (showDialog) toast.error(message);
      break;
    case 400:
      if (showDialog) toast.error(message);
      break;
    case 401:
      if (showDialog) toast.error(message);
      break;
    case 500:
      if (showDialog) toast.error(message);
      break;
    case 999:
      if (showDialog) toast.error(message);
      break;
    default:
      if (showDialog) toast.success(message);
  }
};

const downloadBase64File = async (data: any) => {
  const link = document.createElement('a');
  link.href = data;
  link.setAttribute('download', '');
  link.click();
};

const getQueryParams = (name: string, url: string) => {
  // eslint-disable-next-line
  name = name.replace(/[\[\]]/g, '\\$&');
  const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return '';
  return decodeURIComponent(results[2].replace(/\+/g, ' '));
};

const upsertArraySort = (array: Array<ITableSort>, item: ITableSort) => {
  const i = array.findIndex((_item: ITableSort) => _item.field === item.field);
  if (i > -1) array[i] = item;
  else array.push(item);
  return array;
};

const createUniqueKey = () =>
  `key-${Math.random() * 100}-${Date.now()}-${Math.random()
    .toString(36)
    .substr(2, 9)}`;

const currencyFormat = (val: number | string, currency: string = 'Rp') => {
  let idr: number | string = 0;
  const number = Number(val);
  if (number) {
    const numberString = number.toString().replace(/[^,\d]/g, '');
    const numberSplit = numberString.split(',');
    const numberMod = numberSplit[0].length % 3;
    idr = numberSplit[0].substr(0, numberMod);
    const numberMatch = numberSplit[0].substr(numberMod).match(/\d{3}/gi);

    if (numberMatch) {
      const separator = numberMod ? '.' : '';
      idr += separator + numberMatch.join('.');
    }

    idr = numberSplit[1] !== undefined ? `${idr},${numberSplit[1]}` : idr;
  }
  return `${currency}${idr}`;
};

const handleFilterOption = (val: any, option: any) => {
  if (
    option?.children &&
    option?.children.toLowerCase().indexOf(val.toLowerCase()) > -1
  ) {
    return option;
  }
};
const handleFilterSearch = (prev: any, cur: any) => {
  const res = (prev?.name ?? '')
    .toLowerCase()
    .localeCompare((cur?.name ?? '').toLowerCase());
  return res;
};

const findResponseInvalid = (res: any) => {
  let isValid = res?.status;
  if (isValid == false) {
    // eslint-disable-next-line
    const { oneTimeRequestId, totalData, ...response } = res;
    const data = Object.values(response).filter(
      (el) => Array.isArray(el) && el.length > 0
    );
    isValid = data.length === 0;
  }
  return isValid;
};

const getActiveMenu = (type: string) => {
  if (!type) {
    return;
  }
  const programType = setSpaceToDash(type);
  let activeMenu: any = {};
  let menuPath: any = {};
  for (const menu of APP_MENU) {
    const getSplit = menu?.path;
    if (getSplit && getSplit.indexOf('/') !== -1) {
      const split = menu.path.split('/');
      if (split && split.length && split[1] === programType) {
        activeMenu = menu;
        break;
      }
    } else if (menu.path === programType) {
      menuPath = menu;
    }
  }
  let data = {};
  if (activeMenu?.menuId) {
    data = {
      key: activeMenu.menuId,
      keyPath: [activeMenu.menuId],
    };
  } else if (menuPath?.menuId) {
    data = {
      key: menuPath.menuId,
      keyPath: [menuPath.menuId],
    };
  }
  return data;
};

const setArrayToString = (
  val?: string[] | string | null,
  delimiter: string | undefined = ';',
  defaultValue: string | undefined | null = ''
): string | null => {
  if (val && Array.isArray(val) && val.length > 0) {
    return val.join(delimiter);
  } else if (val && typeof val === 'string' && val.length) {
    return delimiter != ';' ? val.replaceAll(';', delimiter) : val;
  } else {
    return defaultValue;
  }
};

const setObjArrayToString = (
  val: IParamsLocation | IParamsLocation['request'] | IGetData,
  delimiter: string | undefined = ';',
  defaultValue: string | undefined | null = ''
): IParamsLocation | IParamsLocation['request'] => {
  if (!val || typeof val !== 'object') {
    return {};
  }
  const keys = Object.keys(val);
  const obj: any = { ...val };
  for (let i = 0; i < keys.length; i++) {
    const el = obj[keys[i]];
    if (el && Array.isArray(el)) {
      obj[keys[i]] = setArrayToString(el, delimiter, defaultValue);
    }
  }
  return obj;
};

const convertToMutableArray = (
  readOnlyArray: readonly { readonly id: string; readonly name: string }[]
): ICheck[] => {
  return readOnlyArray.map((item) => ({ id: item.id, name: item.name }));
};

export {
  getUserData,
  getCookie,
  setCookie,
  removeCookie,
  createUniqueKey,
  setSpaceToDash,
  setSpaceToUpperCase,
  handleFilterOption,
  handleFilterSearch,
  hasUniqueArray,
  getMatchArray,
  mappingData,
  setUserData,
  setArrayToString,
  setObjArrayToString,
  convertToMutableArray,
  generateRandomValue,
  generateMenuTree,
  reverseGenerateMenuTree,
  flattenMenuTree,
  currencyFormat,
  logoutUser,
  getActiveMenu,
  isJsonString,
  findResponseInvalid,
  downloadBase64File,
  getQueryParams,
  upsertArraySort,
};
