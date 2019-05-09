[Serendip Business API](../README.md) > [Business](../modules/business.md) > [BusinessController](../classes/business.businesscontroller.md)

# Class: BusinessController

## Hierarchy

**BusinessController**

## Index

### Constructors

* [constructor](business.businesscontroller.md#constructor)

### Object literals

* [addMember](business.businesscontroller.md#addmember)
* [deleteMember](business.businesscontroller.md#deletemember)
* [grid](business.businesscontroller.md#grid)
* [list](business.businesscontroller.md#list)
* [saveBusiness](business.businesscontroller.md#savebusiness)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new BusinessController**(businessService: *[BusinessService](business.businessservice.md)*, authService: *`AuthService`*, profileService: *[ProfileService](profile.profileservice.md)*, entityService: *[EntityService](entity.entityservice.md)*): [BusinessController](business.businesscontroller.md)

*Defined in [src/controllers/BusinessController.ts:19](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/BusinessController.ts#L19)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| businessService | [BusinessService](business.businessservice.md) |
| authService | `AuthService` |
| profileService | [ProfileService](profile.profileservice.md) |
| entityService | [EntityService](entity.entityservice.md) |

**Returns:** [BusinessController](business.businesscontroller.md)

___

## Object literals

<a id="addmember"></a>

###  addMember

**addMember**: *`object`*

*Defined in [src/controllers/BusinessController.ts:166](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/BusinessController.ts#L166)*

<a id="addmember.actions"></a>

####  actions

**● actions**: *`(Anonymous function)`[]* =  [
      BusinessService.checkUserAccess,
      async (
        req,
        res,
        next,
        done,
        model: BusinessCheckAccessResultInterface
      ) => {
        if (!req.body.mobile || !parseInt(req.body.mobile)) {
          return next(new HttpError(400, "enter mobile"));
        }

        let toAdd = {
          mobile: parseInt(req.body.mobile).toString(),
          mobileCountryCode: req.body.mobileCountryCode || "+98"
        };

        var user = await this.authService.findUserByMobile(
          toAdd.mobile,
          toAdd.mobileCountryCode
        );

        if (user) {
          const userBusinesses = await this.businessService.findBusinessesByUserId(
            user._id.toString()
          );

          if (
            userBusinesses.filter(
              b => b._id.toString() == model.business._id.toString()
            ).length != 0
          ) {
            return next(new HttpError(400, "duplicate"));
          }
        }

        model.business.members.push(toAdd as any);

        try {
          await this.businessService.update(model.business);
        } catch (e) {
          return next(new HttpError(500, e.message));
        }

        res.json(model.business);
      }
    ]

*Defined in [src/controllers/BusinessController.ts:168](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/BusinessController.ts#L168)*

___
<a id="addmember.method"></a>

####  method

**● method**: *`string`* = "post"

*Defined in [src/controllers/BusinessController.ts:167](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/BusinessController.ts#L167)*

___

___
<a id="deletemember"></a>

###  deleteMember

**deleteMember**: *`object`*

*Defined in [src/controllers/BusinessController.ts:133](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/BusinessController.ts#L133)*

<a id="deletemember.actions-1"></a>

####  actions

**● actions**: *`(Anonymous function)`[]* =  [
      BusinessService.checkUserAccess,
      async (
        req,
        res,
        next,
        done,
        model: BusinessCheckAccessResultInterface
      ) => {
        var userId = req.body.userId;

        if (!userId) return next(new HttpError(400, "userId field missing"));

        model.business.members = _.reject(
          model.business.members,
          (item: BusinessMemberModel) => {
            return item.userId == userId;
          }
        );

        try {
          await this.businessService.update(model.business);
        } catch (e) {
          return next(new HttpError(500, e.message));
        }

        res.json(model.business);
      }
    ]

*Defined in [src/controllers/BusinessController.ts:135](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/BusinessController.ts#L135)*

___
<a id="deletemember.method-1"></a>

####  method

**● method**: *`string`* = "post"

*Defined in [src/controllers/BusinessController.ts:134](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/BusinessController.ts#L134)*

___

___
<a id="grid"></a>

###  grid

**grid**: *`object`*

*Defined in [src/controllers/BusinessController.ts:75](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/BusinessController.ts#L75)*

<a id="grid.actions-2"></a>

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
        var query = (await this.entityService.collection.find({
          _entity: "grid",
          _business: access.business._id.toString(),
          _cuser: access.member.userId.toString(),
          "data.section": req.body.section
        })).sort((a, b) => {
          return b._cdate - a._cdate;
        });

        if (query[0]) {
          res.json(query[0].data);
        } else done(400, "no grid found");
      }
    ]

*Defined in [src/controllers/BusinessController.ts:77](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/BusinessController.ts#L77)*

___
<a id="grid.method-2"></a>

####  method

**● method**: *`string`* = "post"

*Defined in [src/controllers/BusinessController.ts:76](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/BusinessController.ts#L76)*

___

___
<a id="list"></a>

###  list

**list**: *`object`*

*Defined in [src/controllers/BusinessController.ts:27](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/BusinessController.ts#L27)*

<a id="list.actions-3"></a>

####  actions

**● actions**: *`(Anonymous function)`[]* =  [
      async (req, res, next, done) => {
        var model = await this.businessService.findBusinessesByUserId(
          req.user._id.toString()
        );

        for (let i = 0; i < model.length; i++) {
          let business = model[i];
          for (let mi = 0; mi < business.members.length; mi++) {
            let member = business.members[mi];
            let queryUser;

            if (!member.userId && member.mobile) {
              queryUser = await this.authService.findUserByMobile(
                member.mobile,
                member.mobileCountryCode
              );

              if (queryUser) {
                member.userId = queryUser._id.toString();
                await this.businessService.update(business);
              }
            }

            if (member.userId && !queryUser)
              queryUser = await this.authService.findUserById(member.userId);

            if (!member.mobile && queryUser) {
              member.mobile = queryUser.mobile;
              member.mobileCountryCode = queryUser.mobileCountryCode;
            }

            member.profile = await this.profileService.findProfileByUserId(
              member.userId
            );

            business.members[mi] = member;
          }
          model[i] = business;
        }

        res.json(model);
      }
    ]

*Defined in [src/controllers/BusinessController.ts:29](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/BusinessController.ts#L29)*

___
<a id="list.method-3"></a>

####  method

**● method**: *`string`* = "get"

*Defined in [src/controllers/BusinessController.ts:28](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/BusinessController.ts#L28)*

___

___
<a id="savebusiness"></a>

###  saveBusiness

**saveBusiness**: *`object`*

*Defined in [src/controllers/BusinessController.ts:101](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/BusinessController.ts#L101)*

<a id="savebusiness.actions-4"></a>

####  actions

**● actions**: *`(Anonymous function)`[]* =  [
      async (req, res, next, done) => {
        var model: BusinessModel = req.body;

        model.owner = req.user._id.toString();

        if (!model.members) model.members = [];

        if (_.where(model.members, { userId: model.owner }).length == 0)
          model.members.push({
            mails: [],
            userId: model.owner,
            groups: [],
            scope: []
          });
        try {
          await BusinessModel.validate(model);
        } catch (e) {
          return next(new HttpError(400, e.message));
        }

        if (model._id) {
          await this.businessService.update(model);
        } else model = await this.businessService.insert(model);

        res.json(model);
      }
    ]

*Defined in [src/controllers/BusinessController.ts:103](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/BusinessController.ts#L103)*

___
<a id="savebusiness.method-4"></a>

####  method

**● method**: *`string`* = "post"

*Defined in [src/controllers/BusinessController.ts:102](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/BusinessController.ts#L102)*

___

___

