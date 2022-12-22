import { BN, utils, web3 } from '@project-serum/anchor';
import { useAnchorProvider } from 'hooks/useAnchorProvider';
import { useAnchorSplAta } from 'hooks/useAnchorSplAta';
import { useAnchorSplt } from 'hooks/useAnchorSplt';
import React, { useCallback, useState } from 'react'
import { Button, Col, Input, Row, Space, Typography } from "antd"


const Burn = () => {
    const [loading, setLoading] = useState(false);
    const [mintAddress, setMintAddress] = useState('');
    const [amount, setAmount] = useState('');
    const provider = useAnchorProvider();
    const splt = useAnchorSplt();
    const splAta = useAnchorSplAta();

    const onBurn = useCallback(async () => {
        try {
            if(!splt || !splAta) throw new Error("Invalid anchor program!");
            if(!provider) throw new Error("Connect wallet first");
            setLoading(true);

            const associatedAccount = await utils.token.associatedAddress({
                mint: new web3.PublicKey(mintAddress),
                owner: provider.publicKey
            });

            await splAta.methods
                .create()
                .accounts({
                    associatedAccount,
                    mint: new web3.PublicKey(mintAddress),
                    authority: provider.publicKey,
                    owner: provider.publicKey,
                    rent: web3.SYSVAR_RENT_PUBKEY,
                    systemProgram: web3.SystemProgram.programId,
                    tokenProgram: utils.token.TOKEN_PROGRAM_ID
                })
                .rpc();

            await splt.methods
                .burn(new BN(amount))
                .accounts({
                    source: associatedAccount,
                    mint: mintAddress,
                    authority: provider.publicKey
                })
                .rpc();
        } catch(err){
            console.log(err)
        } finally {
            setLoading(false);
        }
    }, [amount, mintAddress, provider, splAta, splt])
  return (
    <Row gutter={[24,24]}>
            <Col span={12}>
                <Space direction="vertical" style={{width: '100%'}}>
                    <Typography.Text>Mint Address</Typography.Text>
                    <Input placeholder="Mint Address" onChange={(e) => {setMintAddress(e.target.value)}}/>
                </Space>
            </Col>
            <Col span={12}>
                <Space direction="vertical" style={{width: '100%'}}>
                    <Typography.Text>Amount</Typography.Text>
                    <Input placeholder="Amount" onChange={(e) => {setAmount(e.target.value)}}></Input>
                </Space>
            </Col>
            <Col span={6}>
                <Button type="primary" block onClick={onBurn} loading={loading}>
                    Burn
                </Button>
            </Col>
        </Row>
  )
}

export default Burn