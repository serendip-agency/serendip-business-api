[Serendip Business API](../README.md) > [Client](../modules/client.md) > [ClientService](../classes/client.clientservice.md)

# Class: ClientService

## Hierarchy

**ClientService**

## Implements

* `HttpServiceInterface`

## Index

### Constructors

* [constructor](client.clientservice.md#constructor)

### Properties

* [business](client.clientservice.md#business)
* [data](client.clientservice.md#data)
* [entitySocket](client.clientservice.md#entitysocket)
* [ws](client.clientservice.md#ws)

### Methods

* [initEntitySocket](client.clientservice.md#initentitysocket)
* [start](client.clientservice.md#start)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new ClientService**(httpService: *`HttpService`*, dbService: *`DbService`*): [ClientService](client.clientservice.md)

*Defined in [src/services/ClientService.ts:18](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/services/ClientService.ts#L18)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| httpService | `HttpService` |
| dbService | `DbService` |

**Returns:** [ClientService](client.clientservice.md)

___

## Properties

<a id="business"></a>

###  business

**● business**: *`BusinessService`*

*Defined in [src/services/ClientService.ts:15](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/services/ClientService.ts#L15)*

___
<a id="data"></a>

###  data

**● data**: *`DataService`*

*Defined in [src/services/ClientService.ts:16](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/services/ClientService.ts#L16)*

___
<a id="entitysocket"></a>

###  entitySocket

**● entitySocket**: *`WebSocket`*

*Defined in [src/services/ClientService.ts:18](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/services/ClientService.ts#L18)*

___
<a id="ws"></a>

###  ws

**● ws**: *`WsService`*

*Defined in [src/services/ClientService.ts:17](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/services/ClientService.ts#L17)*

___

## Methods

<a id="initentitysocket"></a>

###  initEntitySocket

▸ **initEntitySocket**(): `Promise`<`void`>

*Defined in [src/services/ClientService.ts:211](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/services/ClientService.ts#L211)*

**Returns:** `Promise`<`void`>

___
<a id="start"></a>

###  start

▸ **start**(): `Promise`<`void`>

*Defined in [src/services/ClientService.ts:21](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/services/ClientService.ts#L21)*

**Returns:** `Promise`<`void`>

___

