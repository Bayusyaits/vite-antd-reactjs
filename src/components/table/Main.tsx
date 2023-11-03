import {  useEffect, useMemo, useState  } from 'react';
import {  Button, DatePicker, Input, Space, Switch, Table, Row, Col  } from 'antd';
import { debounce } from 'lodash';
import { DownloadOutlined, SearchOutlined } from '@ant-design/icons';
import PaginationView from './pagination';


// rowSelection objects indicates the need for row selection
const DEFAULT_YMD_FORMAT = 'YYYY-MM-DD';
export enum ISortOrderEnum {
  ASCENDING = 'ascend',
  DESCENDING = 'descend',
}

export interface ITableSort {
  field: string;
  order: ISortOrderEnum;
}
export interface IPageSort {
  empty: boolean;
  sorted: boolean;
  unsorted: boolean;
}

export interface IPageParams {
  sort: IPageSort;
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}

export interface IPageQuery {
  sortBy: string;
  pageNo: number;
  oneTimeRequestId?: string;
}

// eslint-disable-next-line
export interface IPageable<T extends {} | null> {
  content: T;
  pageable: IPageParams;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: IPageSort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
  isEmpty?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
  hasNext?: boolean;
}
// eslint-disable-next-line
export interface IPageSlicing<T extends {} | null> {
  content: T;
  pageSize: number;
  pageNumber: number;
  hasNext: boolean;
  isFirst: boolean;
  isLast: boolean;
  isEmpty: boolean;
}

export interface Table {
  data: IPageable<any>,
  columns: any,
  rowKey: string,
  params: any,
  isColumnNumber: boolean
  isSortArray: boolean,
  isLoading: boolean,
  isDisabledSearch: boolean,
  widthColumnNumber: number
  disabledSelected: boolean,
  hideOnSinglePage: boolean,
  unSelected: string[]
  selected: string[],
  handleDownload: any,
  handleSearch: any
}

const DatatableView = ({
  columns,
  data,
  rowKey,
  params,
  isColumnNumber,
  widthColumnNumber,
  disabledSelected,
  isSortArray,
  selected,
  unSelected,
  isLoading,
  isDisabledSearch,
  handleDownload,
  handleSearch,
  hideOnSinglePage
}: Table) => {
  const { RangePicker } = DatePicker;
  const [dataSource, setDataSource] = useState<any>(data)
  const [selectedRowKeys, setSelectedRowKeys] = useState<any>([]);
  const [tableColumns, setTableColumns] = useState<any>(null);
  const [mutableParams, setMutableParams] = useState<any>(params);
  const [mutableRowKey, setMutableRowKey] = useState<string>(rowKey);
  const [downloadParams, setDownloadParams] = useState<any>({});
  const [lastPage, setLastPage] = useState<number>(0);
  const [sortByList, setSortByList] = useState<Array<ITableSort>>([]);

  const onPageChange = (pageNo: number) => {
    if (pageNo > 0) {
      pageNo -= 1;
    }
    setMutableParams({ ...mutableParams, pageNo });
    setLastPage(pageNo);
  };

  const initParams = (sortBy: any) => {
    setMutableParams({ ...mutableParams, sortBy });
    setDownloadParams({ ...mutableParams, sortBy });
    // setSortType(TABLE_SORT_CUSTOM);
  };
  const onDateBetweenChange = (name: string, date: any) => {
    const format = DEFAULT_YMD_FORMAT;
    const start =
      date && date[0].format(format) ? date[0].format(format) : null;
    const end = date && date[1].format(format) ? date[1].format(format) : null;
    setMutableParams({
      ...mutableParams,
      [`${name}Start`]: start,
      [`${name}End`]: end,
    });
  };
  const onDateOnlyChange = (name: string, val: any, key: any) => {
    const date = val ? val.format(DEFAULT_YMD_FORMAT) : '';
    let dateDisplay = val || '';
    if (
      (key === 'endDate' &&
        mutableParams?.startDate &&
        mutableParams?.startDate > date) ||
      (key === 'startDate' &&
        mutableParams?.endDate &&
        mutableParams?.endDate < date)
    ) {
      dateDisplay = '';
    }
    setMutableParams({
      ...mutableParams,
      [name]: date,
      [`${name}Display`]: dateDisplay,
    });
  };

  const setSortBy = (sorter: any, sortBy?: any) => {
    let str = sortBy || '';
    switch (sorter.order) {
      case ISortOrderEnum.DESCENDING:
        str += `-${sorter.field}`;
        break;
      case ISortOrderEnum.ASCENDING:
        str += `${sorter.field}`;
        break;
    }
    return str;
  };

  const setObj = (sorter: any) => {
    const { customName } = sorter.column;
    const field = customName && customName !== '' ? customName : sorter.field;
    return { field, order: sorter.order };
  };

  const onSearchChange = (e: any) => {
    const { target } = e.nativeEvent;
    const { name, value } = target;
    // To allow the minus sign (-) in addition to letters, numbers, and spaces || can't not copy paste only symbol
    const sanitizedValue = value.replace(/[^a-zA-Z0-9\s_-]/g, '');
    if (name) {
      if (value === '') {
        setMutableParams({
          ...mutableParams,
          pageNo: lastPage,
          [name]: sanitizedValue,
        });
      } else {
        setMutableParams({
          ...mutableParams,
          pageNo: 0,
          [name]: sanitizedValue,
        });
      }
    }
  };

  const handleRowSelection: any = {
    type: 'checkbox',
    selections: true,
    // preserveSelectedRowKeys: true,
    selectedRowKeys,
    getCheckboxProps: () => ({
      disabled: disabledSelected,
    }),
    onChange(keys: any, selectedRows: any) {
      setSelectedRowKeys(keys);
      // handleSelectedRows(selectedKey ? keys : selectedRows);
    },
  };
  const findKey = (val: any) => {
    const arr = [];
    if (!rowKey) {
      return val;
    }
    for (let i = 0; i < val.length; i++) {
      const keys = Object.keys(val[i]);
      const values = Object.values(val[i]);
      const index = keys.findIndex((el) => el === rowKey);
      if (index !== -1 && values[index]) {
        arr.push(values[index]);
      }
    }
    return arr;
  };
  const handleUnSelected = (val: any) => {
    if (!val || !Array.isArray(val) || !data?.content) {
      return;
    }

    let result;
    if (!unSelected.length && !selected.length) {
      result = [];
    } else {
      const arr = data.content
        .map((el: any) => el[rowKey] && el[rowKey])
        .sort();
      const remain = arr
        .filter((el: any) => !val.some((key: any) => key === el))
        .filter((value: any) => {
          return !unSelected.some((uns: string) => value === uns);
        });
      const tmp = [...val];
      result = arr
        .filter((str: string) => tmp.sort().indexOf(str) > -1)
        .concat(remain);
    }
    let compare;
    if (unSelected.length > 1) {
      compare = unSelected.filter((val: string) => {
        return findKey(data.content).some((key: string) => key !== val);
      });
    } else {
      compare = findKey(data.content).filter((val: string) => {
        return unSelected.some((key: string) => key !== val);
      });
    }
    return !result || result.length === 0 ? compare : result;
  };

  const handleSelected = useMemo(
    () => () => {
      let arr = [];
      if (data?.content && data?.content.length) {
        arr =
          selected && selected.length
            ? handleUnSelected(selected)
            : true
            ? findKey(data.content)
            : [];
        setSelectedRowKeys(arr);
      }
    },
    [findKey, handleUnSelected]
  );
  const initColumns = async () => {
    const tmp: any = data;
    const mutableColumns = columns;
    if (isColumnNumber && columns.length > 0) {
      let num = tmp?.pageable?.offset !== undefined ? tmp?.pageable?.offset : 0;
      if (tmp?.hasNext !== undefined) {
        num = tmp?.pageNumber * tmp?.pageSize;
      }
      const obj = {
        title: 'No',
        searchType: 'hide',
        width: widthColumnNumber || 90,
        render: (text: string, record: any, index: number) =>
          widthColumnNumber == 1 ? (
            <></>
          ) : (
            <div style={{ textAlign: 'justify' }}>
              <span>{num + index + 1}</span>
            </div>
          ),
      };
      const index = columns.findIndex(
        (el: any) => el?.title.toLowerCase() === 'no'
      );
      if (index === -1) {
        if (!mutableRowKey) {
          await setMutableRowKey('no');
        }
        mutableColumns.unshift({ ...obj });
      }
    }
    await setTableColumns(mutableColumns);
  };
  const onTableChange = (pagination: any, filters: any, sorter: any) => {
    let sortBy: any = isSortArray ? [] : '';
    let insertData: Array<ITableSort> = [];
    const orderObj: any = {
      ascend: 'asc',
      descend: 'desc',
    };
    if (sorter.length > 0) {
      sorter.forEach((item: any, key: number) => {
        if (item?.field) {
          if (item?.column?.customName) item.field = item.column.customName;
        }
        insertData.push(setObj(item));
        if (!isSortArray && key > 0) {
          sortBy += ';';
        }
        if (Array.isArray(sortBy) || typeof sortBy === 'object') {
          sortBy.push({
            field: item.field,
            order: orderObj[item.order],
          });
        } else {
          sortBy = setSortBy(item, sortBy);
        }
      });
    } else if (sorter?.column) {
      if (sorter?.field) {
        if (sorter?.column?.customName) sorter.field = sorter.column.customName;
      }
      insertData.push(setObj(sorter));
      if (Array.isArray(sortBy) || typeof sortBy === 'object') {
        sortBy.push({
          field: sorter.field,
          order: orderObj[sorter.order],
        });
      } else {
        sortBy = setSortBy(sorter, sortBy);
      }
    } else if (sorter?.field) {
      const index = sortByList.findIndex((el) => el?.field === sorter?.field);
      if (index !== -1) {
        sortByList.splice(index, 1);
        insertData = sortByList;
      }
    }
    setSortByList(insertData);
    initParams(sortBy);
  };

  const handleDownloadData = () => {
    if (data?.content && data?.content.length) {
      ['pageNo', 'pageSize'].forEach((e) => delete downloadParams[e]);
      handleDownload(downloadParams);
    }
  };
  const setFilterData = useMemo(
    () =>
      debounce((mutableParams: any) => {
        if (mutableParams) {
          handleSearch(mutableParams);
          setDownloadParams({ ...mutableParams });
        }
      }, 1000),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [handleSearch, setDownloadParams]
  );

  useEffect(() => {
    handleSelected();
  }, [data]);

  useEffect(() => {
    handleSelected();
    initColumns();
    if (rowKey) {
      setMutableRowKey(rowKey);
    }
  }, []);
  return (
    <>
      <Row>
        {typeof handleDownload === 'function' ? (
          <Col
            flex={'auto'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'end',
            }}
          >
            <Button
              danger
              disabled={!data?.content || data?.content.length === 0}
              icon={<DownloadOutlined />}
              onClick={handleDownloadData}
            >
              Download
            </Button>
          </Col>
        ) : null}
      </Row>
      <Table
        columns={tableColumns}
        dataSource={dataSource?.content ?? []}
        loading={isLoading}
        onChange={onTableChange}
        pagination={false}
        rowKey={mutableRowKey}
        scroll={{ x: 1500 }}
        sticky
        summary={() => (
          <Table.Summary fixed="top">
            <Table.Summary.Row>
              {tableColumns?.map((item: any, idx: number) => {
                if (
                  item?.dataIndex !== 'action' &&
                  item?.searchType !== 'hide'
                ) {
                  const id =
                    item?.customName && item?.customName !== ''
                      ? item.customName
                      : item.dataIndex;
                  if (item?.searchType === 'dateBetween') {
                    return (
                      <Table.Summary.Cell index={idx} key={idx}>
                        <RangePicker
                          id={id}
                          name={id}
                          format={'DD MMMM YYYY'}
                          onChange={(e: any) =>
                            onDateBetweenChange(id, e)
                          }
                          placeholder={['Start', 'End']}
                          size="large"
                          style={{ width: '100%' }}
                          value={
                            mutableParams
                              ? mutableParams[
                                  `${item.dataIndex}Display`
                                ]
                              : ''
                          }
                        />
                      </Table.Summary.Cell>
                    );
                  } else if (item?.searchType === 'dateOnly') {
                    return (
                      <Table.Summary.Cell index={idx} key={idx}>
                        <DatePicker
                          id={id}
                          name={id}
                          format={'DD MMMM YYYY'}
                          onChange={(e: any) =>
                            onDateOnlyChange(id, e, item?.dataIndex)
                          }
                          placeholder={item?.title}
                          size="large"
                          style={{ width: '100%' }}
                          value={
                            mutableParams
                              ? mutableParams[
                                  `${item.dataIndex}Display`
                                ]
                              : ''
                          }
                        />
                      </Table.Summary.Cell>
                    );
                  }
                  return (
                    <Table.Summary.Cell index={idx} key={idx}>
                      <Input
                        id={id}
                        name={id}
                        onChange={onSearchChange}
                        disabled={isDisabledSearch}
                        prefix={
                          <SearchOutlined className="site-form-item-icon" />
                        }
                        placeholder={item?.title}
                        size="large"
                        value={
                          mutableParams
                            ? mutableParams[item.dataIndex]
                            : ''
                        }
                      />
                    </Table.Summary.Cell>
                  );
                }
                return (
                  <Table.Summary.Cell index={idx} key={idx}>
                    &nbsp;
                  </Table.Summary.Cell>
                );
              })}
            </Table.Summary.Row>
          </Table.Summary>
        )}
      />
      <Space
        direction="horizontal"
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '12px',
          width: '100%',
        }}
      >
        <PaginationView
          data={data}
          hideOnSinglePage={hideOnSinglePage}
          onPageChange={onPageChange}
          current={data?.number || 0}
        />
      </Space>
    </>
  );
};
export default DatatableView