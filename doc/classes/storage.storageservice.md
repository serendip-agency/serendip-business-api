[Serendip Business API](../README.md) > [Storage](../modules/storage.md) > [StorageService](../classes/storage.storageservice.md)

# Class: StorageService

## Hierarchy

**StorageService**

## Index

### Constructors

* [constructor](storage.storageservice.md#constructor)

### Properties

* [businessesCollection](storage.storageservice.md#businessescollection)
* [dataPath](storage.storageservice.md#datapath)
* [usersCollection](storage.storageservice.md#userscollection)

### Methods

* [assemblePartsIfPossible](storage.storageservice.md#assemblepartsifpossible)
* [checkPartsBeforeUpload](storage.storageservice.md#checkpartsbeforeupload)
* [getDirectoryOfPath](storage.storageservice.md#getdirectoryofpath)
* [getFilePartsInfo](storage.storageservice.md#getfilepartsinfo)
* [notifyUser](storage.storageservice.md#notifyuser)
* [start](storage.storageservice.md#start)
* [uploadPercent](storage.storageservice.md#uploadpercent)
* [userHasAccessToPath](storage.storageservice.md#userhasaccesstopath)
* [writeBase64AsFile](storage.storageservice.md#writebase64asfile)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new StorageService**(dbService: *`DbService`*, webSocketService: *`WebSocketService`*): [StorageService](storage.storageservice.md)

*Defined in [src/services/StorageService.ts:47](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/StorageService.ts#L47)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| dbService | `DbService` |
| webSocketService | `WebSocketService` |

**Returns:** [StorageService](storage.storageservice.md)

___

## Properties

<a id="businessescollection"></a>

###  businessesCollection

**● businessesCollection**: *[DbCollectionInterface](../interfaces/db.dbcollectioninterface.md)<`BusinessModel`>*

*Defined in [src/services/StorageService.ts:46](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/StorageService.ts#L46)*

___
<a id="datapath"></a>

###  dataPath

**● dataPath**: *`string`*

*Defined in [src/services/StorageService.ts:47](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/StorageService.ts#L47)*

___
<a id="userscollection"></a>

###  usersCollection

**● usersCollection**: *[DbCollectionInterface](../interfaces/db.dbcollectioninterface.md)<[UserModel](auth.usermodel.md)>*

*Defined in [src/services/StorageService.ts:45](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/StorageService.ts#L45)*

___

## Methods

<a id="assemblepartsifpossible"></a>

###  assemblePartsIfPossible

▸ **assemblePartsIfPossible**(filePath: *`any`*, userId: *`any`*): `Promise`<`void`>

*Defined in [src/services/StorageService.ts:184](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/StorageService.ts#L184)*

check .part files for specific filePath if all required files are available it will get assemble the file

**Parameters:**

| Name | Type |
| ------ | ------ |
| filePath | `any` |
| userId | `any` |

**Returns:** `Promise`<`void`>

___
<a id="checkpartsbeforeupload"></a>

###  checkPartsBeforeUpload

▸ **checkPartsBeforeUpload**(command: *[StorageCommandInterface](../interfaces/storage.storagecommandinterface.md)*): `Promise`<`void`>

*Defined in [src/services/StorageService.ts:177](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/StorageService.ts#L177)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| command | [StorageCommandInterface](../interfaces/storage.storagecommandinterface.md) |

**Returns:** `Promise`<`void`>

___
<a id="getdirectoryofpath"></a>

###  getDirectoryOfPath

▸ **getDirectoryOfPath**(path: *`string`*): `string`

*Defined in [src/services/StorageService.ts:231](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/StorageService.ts#L231)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| path | `string` |

**Returns:** `string`

___
<a id="getfilepartsinfo"></a>

###  getFilePartsInfo

▸ **getFilePartsInfo**(filePath: *`string`*): `Promise`<[StorageFilePartInfoInterface](../interfaces/storage.storagefilepartinfointerface.md)[]>

*Defined in [src/services/StorageService.ts:110](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/StorageService.ts#L110)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| filePath | `string` |

**Returns:** `Promise`<[StorageFilePartInfoInterface](../interfaces/storage.storagefilepartinfointerface.md)[]>

___
<a id="notifyuser"></a>

###  notifyUser

▸ **notifyUser**(userId: *`any`*, model: *`object`*): `Promise`<`void`>

*Defined in [src/services/StorageService.ts:96](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/StorageService.ts#L96)*

**Parameters:**

**userId: `any`**

**model: `object`**

| Name | Type |
| ------ | ------ |
| path | `string` |
| type | "command_done" \| "command_failed" \| "parts_total_mismatch" |

**Returns:** `Promise`<`void`>

___
<a id="start"></a>

###  start

▸ **start**(): `Promise`<`void`>

*Defined in [src/services/StorageService.ts:284](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/StorageService.ts#L284)*

**Returns:** `Promise`<`void`>

___
<a id="uploadpercent"></a>

###  uploadPercent

▸ **uploadPercent**(filePath: *`any`*): `Promise`<`number`>

*Defined in [src/services/StorageService.ts:157](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/StorageService.ts#L157)*

calculate upload percent base on uploaded parts divide by total

**Parameters:**

| Name | Type |
| ------ | ------ |
| filePath | `any` |

**Returns:** `Promise`<`number`>

___
<a id="userhasaccesstopath"></a>

###  userHasAccessToPath

▸ **userHasAccessToPath**(userId: *`string`*, path: *`string`*): `Promise`<`boolean`>

*Defined in [src/services/StorageService.ts:54](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/StorageService.ts#L54)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| userId | `string` |
| path | `string` |

**Returns:** `Promise`<`boolean`>

___
<a id="writebase64asfile"></a>

###  writeBase64AsFile

▸ **writeBase64AsFile**(base64: *`any`*, path: *`any`*): `Promise`<`void`>

*Defined in [src/services/StorageService.ts:79](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/StorageService.ts#L79)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| base64 | `any` |
| path | `any` |

**Returns:** `Promise`<`void`>

___

