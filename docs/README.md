# AirGap Coin Library

The `airgap-coin-lib` is a protocol-agnostic library that allows easy handling of the most important tasks relating cryptocurrencies and blockchains.

It implements operations such as preparing, signing and broadcasting transactions for a range of protocols.

The library consists of a shared interface for all implemented protocols. This is especially useful in the context of AirGap because methods are designed to support offline key management and signing. The following core operations are specified:

- `prepareTransaction` - This is done on AirGap Wallet (online) side. Either a public key or extended public key is used and will fetch the required information from the network.
- `signTransaction` - This is done in AirGap Vault (offline) side. The output of "prepareTransaction" is the input for this method (hence the output of "prepareTransaction" is transferred via URL scheme (same-device) or QR code (2-device-setup)).
- `broadcastTransaction` - This is done in AirGap Wallet (online) side. The output of "signTransaction" is the input for this method (hence the output of "signTransaction" is transferred via URL scheme (same-device) or QR code (2-device-setup)).

## Getting started

```
$ npm install airgap-coin-lib
```

### Requirements

```
npm >= 6
NodeJS >= 12
```

Build dependencies get installed using `npm install`.

### Clone and Run

```
$ git clone https://github.com/airgap-it/airgap-coin-lib.git
$ cd airgap-coin-lib
$ npm install
```

To run the tests, you will have to install the test dependencies

```
$ npm run install-test-dependencies
$ npm test
```

To remove the test dependencies and clean up the `package.json` and `package-lock.json`, execute this command

```
$ npm run install-build-dependencies
```

## Supported Protocols

The modular design used in this library allows you to simply add new protocols with special logic. Adding a new Bitcoin-like protocol basically means:

1. select the correct network parameters (see `src/networks.ts`)
2. set the Insight API URL to communicate with the blockchain

Adding a new Ethereum-like protocol means:

1. set the correct chain id
2. set the JSON RPC URL

Currently supported are:

- Bitcoin
- Ethereum
  - Generic ERC20 Tokens
- Aeternity
- Tezos
- Groestlcoin
- Cosmos
- Polkadot
- Kusama

## Features

### Protocols

The way the interface was designed is to allow stateless calls. This means the class itself stores very little state itself.
All required input comes from the method params (public key, extended public key, etc...)

Currently we support for Bitcoin-like (UTXO) protocols:

- Single Address Wallets (deprecated)
- HD Wallets

Currently we support for Ethereum-like (Account-based) protocols:

- Single Address Wallets

### Delegation

There is a different interface that can be implemented if the protocol supports delegation. The delegation flow usually requires some changes in the user interface of the AirGap Wallet as well.

### Inter App Communication

A serializer is included that encodes JSON structures with RLP and base58check. Those strings can then be sent to the other app, either through QR codes or a URL. The serializer can only serialize messages in predefined formats, so new message types have to be added when new protocols are added.

## Synchronising information between wallet and vault

Such that the system works we need to be able to synchronise wallets. A wallet can be:

- Single Address Wallet
- HD Wallet

For the single address wallet we only need to share the public key. For HD Wallet we need to share the extended public key.
