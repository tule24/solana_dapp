import { Button, Col, Row, Typography } from 'antd'
import { useAnchorSplt } from 'hooks/useAnchorSplt'
import { web3, utils } from "@project-serum/anchor"
import { Token } from '@solana/spl-token'
import { useAnchorProvider } from 'hooks/useAnchorProvider'
import { useConnection } from '@solana/wallet-adapter-react'
import { useCallback, useState } from 'react'

const CreateMintAccount = () => {
  const [loading, setLoading] = useState(false);
  const [mintAddress, setMintAddress] = useState("");
  const { connection } = useConnection();
  const splt = useAnchorSplt();
  const provider = useAnchorProvider();

  const onCreateMint = useCallback(async () => {
    try {
      setLoading(true);
      if (!splt) throw new Error("Invalid anchor program");
      if (!provider) throw new Error("Connect wallet first!");
      const newMint = web3.Keypair.generate();
      const lamports = await Token.getMinBalanceRentForExemptMint(connection);

      // Create rent instruction => Thuê 1 account => Bước này chỉ mới là tạo instruction thôi chứ chưa gửi lên block
      const rentIx = web3.SystemProgram.createAccount({
        fromPubkey: provider.publicKey, // ai thuê
        newAccountPubkey: newMint.publicKey, // địa chỉ account
        space: splt.account.mint.size, // bao nhiêu bytes sử dụng
        lamports, // lượng phí tốn cho việc thuê => sẽ ko return lại phí
        programId: utils.token.TOKEN_PROGRAM_ID, // sẽ tương tác với chương trình nào
      });

      // Create initialize mint instruction
      // spl gồm: 
      // .methods: những instruction giúp mình tương tác với spl
      // .account: 
      const initMintIx = await splt.methods
        .initializeMint(9, provider.publicKey, provider.publicKey) // (decimal: thường là 9, mintAuthority)
        .accounts({ mint: newMint.publicKey, rent: web3.SYSVAR_RENT_PUBKEY }) // truyền vào các accountAddress mà mình tương tác với nó
        .instruction();
      /* Sau bước .accounts thì có 3 option quan trọng: 
       - .rpc(): gọi luôn lên smart contract luôn, tương tác liền luôn 
       - .transaction(): trả về 1 trans của instruction này, mình có thể gửi trans này lên sc để thực thi
       - .instruction(): build 1 cái instruction để tạo 1 cái mintAccount
      */

      const tx = new web3.Transaction().add(rentIx, initMintIx); // tạo 1 tx với 2 instruction
      await provider.sendAndConfirm(tx, [newMint]);

      /* Error: Signature verification failed 
      => Do newMint này mình genKey ra nên nó có chữ ký nên chỗ sendAndConfirm, param số 2 phải truyền keypair vào để ký
      */
      setMintAddress(newMint.publicKey.toString());
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, [connection, provider, splt]);

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Button type='primary' onClick={onCreateMint} loading={loading}>Create Mint</Button>
      </Col>
      <Col flex={'auto'}>
        <Typography.Title level={4}>
          {mintAddress}
        </Typography.Title>
      </Col>
    </Row>
  )
}

export default CreateMintAccount
