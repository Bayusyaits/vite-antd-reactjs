import { Button, Pagination } from 'antd';

const PaginationView = (props: any) => {
  let current = Number(props?.current);
  const data: any = props.data;
  const itemRender = (_: any, type: string, originalElement: any) => {
    if (type === 'prev') {
      return (
        <Button
          type="primary"
          style={{
            color: _ ? 'white' : 'inherit',
          }}
          danger
        >
          Previous
        </Button>
      );
    }
    if (type === 'next' && !data?.isLast) {
      return (
        <Button
          type="primary"
          style={{
            color: _ ? 'white' : 'inherit',
          }}
          danger
        >
          Next
        </Button>
      );
    } else if (type === 'next') {
      return (
        <div
          style={{
            color: _ ? 'gray' : 'inherit',
            backgroundColor: 'rgba(0, 0, 0, 0.04)',
            boxSizing: 'border-box',
            display: 'flex',
            fontWeight: 400,
            textAlign: 'center',
            border: '1px solid #d9d9d9',
            padding: '4px 15px',
            height: '32px',
            alignItems: 'center',
            borderRadius: '6px',
          }}
        >
          Next
        </div>
      );
    }
    return originalElement;
  };
  const size = data?.size ? data?.size : 0;
  let totalElements = 0;
  const hasNext = data?.hasNext ?? data?.hasNext;
  const simple = hasNext !== undefined;
  if (simple && hasNext && data?.pageNumber !== undefined) {
    totalElements = Number(data.pageNumber + 2);
  } else if (simple && data?.isLast && data?.pageNumber !== undefined) {
    totalElements = data.pageNumber;
  } else if (
    simple &&
    data?.pageSize &&
    !hasNext &&
    data.pageNumber > 0 &&
    !data?.isLast
  ) {
    totalElements = 1;
  } else if (!simple && data?.totalElements) {
    totalElements = data.totalElements;
  }
  if (data?.pageNumber) {
    current = data.pageNumber;
  }
  return totalElements ? (
    <Pagination
      showSizeChanger={false}
      current={current + 1}
      pageSize={size ?? 0}
      total={totalElements}
      hideOnSinglePage={props?.hideOnSinglePage}
      itemRender={simple ? itemRender : undefined}
      className={simple ? 'hide-pagination' : ''}
      showQuickJumper={simple}
      onChange={props.onPageChange}
    />
  ) : (
    <></>
  );
};

export default PaginationView;
