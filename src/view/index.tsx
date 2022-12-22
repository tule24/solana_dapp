import IonIcon from '@sentre/antd-ionicon'

import { Image, Col, Layout, Row, Space, Typography, Button, notification } from 'antd'

import logo from 'static/images/solanaLogo.svg'
import brand from 'static/images/solanaLogoMark.svg'
import './index.less'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { SystemProgram, Keypair, Transaction } from '@solana/web3.js';
import { useCallback, useEffect, useState } from 'react';
import WalletInfo from "./components/walletInfo";
import Splt from "./components/splt";
import { AppDispatch } from "store";
import { setWalletInfo } from "store/wallet.reducer";
import { useDispatch } from "react-redux";

type NotificationType = 'success' | 'info' | 'warning' | 'error';
const noti = (type: NotificationType, message: String, desc: String) => {
  return notification[type]({
    message: message,
    description: desc,
  });
}

function View() {
  const { connection } = useConnection();  // lấy được obj connection từ cái ConnectionProvider bao ở bên ngoài
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState('');

  const { publicKey, sendTransaction } = useWallet(); // lấy publicKey của wallet đang kết nối
  const fetchBalance = useCallback(async () => {
    try {
      if (publicKey) {
        let lamport = await connection.getBalance(publicKey); // check nếu có publicKey mới getBalance
        dispatch(setWalletInfo({walletAddress: publicKey.toString(), balance: lamport}));
      }
    } catch (err) {
      console.log(err);
    }
  }, [connection, dispatch, publicKey])

  const airdrop = useCallback(async () => {
    try {
      setLoading('airdrop');
      if (publicKey) {
        let getAirdrop = await connection.requestAirdrop(publicKey, 10 ** 8);
        await connection.confirmTransaction(getAirdrop);
        fetchBalance();
        noti(
          'success',
          'Airdrop successfully',
          `0.1 SOL have been given to account ${publicKey}`
        );
      }
    } catch (err) {
      console.log(err);
      noti(
        'error',
        'Airdrop failed',
        'Something went wrong. Please re-check your wallet and network'
      );
    } finally {
      setLoading('');
    }
  }, [connection, publicKey, fetchBalance])

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  const transfer = useCallback(async () => {
    try {
      setLoading('transfer');
      if (publicKey) {
        const toPubkey = Keypair.generate().publicKey; // gen ra 1 random pubkey
        const instruction = SystemProgram.transfer({ // tạo instruction
          fromPubkey: publicKey, // người gửi
          toPubkey, // người nhận
          lamports: 10 ** 8, // số lượng gửi tính theo lamport
        });
        const transaction = new Transaction().add(instruction); //khởi tạo một transaction mới 
        const {
          context: { slot: minContextSlot },
          value: { blockhash, lastValidBlockHeight }
        } = await connection.getLatestBlockhashAndContext(); // định nghĩa duration cho cái transaction này đảm bảo transaction waiting trong 1 time nhất định
        const signature = await sendTransaction(transaction, connection, { minContextSlot }); // làm 2 nhiệm vụ: dùng ví hiện tại ký trans,  gửi trans lên toàn network
        await connection.confirmTransaction({ blockhash, lastValidBlockHeight, signature }); // confirm trans success
        fetchBalance();
        noti(
          'success',
          'Transfer successfully',
          `0.1 SOL was transferred from ${publicKey} to ${toPubkey}`
        );
      }
    } catch (err) {
      console.log(err);
      noti(
        'error',
        'Transfer failed',
        'Something went wrong. Please re-check your wallet and network'
      );
    } finally {
      setLoading('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connection, publicKey, fetchBalance]);
  return (
    <Layout className="container">
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Row gutter={[24, 24]}>
            <Col flex="auto">
              <img src={brand} alt="logo" height={16} />
            </Col>
            <Col>
              <WalletMultiButton />
            </Col>
          </Row>
        </Col>
        <Col span={24} style={{ textAlign: 'center' }}>
          <Space direction="vertical" size={24}>
            <Image src={logo} preview={false} width={256} />
            <Typography.Title level={1}>React + Solana = DApp</Typography.Title>
            <Typography.Text type="secondary">
              <Space>
                <IonIcon name="logo-react" />
                +
                <IonIcon name="logo-solana" />
                =
                <IonIcon name="rocket" />
              </Space>
            </Typography.Text>
            <WalletInfo />
            <Space>
              <Button type='primary' size='large' onClick={airdrop} loading={loading === 'airdrop'}>Airdrop</Button>
              <Button type='primary' size='large' onClick={transfer} loading={loading === 'transfer'}>Transfer</Button>
            </Space>
          </Space>
        </Col>
        <Col span={24}>
          <Splt/>
        </Col>
      </Row>
    </Layout>
  )
}

export default View
