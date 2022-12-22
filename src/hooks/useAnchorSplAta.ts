import { useMemo } from 'react'
import { useAnchorProvider } from './useAnchorProvider'
import { Spl } from '@project-serum/anchor'

export const useAnchorSplAta = () => {
    const provider = useAnchorProvider();
    const splAta = useMemo(() => {
        if (!provider) return null;
        return Spl.associatedToken(provider);  // associated account
    }, [provider]);

    return splAta;
}

// tokenAccount ta phải tương tác với ATA AssociatedProgram
// chương trình giúp tương tác với tokenAccount
// tokenAccount =  PDA + wallet + mint
// PDA nó hoạt động giống như một hàm hash
// giả sử wallet A gửi USDC cho wallet B thì wallet A phải biết tokenAccount chứa USDC của wallet B thì mới chuyển được
// Lúc này nơi chứa USDC của B nó sẽ là PDA(address của B + address của USDC) => associatedAddress USDC của B
