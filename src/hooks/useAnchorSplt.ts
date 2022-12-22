import { useMemo } from 'react'
import { useAnchorProvider } from './useAnchorProvider'
import { Spl } from '@project-serum/anchor'

export const useAnchorSplt = () => {
    const provider = useAnchorProvider();
    const splt = useMemo(() => {
        if (!provider) return null;
        return Spl.token(provider);  // mint account
    }, [provider]);

    return splt;
}