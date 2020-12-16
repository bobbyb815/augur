[@augurproject/types](../README.md) › [Globals](../globals.md) › ["augur-sdk/src/api/ZeroX"](../modules/_augur_sdk_src_api_zerox_.md) › [ZeroXPlaceTradeParams](_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md)

# Interface: ZeroXPlaceTradeParams

## Hierarchy

  ↳ [NativePlaceTradeChainParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradechainparams.md)

  ↳ **ZeroXPlaceTradeParams**

## Index

### Properties

* [amount](_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md#amount)
* [direction](_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md#direction)
* [doNotCreateOrders](_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md#donotcreateorders)
* [expirationTime](_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md#expirationtime)
* [fingerprint](_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md#fingerprint)
* [market](_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md#market)
* [numOutcomes](_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md#numoutcomes)
* [numTicks](_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md#numticks)
* [outcome](_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md#outcome)
* [postOnly](_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md#optional-postonly)
* [price](_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md#price)
* [shares](_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md#shares)
* [takerAddress](_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md#optional-takeraddress)
* [tradeGroupId](_augur_sdk_src_api_zerox_.zeroxplacetradeparams.md#tradegroupid)

## Properties

###  amount

• **amount**: *BigNumber*

*Inherited from [NativePlaceTradeChainParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradechainparams.md).[amount](_augur_sdk_src_api_onchaintrade_.nativeplacetradechainparams.md#amount)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:52](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/OnChainTrade.ts#L52)*

___

###  direction

• **direction**: *TradeDirection*

*Inherited from [NativePlaceTradeParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md).[direction](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md#direction)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:32](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/OnChainTrade.ts#L32)*

___

###  doNotCreateOrders

• **doNotCreateOrders**: *boolean*

*Inherited from [NativePlaceTradeParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md).[doNotCreateOrders](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md#donotcreateorders)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:39](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/OnChainTrade.ts#L39)*

___

###  expirationTime

• **expirationTime**: *BigNumber*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:80](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L80)*

___

###  fingerprint

• **fingerprint**: *string*

*Inherited from [NativePlaceTradeParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md).[fingerprint](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md#fingerprint)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:38](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/OnChainTrade.ts#L38)*

___

###  market

• **market**: *string*

*Inherited from [NativePlaceTradeParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md).[market](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md#market)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:33](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/OnChainTrade.ts#L33)*

___

###  numOutcomes

• **numOutcomes**: *NumOutcomes*

*Inherited from [NativePlaceTradeParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md).[numOutcomes](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md#numoutcomes)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:35](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/OnChainTrade.ts#L35)*

___

###  numTicks

• **numTicks**: *BigNumber*

*Inherited from [NativePlaceTradeParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md).[numTicks](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md#numticks)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:34](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/OnChainTrade.ts#L34)*

___

###  outcome

• **outcome**: *OutcomeNumber*

*Inherited from [NativePlaceTradeParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md).[outcome](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md#outcome)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:36](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/OnChainTrade.ts#L36)*

___

### `Optional` postOnly

• **postOnly**? : *boolean*

*Defined in [packages/augur-sdk/src/api/ZeroX.ts:81](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/ZeroX.ts#L81)*

___

###  price

• **price**: *BigNumber*

*Inherited from [NativePlaceTradeChainParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradechainparams.md).[price](_augur_sdk_src_api_onchaintrade_.nativeplacetradechainparams.md#price)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:53](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/OnChainTrade.ts#L53)*

___

###  shares

• **shares**: *BigNumber*

*Inherited from [NativePlaceTradeChainParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradechainparams.md).[shares](_augur_sdk_src_api_onchaintrade_.nativeplacetradechainparams.md#shares)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:54](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/OnChainTrade.ts#L54)*

___

### `Optional` takerAddress

• **takerAddress**? : *string*

*Inherited from [NativePlaceTradeParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md).[takerAddress](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md#optional-takeraddress)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:40](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/OnChainTrade.ts#L40)*

___

###  tradeGroupId

• **tradeGroupId**: *string*

*Inherited from [NativePlaceTradeParams](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md).[tradeGroupId](_augur_sdk_src_api_onchaintrade_.nativeplacetradeparams.md#tradegroupid)*

*Defined in [packages/augur-sdk/src/api/OnChainTrade.ts:37](https://github.com/AugurProject/augur/blob/88b6e76efb/packages/augur-sdk/src/api/OnChainTrade.ts#L37)*