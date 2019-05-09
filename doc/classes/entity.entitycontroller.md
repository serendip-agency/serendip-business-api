[Serendip Business API](../README.md) > [Entity](../modules/entity.md) > [EntityController](../classes/entity.entitycontroller.md)

# Class: EntityController

## Hierarchy

**EntityController**

## Index

### Constructors

* [constructor](entity.entitycontroller.md#constructor)

### Methods

* [onRequest](entity.entitycontroller.md#onrequest)

### Object literals

* [changes](entity.entitycontroller.md#changes)
* [count](entity.entitycontroller.md#count)
* [delete](entity.entitycontroller.md#delete)
* [details](entity.entitycontroller.md#details)
* [export](entity.entitycontroller.md#export)
* [insert](entity.entitycontroller.md#insert)
* [list](entity.entitycontroller.md#list)
* [search](entity.entitycontroller.md#search)
* [update](entity.entitycontroller.md#update)
* [zip](entity.entitycontroller.md#zip)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new EntityController**(entityService: *[EntityService](entity.entityservice.md)*, dbService: *`DbService`*): [EntityController](entity.entitycontroller.md)

*Defined in [src/controllers/EntityController.ts:24](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L24)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| entityService | [EntityService](entity.entityservice.md) |
| dbService | `DbService` |

**Returns:** [EntityController](entity.entitycontroller.md)

___

## Methods

<a id="onrequest"></a>

###  onRequest

▸ **onRequest**(req: *`HttpRequestInterface`*, res: *`HttpResponseInterface`*, next: *`any`*, done: *`any`*): `Promise`<`void`>

*Defined in [src/controllers/EntityController.ts:30](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L30)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| req | `HttpRequestInterface` |
| res | `HttpResponseInterface` |
| next | `any` |
| done | `any` |

**Returns:** `Promise`<`void`>

___

## Object literals

<a id="changes"></a>

###  changes

**changes**: *`object`*

*Defined in [src/controllers/EntityController.ts:190](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L190)*

<a id="changes.actions"></a>

####  actions

**● actions**: *([checkUserAccess](business.businessservice.md#checkuseraccess) \| `(Anonymous function)`)[]* =  [
      BusinessService.checkUserAccess,
      async (
        req,
        res,
        next,
        done,
        access: BusinessCheckAccessResultInterface
      ) => {
        const possibleQueryFields = [
          "_id",
          "model._id",
          "model._rdate",
          "model._udate",
          "model._vdate",
          "model._cdate",
          "model._ruser",
          "model._uuser",
          "model._vuser",
          "model._cuser",
          "model._entity",
          "type"
        ];

        const changesCollection = await this.dbService.collection(
          "EntityChanges"
        );
        var query = _.extend(
          {
            "model._business": access.business._id.toString()
          },
          _.pick(req.body, possibleQueryFields)
        );

        if (req.body.count) {
          res.json(await changesCollection.count(query));
        } else {
          const changesQuery: {
            type: EntityChangeType;
            _id: string;
          }[] = (await changesCollection.find(query)).map((p: EntityModel) => {
            return { type: p.type, _id: p.model._id };
          });

          res.json({
            created: changesQuery.filter(p => p.type == EntityChangeType.Create)
              .length,
            updated: changesQuery.filter(p => p.type == EntityChangeType.Update)
              .length,
            deleted: changesQuery
              .filter(p => p.type == EntityChangeType.Create)
              .map(item => item._id)
          });
        }
      }
    ]

*Defined in [src/controllers/EntityController.ts:193](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L193)*

___
<a id="changes.method"></a>

####  method

**● method**: *`string`* = "post"

*Defined in [src/controllers/EntityController.ts:192](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L192)*

___
<a id="changes.route"></a>

####  route

**● route**: *`string`* = "/api/entity/changes"

*Defined in [src/controllers/EntityController.ts:191](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L191)*

___

___
<a id="count"></a>

###  count

**count**: *`object`*

*Defined in [src/controllers/EntityController.ts:345](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L345)*

<a id="count.actions-1"></a>

####  actions

**● actions**: *([checkUserAccess](business.businessservice.md#checkuseraccess) \| `(Anonymous function)`)[]* =  [
      BusinessService.checkUserAccess,
      async (
        req,
        res,
        next,
        done,
        access: BusinessCheckAccessResultInterface
      ) => {
        var model = await this.entityService.count(access.business._id);
        res.json(model);
      }
    ]

*Defined in [src/controllers/EntityController.ts:348](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L348)*

___
<a id="count.method-1"></a>

####  method

**● method**: *`string`* = "post"

*Defined in [src/controllers/EntityController.ts:347](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L347)*

___
<a id="count.route-1"></a>

####  route

**● route**: *`string`* = "/api/entity/:entity/count"

*Defined in [src/controllers/EntityController.ts:346](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L346)*

___

___
<a id="delete"></a>

###  delete

**delete**: *`object`*

*Defined in [src/controllers/EntityController.ts:481](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L481)*

<a id="delete.actions-2"></a>

####  actions

**● actions**: *`(Anonymous function)`[]* =  [
      BusinessService.checkUserAccess,
      async (
        req,
        res,
        next,
        done,
        access: BusinessCheckAccessResultInterface
      ) => {
        var _id = req.body._id;

        if (!_id) return next(new HttpError(400, "_id is missing"));

        var entity = await this.entityService.findById(_id);
        if (!entity) return next(new HttpError(400, "entity not found"));

        if (entity._business.toString() != access.business._id.toString())
          return next(new HttpError(400, "access mismatch"));

        entity._vdate = entity._rdate = Date.now();

        entity._ruser = entity._vuser = access.member.userId.toString();

        await this.entityService.update(entity);

        try {
          await this.entityService.delete(_id, req.user._id);
        } catch (e) {
          return next(new HttpError(500, e.message || e));
        }

        res.json(entity);
      }
    ]

*Defined in [src/controllers/EntityController.ts:484](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L484)*

___
<a id="delete.method-2"></a>

####  method

**● method**: *`string`* = "post"

*Defined in [src/controllers/EntityController.ts:483](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L483)*

___
<a id="delete.route-2"></a>

####  route

**● route**: *`string`* = "/api/entity/:entity/delete"

*Defined in [src/controllers/EntityController.ts:482](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L482)*

___

___
<a id="details"></a>

###  details

**details**: *`object`*

*Defined in [src/controllers/EntityController.ts:141](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L141)*

<a id="details.actions-3"></a>

####  actions

**● actions**: *`(Anonymous function)`[]* =  [
      BusinessService.checkUserAccess,
      async (
        req,
        res,
        next,
        done,
        access: BusinessCheckAccessResultInterface
      ) => {
        var model = await this.entityService.findById(req.body._id);

        if (!model) return done(404, "entity not found");

        if (model._business == access.business._id) res.json(model);
        else return done(404, "entity not found");
      }
    ]

*Defined in [src/controllers/EntityController.ts:144](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L144)*

___
<a id="details.method-3"></a>

####  method

**● method**: *`string`* = "post"

*Defined in [src/controllers/EntityController.ts:143](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L143)*

___
<a id="details.route-3"></a>

####  route

**● route**: *`string`* = "/api/entity/:entity/details"

*Defined in [src/controllers/EntityController.ts:142](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L142)*

___

___
<a id="export"></a>

###  export

**export**: *`object`*

*Defined in [src/controllers/EntityController.ts:82](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L82)*

<a id="export.actions-4"></a>

####  actions

**● actions**: *([checkUserAccess](business.businessservice.md#checkuseraccess) \| `(Anonymous function)`)[]* =  [
      BusinessService.checkUserAccess,
      async (
        req,
        res,
        next,
        done,
        access: BusinessCheckAccessResultInterface
      ) => {
        var range = {
          from:
            req.body.from && Validator.isNumeric(req.body.from)
              ? req.body.from
              : 0,
          to:
            req.body.to && Validator.isNumeric(req.body.to)
              ? req.body.to
              : Date.now()
        };

        var entities = await this.entityService.find({
          _business: access.business._id.toString(),
          _entity: "entity"
        });

        res.setHeader("content-type", "application/zip");

        var zip = archiver("zip", {
          zlib: { level: 9 } // Sets the compression level.
        });

        zip.pipe(res);

        const collections = ["dashboard", "entity", "form", "people", "report"];
        entities.forEach(item => {
          if (collections.indexOf(item.name) === -1)
            collections.push(item.name);
        });

        for (const entityName of collections) {
          const entityData = await this.entityService.find({
            _business: access.business._id.toString(),
            _vdate: { $gt: range.from, $lt: range.to },
            _entity: entityName
          });
          zip.append(JSON.stringify(entityData), {
            name: entityName + ".json"
          });
        }

        zip.finalize();
      }
    ]

*Defined in [src/controllers/EntityController.ts:86](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L86)*

___
<a id="export.isstream"></a>

####  isStream

**● isStream**: *`true`* = true

*Defined in [src/controllers/EntityController.ts:85](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L85)*

___
<a id="export.method-4"></a>

####  method

**● method**: *`string`* = "post"

*Defined in [src/controllers/EntityController.ts:84](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L84)*

___
<a id="export.route-4"></a>

####  route

**● route**: *`string`* = "/api/entity/export"

*Defined in [src/controllers/EntityController.ts:83](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L83)*

___

___
<a id="insert"></a>

###  insert

**insert**: *`object`*

*Defined in [src/controllers/EntityController.ts:409](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L409)*

<a id="insert.actions-5"></a>

####  actions

**● actions**: *`(Anonymous function)`[]* =  [
      BusinessService.checkUserAccess,
      async (
        req,
        res,
        next,
        done,
        access: BusinessCheckAccessResultInterface
      ) => {
        var model: EntityModel = req.body;

        if (!model._entity) model._entity = req.params.entity;

        if (!model._business) model._business = access.business._id.toString();

        model._cuser = model._vuser = access.member.userId.toString();

        if (!model._vdate) model._vdate = Date.now();

        if (!model._cdate) model._cdate = Date.now();

        try {
          model = await this.entityService.insert(model);
        } catch (e) {
          return done(500, e.message || e);
        }

        res.json(model);
      }
    ]

*Defined in [src/controllers/EntityController.ts:412](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L412)*

___
<a id="insert.method-5"></a>

####  method

**● method**: *`string`* = "post"

*Defined in [src/controllers/EntityController.ts:411](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L411)*

___
<a id="insert.route-5"></a>

####  route

**● route**: *`string`* = "/api/entity/:entity/insert"

*Defined in [src/controllers/EntityController.ts:410](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L410)*

___

___
<a id="list"></a>

###  list

**list**: *`object`*

*Defined in [src/controllers/EntityController.ts:316](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L316)*

<a id="list.actions-6"></a>

####  actions

**● actions**: *([checkUserAccess](business.businessservice.md#checkuseraccess) \| `(Anonymous function)`)[]* =  [
      BusinessService.checkUserAccess,
      async (
        req,
        res,
        next,
        done,
        access: BusinessCheckAccessResultInterface
      ) => {
        const query = req.body.query || {};

        const model = await this.entityService.find(
          _.extend(query, {
            _business: access.business._id.toString(),
            _entity: req.params.entity
          }),
          req.body.skip,
          req.body.limit
        );

        res.json(model);
      }
    ]

*Defined in [src/controllers/EntityController.ts:320](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L320)*

___
<a id="list.method-6"></a>

####  method

**● method**: *`string`* = "post"

*Defined in [src/controllers/EntityController.ts:319](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L319)*

___
<a id="list.route-6"></a>

####  route

**● route**: *`string`* = "/api/entity/:entity/list"

*Defined in [src/controllers/EntityController.ts:317](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L317)*

___

___
<a id="search"></a>

###  search

**search**: *`object`*

*Defined in [src/controllers/EntityController.ts:363](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L363)*

<a id="search.actions-7"></a>

####  actions

**● actions**: *([checkUserAccess](business.businessservice.md#checkuseraccess) \| `(Anonymous function)`)[]* =  [
      BusinessService.checkUserAccess,
      async (
        req,
        res,
        next,
        done,
        access: BusinessCheckAccessResultInterface
      ) => {
        //{ '$regex': '.*' + req.body.query + '.*' }

        // var properties = req.body.properties || [];

        // var project: any = {};
        // var q = req.body.query || "";

        // if(properties.indexOf('_id') === -1)
        // properties.push('_id');

        // var model = await this.entityService.collection.find({
        //   _entity: req.params.entity,
        //   _business: access.business._id.toString(),
        //   $text: { $search: q }
        // })
        //   .aggregate([
        //     {
        //       $match: {
        //         _entity: req.params.entity,
        //         _business: access.business._id.toString(),
        //         $text: { $search: q }
        //       }
        //     },
        //     { $sort: { score: { $meta: "textScore" } } },
        //     { $project: project }
        //   ])
        //   .limit(req.body.limit || 30)
        //   .toArray();

        res.json([]);
      }
    ]

*Defined in [src/controllers/EntityController.ts:366](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L366)*

___
<a id="search.method-7"></a>

####  method

**● method**: *`string`* = "post"

*Defined in [src/controllers/EntityController.ts:365](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L365)*

___
<a id="search.route-7"></a>

####  route

**● route**: *`string`* = "/api/entity/:entity/search"

*Defined in [src/controllers/EntityController.ts:364](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L364)*

___

___
<a id="update"></a>

###  update

**update**: *`object`*

*Defined in [src/controllers/EntityController.ts:444](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L444)*

<a id="update.actions-8"></a>

####  actions

**● actions**: *`(Anonymous function)`[]* =  [
      BusinessService.checkUserAccess,
      async (
        req,
        res,
        next,
        done,
        access: BusinessCheckAccessResultInterface
      ) => {
        var model: EntityModel = req.body;

        if (!model._entity) model._entity = req.params.entity;

        model._vuser = model._uuser = access.member.userId.toString();
        model._vdate = model._udate = Date.now();

        try {
          await EntityModel.validate(model);
        } catch (e) {
          return next(new HttpError(400, e.message || e));
        }

        try {
          await this.entityService.update(model);
        } catch (e) {
          return next(new HttpError(500, e.message || e));
        }

        res.json(model);
      }
    ]

*Defined in [src/controllers/EntityController.ts:448](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L448)*

___
<a id="update.method-8"></a>

####  method

**● method**: *`string`* = "post"

*Defined in [src/controllers/EntityController.ts:447](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L447)*

___
<a id="update.route-8"></a>

####  route

**● route**: *`string`* = "/api/entity/:entity/update"

*Defined in [src/controllers/EntityController.ts:445](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L445)*

___

___
<a id="zip"></a>

###  zip

**zip**: *`object`*

*Defined in [src/controllers/EntityController.ts:39](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L39)*

<a id="zip.actions-9"></a>

####  actions

**● actions**: *([checkUserAccess](business.businessservice.md#checkuseraccess) \| `(Anonymous function)`)[]* =  [
      BusinessService.checkUserAccess,
      async (
        req,
        res,
        next,
        done,
        access: BusinessCheckAccessResultInterface
      ) => {
        var range = {
          from:
            req.body.from && Validator.isNumeric(req.body.from)
              ? req.body.from
              : 0,
          to:
            req.body.to && Validator.isNumeric(req.body.to)
              ? req.body.to
              : Date.now()
        };

        var model = await this.entityService.find({
          _business: access.business._id.toString(),
          _entity: req.params.entity,
          _vdate: { $gt: range.from, $lt: range.to }
        });

        res.setHeader("content-type", "application/zip");

        var zip = archiver("zip", {
          zlib: { level: 9 } // Sets the compression level.
        });

        zip.pipe(res);
        zip.append(JSON.stringify(model), { name: "data.json" });
        zip.finalize();
      }
    ]

*Defined in [src/controllers/EntityController.ts:43](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L43)*

___
<a id="zip.isstream-1"></a>

####  isStream

**● isStream**: *`true`* = true

*Defined in [src/controllers/EntityController.ts:42](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L42)*

___
<a id="zip.method-9"></a>

####  method

**● method**: *`string`* = "post"

*Defined in [src/controllers/EntityController.ts:41](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L41)*

___
<a id="zip.route-9"></a>

####  route

**● route**: *`string`* = "/api/entity/:entity/zip"

*Defined in [src/controllers/EntityController.ts:40](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/EntityController.ts#L40)*

___

___

