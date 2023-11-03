import { Button, Col, Modal, Row, Typography } from 'antd';

const HomeModal = ({
  open,
  handleCancel,
  handleConfirm,
}: any) => {
  const { Title, Text } = Typography;
  return (
    <Modal open={open} footer={null}>
      <Row style={{ marginTop: '20px' }}>
        <Col flex={'auto'}>
          <Title
            style={{
              fontSize: '18px',
            }}
          >
            Tinggalkan Halaman?
          </Title>
          <Text>Anda yakin ingin meninggalkan halamana?</Text>
        </Col>
      </Row>
      <Row
        style={{
          marginTop: '12px',
          justifyContent: 'end',
        }}
      >
        <Col>
          <Button
            danger
            type="primary"
            onClick={handleConfirm}
            style={{
              marginRight: '12px',
            }}
          >
            Ya
          </Button>
        </Col>
        <Col>
          <Button danger onClick={handleCancel}>
            Kembali
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};
export default HomeModal;
