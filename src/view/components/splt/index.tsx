import { Collapse } from 'antd';
import CreateMintAccount from "./createMintAccount";
import MintTo from './mintTo';
import Transfer from './transfer';
import Burn from './burn';
const { Panel } = Collapse;

const Splt = () => {
    return (
        <Collapse defaultActiveKey={['1']}>
            <Panel header="Create Mint Account" key="1">
                <CreateMintAccount />
            </Panel>
            <Panel header="Mint To" key="2">
                <MintTo />
            </Panel>
            <Panel header="Transfer" key="3">
                <Transfer />
            </Panel>
            <Panel header="Burn" key="4">
                <Burn />
            </Panel>
        </Collapse>
    )
}

export default Splt