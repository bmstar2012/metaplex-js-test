import React from 'react';
import {useState, useMemo} from 'react';
import './app.scss';
import {Connection, programs, actions, Wallet, NodeWallet, AnyPublicKey} from '@metaplex/js';

import {Keypair, PublicKey, clusterApiUrl} from '@solana/web3.js';

/// Wallet start
import {useWallet} from '@solana/wallet-adapter-react';
import {WalletMultiButton, WalletDisconnectButton} from '@solana/wallet-adapter-react-ui';
import { getPhantomWallet } from "@solana/wallet-adapter-wallets";

const { metaplex: { Store, AuctionManager }, metadata: { Metadata }, auction: { Auction }, vault: { Vault } } = programs;

const connection = new Connection('devnet');
const tokenPublicKey = 'Gz3vYbpsB2agTsAwedtvtTkQ1CG9vsioqLW3r9ecNpvZ';


export const HomeView = () => {
    const wallet = useWallet();
    const { publicKey: walletPubkey } = wallet;

    const [metadataToken, setMetadataToken] = useState(tokenPublicKey);
    const [storeId, setStoreId] = useState('');
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
                ownedMetadata.forEach((metadata) => {
                    console.log('metadata:', metadata.pubkey.toBase58(), metadata);
                })
                // console.log("onLookMyMetadata", ownedMetadata);
            }
        } catch {
            console.log("onLookMyMetadata", 'Failed to fetch metadata');
        }
    }

    const onLookupStore = async () => {
        if (!wallet) {
            return;
        }
        // const metaplexWallet = new NodeWallet(wallet.)
        try {
            // const { storeId } = await actions.initStore({
            //     connection,
            //     wallet: new NodeWallet(wallet.publicKey),
            // });
            const storeId = await Store.getPDA(walletPubkey as AnyPublicKey);
            console.log("onLookupStore", storeId);
            setStoreId(storeId.toBase58());

            const store = await Store.load(connection, storeId);
            console.log("store data: ", store);

            // Get existing store id
            // const storeId = await Store.getPDA(publicKey as AnyPublicKey);
        } catch {
            console.log("onLookMyMetadata", 'Failed to fetch metadata');
        }
    }

    return (
        <div className="App">
            <WalletMultiButton /><br/><br/>
            <WalletDisconnectButton />
            <div className={'container-metadata'}>
                <input type={"text"} onChange={(e) => {
                    setMetadataToken(e.target.value)
                }} value={metadataToken}/><br/>
                <button onClick={onSearchMetadata}>search metadata</button>
                <br/>
                <br/>
                <div>{wallet.publicKey?.toBase58()}</div>
                <button onClick={onLookMyMetadata} disabled={!wallet.connected}>My metadata</button>
                <br/>
                <button onClick={onLookupStore} disabled={!wallet.connected}>Check store</button><br/>
                <br/>
                Store: {storeId}<br/>
                <br/>

            </div>
        </div>
    );
};
