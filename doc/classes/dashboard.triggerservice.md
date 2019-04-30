[Serendip Business API](../README.md) > [Dashboard](../modules/dashboard.md) > [TriggerService](../classes/dashboard.triggerservice.md)

# Class: TriggerService

## Hierarchy

**TriggerService**

## Implements

* `ServerServiceInterface`

## Index

### Constructors

* [constructor](dashboard.triggerservice.md#constructor)

### Methods

* [checkEvent](dashboard.triggerservice.md#checkevent)
* [start](dashboard.triggerservice.md#start)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new TriggerService**(): [TriggerService](dashboard.triggerservice.md)

*Defined in [src/services/TriggerService.ts:14](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/TriggerService.ts#L14)*

**Returns:** [TriggerService](dashboard.triggerservice.md)

___

## Methods

<a id="checkevent"></a>

###  checkEvent

▸ **checkEvent**(type: *"form" \| "report" \| `string`*, subType: *`string`*): `void`

*Defined in [src/services/TriggerService.ts:17](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/TriggerService.ts#L17)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| type | "form" \| "report" \| `string` |
| subType | `string` |

**Returns:** `void`

___
<a id="start"></a>

###  start

▸ **start**(): `Promise`<`void`>

*Defined in [src/services/TriggerService.ts:19](https://github.com/serendip-agency/serendip-business-api/blob/5f2768d/src/services/TriggerService.ts#L19)*

**Returns:** `Promise`<`void`>

___

