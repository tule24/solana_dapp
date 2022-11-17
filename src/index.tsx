/* eslint-disable react/jsx-no-comment-textnodes */
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'

import View from 'view'

import reportWebVitals from 'reportWebVitals'

import 'static/styles/index.less'
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { PhantomWalletAdapter, Coin98WalletAdapter } from '@solana/wallet-adapter-wallets';
import configs from './configs';

const { rpc: { endpoint } } = configs
createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter>
    <ConnectionProvider endpoint={endpoint}> {/*Tạo kết nối của dapp với solana blockchain*/}
      <WalletProvider wallets={[new PhantomWalletAdapter(), new Coin98WalletAdapter()]} autoConnect> {/*Định nghĩa những wallet mà mình muốn hỗ trợ trong dapp của mình*/}
        <WalletModalProvider> {/*Định nghĩa giao diện ví để người dùng có thể tương tác với dapp của mình*/}
          <View />
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  </BrowserRouter>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
