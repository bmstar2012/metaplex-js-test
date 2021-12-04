import React from 'react';
import {useState, useMemo} from 'react';
import './app.scss';
import {Connection, programs} from '@metaplex/js';
import {Keypair, PublicKey, clusterApiUrl} from '@solana/web3.js';

/// Wallet start
import {useWallet, WalletProvider, ConnectionProvider} from '@solana/wallet-adapter-react';
import {WalletModalProvider, WalletMultiButton, WalletDisconnectButton} from '@solana/wallet-adapter-react-ui';

const {Metadata} = programs.metadata;
const connection = new Connection('devnet');
const tokenPublicKey = 'Gz3vYbpsB2agTsAwedtvtTkQ1CG9vsioqLW3r9ecNpvZ';


export const HomeView = () => {
    const wallet = useWallet();
    const { publicKey: walletPubkey } = wallet;

    const [metadataToken, setMetadataToken] = useState(tokenPublicKey);
    const onSearchMetadata = async () => {
        try {
            const ownedMetadata = await Metadata.load(connection, tokenPublicKey);
            console.log(ownedMetadata);
        } catch {
            console.log('Failed to fetch metadata');
        }
    }
    const onLookMyMetadata = async () => {
        try {
            // Find metadata by owner
            console.log("onLookMyMetadata", wallet, walletPubkey);
            if (walletPubkey) {
                const ownedMetadata = await Metadata.findByOwnerV2(connection, walletPubkey);
                console.log("onLookMyMetadata", ownedMetadata);
            }
        } catch {
            console.log("onLookMyMetadata", 'Failed to fetch metadata');
        }
    }
    if (wallet.connected) {
        console.log('wallet connected!');
    } else {
        console.log('wallet no connected!!!');
    }

    return (
        <div className="App">
            <WalletMultiButton />
            <WalletDisconnectButton />
            <div className={'container-metadata'}>
                <input type={"text"} onChange={(e) => {
                    setMetadataToken(e.target.value)
                }} value={metadataToken}/><br/>
                <button onClick={onSearchMetadata}>search metadata</button>
                <br/>
                <br/>
                <div>{wallet.publicKey?.toBase58()}</div>
                <button onClick={onLookMyMetadata}>My metadata</button>
                <br/>

            </div>
        </div>
    );
};
