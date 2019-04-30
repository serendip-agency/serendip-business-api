[Serendip Business API](../README.md) > [Business](../modules/business.md) > [BusinessService](../classes/business.businessservice.md)

# Class: BusinessService

## Hierarchy

**BusinessService**

## Implements

* `ServerServiceInterface`

## Index

### Constructors

* [constructor](business.businessservice.md#constructor)

### Properties

* [businessCollection](business.businessservice.md#businesscollection)
* [dependencies](business.businessservice.md#dependencies)

### Methods

* [delete](business.businessservice.md#delete)
* [findBusinessesByUserId](business.businessservice.md#findbusinessesbyuserid)
* [findById](business.businessservice.md#findbyid)
* [insert](business.businessservice.md#insert)
* [start](business.businessservice.md#start)
* [update](business.businessservice.md#update)
* [userHasAccessToBusiness](business.businessservice.md#userhasaccesstobusiness)
* [checkUserAccess](business.businessservice.md#checkuseraccess)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new BusinessService**(): [BusinessService](business.businessservice.md)

*Defined in [src/services/BusinessService.ts:29](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/BusinessService.ts#L29)*

**Returns:** [BusinessService](business.businessservice.md)

___

## Properties

<a id="businesscollection"></a>

###  businessCollection

**● businessCollection**: *[DbCollectionInterface](../interfaces/db.dbcollectioninterface.md)<`BusinessModel`>*

*Defined in [src/services/BusinessService.ts:29](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/BusinessService.ts#L29)*

___
<a id="dependencies"></a>

### `<Static>` dependencies

**● dependencies**: *`string`[]* =  ["AuthService", "DbService"]

*Defined in [src/services/BusinessService.ts:25](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/BusinessService.ts#L25)*

___

## Methods

<a id="delete"></a>

###  delete

▸ **delete**(model: *`BusinessModel`*): `Promise`<`BusinessModel`>

*Defined in [src/services/BusinessService.ts:51](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/BusinessService.ts#L51)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| model | `BusinessModel` |

**Returns:** `Promise`<`BusinessModel`>

___
<a id="findbusinessesbyuserid"></a>

###  findBusinessesByUserId

▸ **findBusinessesByUserId**(userId: *`string`*): `Promise`<`BusinessModel`[]>

*Defined in [src/services/BusinessService.ts:62](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/BusinessService.ts#L62)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| userId | `string` |

**Returns:** `Promise`<`BusinessModel`[]>

___
<a id="findbyid"></a>

###  findById

▸ **findById**(id: *`string`*): `Promise`<`BusinessModel`>

*Defined in [src/services/BusinessService.ts:55](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/BusinessService.ts#L55)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |

**Returns:** `Promise`<`BusinessModel`>

___
<a id="insert"></a>

###  insert

▸ **insert**(model: *`BusinessModel`*): `Promise`<`BusinessModel`>

*Defined in [src/services/BusinessService.ts:43](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/BusinessService.ts#L43)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| model | `BusinessModel` |

**Returns:** `Promise`<`BusinessModel`>

___
<a id="start"></a>

###  start

▸ **start**(): `Promise`<`void`>

*Defined in [src/services/BusinessService.ts:36](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/BusinessService.ts#L36)*

**Returns:** `Promise`<`void`>

___
<a id="update"></a>

###  update

▸ **update**(model: *`BusinessModel`*): `Promise`<`BusinessModel`>

*Defined in [src/services/BusinessService.ts:47](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/BusinessService.ts#L47)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| model | `BusinessModel` |

**Returns:** `Promise`<`BusinessModel`>

___
<a id="userhasaccesstobusiness"></a>

###  userHasAccessToBusiness

▸ **userHasAccessToBusiness**(userId: *`any`*, businessId: *`any`*): `Promise`<`boolean`>

*Defined in [src/services/BusinessService.ts:85](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/BusinessService.ts#L85)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| userId | `any` |
| businessId | `any` |

**Returns:** `Promise`<`boolean`>

___
<a id="checkuseraccess"></a>

### `<Static>` checkUserAccess

▸ **checkUserAccess**(req: *`HttpRequestInterface`*, res: *`any`*, next: *`any`*, done: *`any`*): `Promise`<`any`>

*Defined in [src/services/BusinessService.ts:92](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/BusinessService.ts#L92)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| req | `HttpRequestInterface` |
| res | `any` |
| next | `any` |
| done | `any` |

**Returns:** `Promise`<`any`>

___

