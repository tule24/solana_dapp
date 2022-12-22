import { Col, Row, Space, Typography } from "antd";
import { useSelector } from "react-redux";
import { AppState } from "store";

const WalletInfo = () => {
    const {
        wallet: { walletAddress, balance }
    } = useSelector((state: AppState) => state);
    return (
        <Space>
            <Row gutter={[24, 24]}>
                {/* Wallet address */}
                <Col span={24}>
                    <Typography.Title level={3}>Account Address: <span style={{fontSize: "20px", color: "#9e7bba"}}>{walletAddress}</span></Typography.Title> 
                </Col>
                {/* Wallet balance */}
                <Col span={24}>
                    <Typography.Title level={3}>My Balance:  <span style={{fontSize: "25px", color: "#03ff0b", fontWeight: "bold"}}>{balance / 10 ** 9} </span>SOL</Typography.Title>
                </Col>
            </Row>
        </Space>
    );
};

export default WalletInfo;