### 0.9.0 (2020-07-17)

### Feature

- **all**: add sign/verify to all protocols
- **xtz**: testnet support
- **xtz**: FA2 support

### 0.8.8 (2020-07-07)

### Feature

- **polkadot/kusama**: add support for polkadot and kusama

### 0.8.7 (2020-07-03)

### Feature

- **cosmos**: add support for fetching delegator details

### 0.8.6 (2020-06-16)

### Bugfix

- **xtz**: fix issue when fetching delegator details

### 0.8.5 (2020-06-11)

### Feature

- **all**: update libsodium

### 0.8.4 (2020-06-04)

### Feature

- **xtz**: TezosUSD
- **cosmos**: use CORS proxy

### 0.8.3 (2020-05-29)

### Feature

- **all**: fee estimation

### 0.8.2 (2020-05-07)

### Feature

- **xtz**: add FA 1.2 support
- **xtz**: add staker token

### 0.8.1 (2020-05-06)

### Feature

- **xtz**: add gas_limit estimation

### 0.8.0 (2020-04-24)

### Feature

- **substrate**: add substrate protocol (polkadot and kusama)
- **xtz**: add taquito local forging
- **all**: add delegate interface
- **all**: add methods for getting keypair from mnemonic

### 0.7.7 (2020-04-24)

### Feature

### 0.7.6 (2020-04-15)

### Feature

- **eth**: add etherscan api key

### 0.7.5 (2020-04-02)

### Feature

- **tezos**: add tzbtc

### Bugfix

- **cosmos**: fetch balance fix

### 0.7.4 (2020-03-12)

### Feature

- **tezos**: prepare transactions with multiple operations

### Bugfix

- **eth**: balance not loading

### 0.7.3 (2020-03-10)

### Feature

- **tezos**: updated rewards calculation after carthagenet update

### 0.7.2 (2020-02-06)

### Bugfix

- **all**: resolve circular dependency

### 0.7.1 (2020-02-06)

### Feature

- **tezos**: add `prepareOperations` method

### 0.7.0 (2020-01-30)

### Feature

- **tezos**: added support for FA 1.2

### 0.6.5 (2020-01-29)

### Feature

- **tezos**: added deposits and fees to baking/endorsing rewards

### 0.6.4 (2020-01-02)

### Bug Fixes

- **tezos**: sort transaction history from newest to oldest

### 0.6.3 (2019-12-13)

### Features

- **cosmos**: include cosmos protocol upgrade changes

### Bug Fixes

- **cosmos**: return empty array if no transactions were found (instead of throwing an exception)

### 0.6.2 (2019-12-04)

### Bug Fixes

- **typescript**: remove typescript types that are not compatible with older typescript versions

### 0.6.1 (2019-12-04)

### Bug Fixes

- **typescript**: remove typescript types that are not compatible with older typescript versions

### 0.6.0 (2019-12-04)

### Breaking Changes

- **BigNumber:** remove `BigNumber` type in all public APIs. Now, all methods will take `strings` and return `strings` instead of `BigNumber`s.
- **serializer:** a new serializer has been added (the old one is still accessible but the imports paths are different). The old one will be removed in the next version.
- **getTransactionDetails and getTransactionDetailsFromSigned:** now return an array of `IAirGapTransaction`s
- **IAirGapTransaction:** `meta` property renamed to `extras`

### Features

- **serializer:** chunked messages (paged qr) support
- **all:** multi transaction support
- **cosmos:** add support for cosmos / atom
- **xtz:** add multi operation support
- **ae:** use aeternal.io block explorer
- **IAirGapTransaction:** added a new property called `transactionDetails` that contains more details about the transaction (which is different per protocol)

### Internals

- **typescript:** upgrade typescript from `3.5.3` to `3.7.2`
- **dependencies:** remove `tweetnacl` dependency and use `libsodium`
- **dependencies:** remove `web3`
- **dependencies:** remove `abi-decoder`
- **dependencies:** all dependencies (except for libsodium) are now included in the coinlib. The source code gets pulled directly from github (the actual source code, not the compiled npm package) and is shipped with the coinlib to prevent malicious code from being included.
- **dependencies:** split up "test" and "build" dependencies

### Bug Fixes

- **xtz:** wait for `libsodium` to be ready inside the coinlib

### 0.5.17 (2019-11-24)

### Features

- **xtz**: improved rewards calculation performance

### 0.5.16 (2019-11-22)

### Features

- **xtz**: now using new conseil api for rewards calculation

### 0.5.15 (2019-11-21)

### Features

- **xtz**: use new conseil api endpoint

### 0.5.14 (2019-10-25)

### Features

- **xtz**: fixed reward calculation for 005 cycles

### 0.5.13 (2019-10-23)

### Features

- **xtz**: added check of tz account balance before migration of kt account

### 0.5.12 (2019-10-18)

### Features

- **xtz**: added rewards and payouts calculations
- **xtz**: added support for multiple tezos operations in one transaction

### 0.5.7 (2019-10-18)

### Features

- **xtz**: now using a different tezos node for rpc calls

### 0.5.6 (2019-10-16)

### Features

- **xtz**: replace all calls to tzscan.io with calls to the conseil api

### 0.5.5 (2019-10-11)

### Features

- **xtz**: prepare for babylon network upgrade

### 0.5.4 (2019-09-19)

### Bug Fixes

- **actions**: catch errors and propagate them
- **xtz**: handle invalid responses

### 0.5.3 (2019-09-18)

### Features

- **xtz**: use tezblock.io as the tezos block explorer
- **eth**: replace trustwallet api with etherscan.io

### 0.5.2 (2019-09-17)

### Internals

- **xtz**: forge implementation refactoring

### Features

- **actions**: add repeatable actions

### 0.5.1 (2019-08-28)

### Bug Fixes

- **xtz**: allow `getBakerInfo` for tz2 and tz3 addresses

## 0.5.0 (2019-08-07)

### Internals

- **structure:** move code from `lib` to `src` folder
- **typescript:** upgrade typescript from `2.4` to `3.5.3`
- **typescript:** enable some `strict` settings
- **tslint:** stricter TSLint rules
- **prices:** add fallback to `coingecko` if price is not found on `cryptocompare`
- **dependencies:** forked all github dependencies to `airgap-it` organisation

### Breaking Changes

- **aeternity:** renamed `AEProtocol` class to `AeternityProtocol`

### Features

- **actions:** added actions [docs](https://airgap-it.github.io/airgap-coin-lib/#/action/action)
- **examples:** added some simple examples how to use the coinlib [examples](https://github.com/airgap-it/airgap-coin-lib/tree/master/examples)

### Bug Fixes

- **xtz:** use `tezrpc.me` node instead of tzscan.io because an endpoint has been disabled

### 0.4.4 (2019-05-31)

### Bug Fixes

- **xtz:** adjust gas limit to be compatible with athens upgrade

### 0.4.3 (2019-05-23)

### Features

- **grs:** add groestlcoin support

### 0.4.2 (2019-05-06)

### Features

- **xtz:** remove tezos beta tag
- **eth:** return tx hash when getting tx details
- **ae:** add support for transaction payload

### 0.3.13 (2019-05-04)

### 0.4.1 (2019-05-03)

### 0.3.11 (2019-05-03)

### 0.3.10 (2019-04-29)

### 0.3.9 (2019-04-29)

## 0.4.0 (2019-04-26)

### 0.3.8 (2019-04-15)

### 0.3.7 (2019-04-02)

### 0.3.6 (2019-03-21)

### 0.3.5 (2019-03-20)

### 0.3.4 (2019-03-19)

### 0.3.3 (2019-03-19)

### 0.3.2 (2019-03-18)

### 0.3.1 (2019-03-13)

## 0.3.0 (2019-02-20)

## 0.2.0 (2019-01-19)

### 0.1.10 (2019-01-09)

### 0.1.9 (2018-12-18)

### 0.1.8 (2018-12-17)

### 0.1.7 (2018-12-13)

### 0.1.6 (2018-12-12)

### 0.1.5 (2018-12-12)

### 0.1.4 (2018-11-26)

### 0.1.3 (2018-11-26)

### 0.1.2 (2018-11-16)

### 0.1.1 (2018-11-16)

## 0.1.0 (2018-11-16)
