[Serendip Business API](../README.md) > [Profile](../modules/profile.md) > [ProfileService](../classes/profile.profileservice.md)

# Class: ProfileService

## Hierarchy

**ProfileService**

## Implements

* `ServerServiceInterface`

## Index

### Constructors

* [constructor](profile.profileservice.md#constructor)

### Properties

* [collection](profile.profileservice.md#collection)
* [dependencies](profile.profileservice.md#dependencies)

### Methods

* [findProfileById](profile.profileservice.md#findprofilebyid)
* [findProfileByUserId](profile.profileservice.md#findprofilebyuserid)
* [start](profile.profileservice.md#start)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new ProfileService**(dbService: *`DbService`*): [ProfileService](profile.profileservice.md)

*Defined in [src/services/ProfileService.ts:13](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/ProfileService.ts#L13)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| dbService | `DbService` |

**Returns:** [ProfileService](profile.profileservice.md)

___

## Properties

<a id="collection"></a>

###  collection

**● collection**: *[DbCollectionInterface](../interfaces/db.dbcollectioninterface.md)<`ProfileModel`>*

*Defined in [src/services/ProfileService.ts:11](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/ProfileService.ts#L11)*

___
<a id="dependencies"></a>

### `<Static>` dependencies

**● dependencies**: *`string`[]* =  ["DbService"]

*Defined in [src/services/ProfileService.ts:13](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/ProfileService.ts#L13)*

___

## Methods

<a id="findprofilebyid"></a>

###  findProfileById

▸ **findProfileById**(id: *`string`*, skip?: *`number`*, limit?: *`number`*): `Promise`<`ProfileModel`>

*Defined in [src/services/ProfileService.ts:24](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/ProfileService.ts#L24)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |
| `Optional` skip | `number` |
| `Optional` limit | `number` |

**Returns:** `Promise`<`ProfileModel`>

___
<a id="findprofilebyuserid"></a>

###  findProfileByUserId

▸ **findProfileByUserId**(id: *`string`*, skip?: *`number`*, limit?: *`number`*): `Promise`<`ProfileModel`>

*Defined in [src/services/ProfileService.ts:35](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/ProfileService.ts#L35)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| id | `string` |
| `Optional` skip | `number` |
| `Optional` limit | `number` |

**Returns:** `Promise`<`ProfileModel`>

___
<a id="start"></a>

###  start

▸ **start**(): `Promise`<`void`>

*Defined in [src/services/ProfileService.ts:17](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/ProfileService.ts#L17)*

**Returns:** `Promise`<`void`>

___

