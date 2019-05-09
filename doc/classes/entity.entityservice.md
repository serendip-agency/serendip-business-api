[Serendip Business API](../README.md) > [Entity](../modules/entity.md) > [EntityService](../classes/entity.entityservice.md)

# Class: EntityService

## Hierarchy

**EntityService**

## Implements

* `ServerServiceInterface`

## Index

### Constructors

* [constructor](entity.entityservice.md#constructor)

### Properties

* [collection](entity.entityservice.md#collection)

### Methods

* [count](entity.entityservice.md#count)
* [delete](entity.entityservice.md#delete)
* [find](entity.entityservice.md#find)
* [findByBusinessId](entity.entityservice.md#findbybusinessid)
* [findById](entity.entityservice.md#findbyid)
* [insert](entity.entityservice.md#insert)
* [notifyUsers](entity.entityservice.md#notifyusers)
* [start](entity.entityservice.md#start)
* [update](entity.entityservice.md#update)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new EntityService**(dbService: *`DbService`*, webSocketService: *`WebSocketService`*, businessService: *[BusinessService](business.businessservice.md)*): [EntityService](entity.entityservice.md)

*Defined in [src/services/EntityService.ts:17](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/services/EntityService.ts#L17)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| dbService | `DbService` |
| webSocketService | `WebSocketService` |
| businessService | [BusinessService](business.businessservice.md) |

**Returns:** [EntityService](entity.entityservice.md)

___

## Properties

<a id="collection"></a>

###  collection

**● collection**: *[DbCollectionInterface](../interfaces/db.dbcollectioninterface.md)<`EntityModel`>*

*Defined in [src/services/EntityService.ts:17](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/services/EntityService.ts#L17)*

___

## Methods

<a id="count"></a>

###  count

▸ **count**(businessId: *`string`*): `Promise`<`Number`>

*Defined in [src/services/EntityService.ts:99](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/services/EntityService.ts#L99)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| businessId | `string` |

**Returns:** `Promise`<`Number`>

___
<a id="delete"></a>

###  delete

▸ **delete**(id: *`string`*, userId?: *`string`*): `Promise`<`void`>

*Defined in [src/services/EntityService.ts:78](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/services/EntityService.ts#L78)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |
| `Optional` userId | `string` |

**Returns:** `Promise`<`void`>

___
<a id="find"></a>

###  find

▸ **find**(query: *`any`*, skip?: *`number`*, limit?: *`number`*): `Promise`<`EntityModel`[]>

*Defined in [src/services/EntityService.ts:95](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/services/EntityService.ts#L95)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| query | `any` |
| `Optional` skip | `number` |
| `Optional` limit | `number` |

**Returns:** `Promise`<`EntityModel`[]>

___
<a id="findbybusinessid"></a>

###  findByBusinessId

▸ **findByBusinessId**(id: *`string`*, skip?: *`number`*, limit?: *`number`*): `Promise`<`EntityModel`[]>

*Defined in [src/services/EntityService.ts:91](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/services/EntityService.ts#L91)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |
| `Optional` skip | `number` |
| `Optional` limit | `number` |

**Returns:** `Promise`<`EntityModel`[]>

___
<a id="findbyid"></a>

###  findById

▸ **findById**(id: *`string`*, skip?: *`number`*, limit?: *`number`*): `Promise`<`EntityModel`>

*Defined in [src/services/EntityService.ts:84](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/services/EntityService.ts#L84)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |
| `Optional` skip | `number` |
| `Optional` limit | `number` |

**Returns:** `Promise`<`EntityModel`>

___
<a id="insert"></a>

###  insert

▸ **insert**(model: *`EntityModel`*): `Promise`<`EntityModel`>

*Defined in [src/services/EntityService.ts:65](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/services/EntityService.ts#L65)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| model | `EntityModel` |

**Returns:** `Promise`<`EntityModel`>

___
<a id="notifyusers"></a>

###  notifyUsers

▸ **notifyUsers**(event: *"insert" \| "update" \| "delete"*, model: *`EntityModel`*): `Promise`<`void`>

*Defined in [src/services/EntityService.ts:25](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/services/EntityService.ts#L25)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| event | "insert" \| "update" \| "delete" |
| model | `EntityModel` |

**Returns:** `Promise`<`void`>

___
<a id="start"></a>

###  start

▸ **start**(): `Promise`<`void`>

*Defined in [src/services/EntityService.ts:44](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/services/EntityService.ts#L44)*

**Returns:** `Promise`<`void`>

___
<a id="update"></a>

###  update

▸ **update**(model: *`EntityModel`*): `Promise`<`EntityModel`>

*Defined in [src/services/EntityService.ts:72](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/services/EntityService.ts#L72)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| model | `EntityModel` |

**Returns:** `Promise`<`EntityModel`>

___

