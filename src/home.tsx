import React from 'react';
import {useState, useMemo} from 'react';
import './app.scss';
import {Connection, programs, actions, Wallet, NodeWallet, AnyPublicKey} from '@metaplex/js';

import {Keypair, PublicKey, clusterApiUrl} from '@solana/web3.js';

/// Wallet start
import {useWallet} from '@solana/wallet-adapter-react';
import {WalletMultiButton, WalletDisconnectButton} from '@solana/wallet-adapter-react-ui';
import { getPhantomWallet } from "@solana/wallet-adapter-wallets";
// import {AuctionExtended} from "@metaplex/js/lib/programs/auction";

const { metaplex: { Store, AuctionManager }, metadata: { Metadata, MasterEdition }, auction: {AuctionExtended}, vault: { Vault } } = programs;
// const {AuctionExtended} = auction;

const connection = new Connection('devnet');
const tokenPublicKey = 'Gz3vYbpsB2agTsAwedtvtTkQ1CG9vsioqLW3r9ecNpvZ';
const mintKey = '6p9FgYi6BkacAXQFwojtfZMug3rspUCbB5MhbuSsD5ko';
const metadataKey = 'EKARJfuuMXzAATpCQPVVNRZusVDpa5zWxQ2bwqyShX8V';
const masterEditionKey = 'HDQTR9qhqjLRVPsLC2Aq2J5csVEwHoEJdBbUb6XtdAGf';


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

                const masterEdition = await MasterEdition.load(connection, walletPubkey);
                console.log("onLookMyMetadata edition", masterEdition);
            }
        } catch {
            console.log("onLookMyMetadata", 'Failed to fetch metadata');
        }
    }

    const onLookMyMasterEdition = async () => {
        try {
            // Find metadata by owner
            if (walletPubkey) {
                const masterEdition = await MasterEdition.load(connection, masterEditionKey);
                console.log("onLookMyMasterEdition masterEdition", masterEdition);
            }
        } catch {
            console.log("onLookMyMasterEdition", 'Failed to fetch masterEdition');
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
            console.log("onLookupStore", 'Failed to fetch store');
        }
    }

    const onLookupAuctions = async () => {
        if (!wallet) {
            return;
        }
        // const metaplexWallet = new NodeWallet(wallet.)
        try {
            const auctionManagers = await AuctionManager.findMany(connection, {
                store: storeId,
            });
            const auctions = await Promise.all(
                auctionManagers.map(async (m) => {
                    console.log("auction_manager", m.pubkey.toBase58());
                    let auction = await m.getAuction(connection);
                    console.log('auction', auction.pubkey.toBase58(), auction);

                })
            );

            const vaults = await Promise.all(
                auctionManagers.map(async (m) => {
                    let vault = await Vault.load(connection, m.data.vault);
                    console.log('vault', vault.pubkey.toBase58(), vault);
                })
            );
            // console.log("auctions", auctions);

            const auctionsExtKeys = await Promise.all(
                auctionManagers.map((am) => AuctionExtended.getPDA(am.data.vault))
            );
            console.log("auctionsExtKeys --- before", auctionsExtKeys);
            const auctionsExt = await Promise.all(
                auctionsExtKeys.map((k) => AuctionExtended.load(connection, k))
            );
            console.log("auctionsExtKeys --- after", auctionsExtKeys);


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
                <button onClick={onLookMyMasterEdition} disabled={!wallet.connected}>My master edition</button>
                <br/>
                <button onClick={onLookupStore} disabled={!wallet.connected}>Check store</button><br/>
                <br/>
                Store: {storeId}<br/>
                <br/>
                <button onClick={onLookupAuctions} disabled={!storeId}>Check auctions</button><br/>
            </div>
        </div>
    );
};
