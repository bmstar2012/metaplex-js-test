import React from 'react';
import {useState, useMemo} from 'react';
import './app.scss';
import {Connection, programs} from '@metaplex/js';
import {Keypair, PublicKey, clusterApiUrl} from '@solana/web3.js';
import {HomeView} from "./home";
/// Wallet start
import {useWallet, WalletProvider, ConnectionProvider} from '@solana/wallet-adapter-react';
import {WalletModalProvider, WalletMultiButton, WalletDisconnectButton} from '@solana/wallet-adapter-react-ui';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
    getLedgerWallet,
    getPhantomWallet,
    getSlopeWallet,
    getSolflareWallet,
    getSolletExtensionWallet,
    getSolletWallet,
    getTorusWallet,
} from '@solana/wallet-adapter-wallets';
require('@solana/wallet-adapter-react-ui/styles.css');
/// Wallet end


function App() {
    const network = WalletAdapterNetwork.Devnet;
    const endpoint = useMemo(() => clusterApiUrl(network), [network]);
    const wallets = useMemo(() => [
        getPhantomWallet(),
        getSlopeWallet(),
        getSolflareWallet(),
        // getTorusWallet({
        //     options: { clientId: 'Get a client ID @ https://developer.tor.us' }
        // }),
        getLedgerWallet(),
        getSolletWallet({ network }),
        getSolletExtensionWallet({ network }),
    ], [network]);

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
                <WalletModalProvider>
                    <HomeView/>
                </WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}

export default App;
