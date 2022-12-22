import { AnchorProvider } from '@project-serum/anchor';
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import {useMemo} from 'react'

export const useAnchorProvider = () => {
  const wallet = useAnchorWallet();
  const {connection} = useConnection();

  const provider = useMemo(() => {
    if (!wallet) return null;
    return new AnchorProvider(connection, wallet, {skipPreflight: true}); 
    // skipPreflight mặc định là false thì nó sẽ check ở local cái trans đó có lỗi ko, nếu ko lỗi nó sẽ gửi lên blockchain, còn lỗi nó sẽ ko gửi tiết kiệm phí gas cho mình
    // ở đây mình bật true giúp mình theo dõi trans diễn ra như thế nào
  }, [connection, wallet]);

  return provider;
}
