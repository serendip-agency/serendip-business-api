[Serendip Business API](../README.md) > [Storage](../modules/storage.md) > [StorageController](../classes/storage.storagecontroller.md)

# Class: StorageController

## Hierarchy

**StorageController**

## Index

### Constructors

* [constructor](storage.storagecontroller.md#constructor)

### Methods

* [onRequest](storage.storagecontroller.md#onrequest)

### Object literals

* [assemble](storage.storagecontroller.md#assemble)
* [list](storage.storagecontroller.md#list)
* [newFolder](storage.storagecontroller.md#newfolder)
* [parts](storage.storagecontroller.md#parts)
* [preview](storage.storagecontroller.md#preview)
* [public](storage.storagecontroller.md#public)
* [test](storage.storagecontroller.md#test)
* [upload](storage.storagecontroller.md#upload)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new StorageController**(dbService: *`DbService`*, storageService: *[StorageService](storage.storageservice.md)*): [StorageController](storage.storagecontroller.md)

*Defined in [src/controllers/StorageController.ts:26](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L26)*

**Parameters:**

| Name | Type |
| ------ | ------ |
| dbService | `DbService` |
| storageService | [StorageService](storage.storageservice.md) |

**Returns:** [StorageController](storage.storagecontroller.md)

___

## Methods

<a id="onrequest"></a>

###  onRequest

▸ **onRequest**(req: *`HttpRequestInterface`*, res: *`HttpResponseInterface`*, next: *`any`*, done: *`any`*): `Promise`<`void`>

*Defined in [src/controllers/StorageController.ts:32](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L32)*

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

<a id="assemble"></a>

###  assemble

**assemble**: *`object`*

*Defined in [src/controllers/StorageController.ts:439](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L439)*

<a id="assemble.actions"></a>

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
        var command: StorageCommandInterface = req.body;

        if (!command) return done(400);
        if (!command.path) return done(400);
        if (!command.path.startsWith('/'))
          command.path = '/' + command.path;

        if (
          !(await this.storageService.userHasAccessToPath(
            req.user._id.toString(),
            command.path
          ))
        )
          return done(400);

        await this.storageService.assemblePartsIfPossible(
          join(this.storageService.dataPath, command.path),
          req.user._id
        );

        done();
      }
    ]

*Defined in [src/controllers/StorageController.ts:441](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L441)*

___
<a id="assemble.method"></a>

####  method

**● method**: *`string`* = "POST"

*Defined in [src/controllers/StorageController.ts:440](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L440)*

___

___
<a id="list"></a>

###  list

**list**: *`object`*

*Defined in [src/controllers/StorageController.ts:372](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L372)*

<a id="list.actions-1"></a>

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
        var command: StorageCommandInterface = req.body;

        if (!command) return done(400);
        if (!command.path) return done(400);
        if (!command.path.startsWith('/'))
          command.path = '/' + command.path;

        if (!command.path.endsWith('/'))
          command.path += '/';

        if (
          !(await this.storageService.userHasAccessToPath(
            req.user._id.toString(),
            command.path
          ))
        )
          return done(400);

        const filesCollection = await this.dbService.collection('fs.files', false);

        let model = await filesCollection.find({
          $or: [{
            filename: {
              $regex: `^${command.path.replace(/\//g, '\/')}[^/]{0,}$`
            }
          }, {
            filename: {

              $regex: `^${command.path.replace(/\//g, '\/')}[^/]{0,}\/.keep$`
            }

          }]
        })

        model = model.filter((p: any) => command.path + '.keep' != p.filename).map((p: any) => {

          return {
            isFile: !p.filename.endsWith('/.keep'),
            isDirectory: p.filename.endsWith('/.keep'),
            path: p.filename,
            basename: basename(p.filename.replace('/.keep', '')),
            mime: mime.lookup(p.filename),
            size: p.length,
            ext: p.filename.split(".")
              .reverse()[0]
              .toLowerCase(),
            sizeInMB: parseFloat((p.length / 1024 / 1024).toFixed(2))
          }
        });
        res.json(model);
        // res.json(await this.storageService.list(command.path));
      }
    ]

*Defined in [src/controllers/StorageController.ts:374](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L374)*

___
<a id="list.method-1"></a>

####  method

**● method**: *`string`* = "POST"

*Defined in [src/controllers/StorageController.ts:373](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L373)*

___

___
<a id="newfolder"></a>

###  newFolder

**newFolder**: *`object`*

*Defined in [src/controllers/StorageController.ts:92](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L92)*

<a id="newfolder.actions-2"></a>

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
        var command: StorageCommandInterface = req.body;

        if (!command) return done(400);
        if (!command.path) return done(400);
        if (!command.path.startsWith('/'))
          command.path = '/' + command.path;

        if (
          !(await this.storageService.userHasAccessToPath(
            req.user._id.toString(),
            command.path
          ))
        )
          return done(400);

        await this.dbService.openUploadStreamByFilePath(command.path + '/.keep', {}).then((stream) => {

          stream.write('');
          stream.end();

          stream.on('finish', () => {

            done(200);
          })

        });

      }
    ]

*Defined in [src/controllers/StorageController.ts:94](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L94)*

___
<a id="newfolder.method-2"></a>

####  method

**● method**: *`string`* = "POST"

*Defined in [src/controllers/StorageController.ts:93](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L93)*

___

___
<a id="parts"></a>

###  parts

**parts**: *`object`*

*Defined in [src/controllers/StorageController.ts:311](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L311)*

<a id="parts.actions-3"></a>

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
        var command: StorageCommandInterface = req.body;

        if (!command) return done(400);
        if (!command.path) return done(400);
        if (!command.path.startsWith('/'))
          command.path = '/' + command.path;

        if (
          !(await this.storageService.userHasAccessToPath(
            req.user._id.toString(),
            command.path
          ))
        )
          return done(400);

        var model = await this.storageService.getFilePartsInfo(
          join(this.storageService.dataPath, command.path)
        );

        var exists: { start: number; end: number }[] = [];
        var missing: { start: number; end: number }[] = [];

        model.forEach(item => {
          console.log(item.start, item.end, exists, missing);

          if (!exists[0]) exists.push({ start: item.start, end: item.end });
          else {
            if (missing[0]) {
              if (missing[0].end == item.start) {
                exists.unshift({ start: item.start, end: item.end });
                return;
              }
            }

            if (exists[0].end == item.start) exists[0].end = item.end;
            else {
              missing.unshift({ start: exists[0].end, end: item.start });
              exists.unshift({ start: item.start, end: item.end });
            }
          }
        });

        res.json({
          exists,
          missing
        });
      }
    ]

*Defined in [src/controllers/StorageController.ts:313](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L313)*

___
<a id="parts.method-3"></a>

####  method

**● method**: *`string`* = "POST"

*Defined in [src/controllers/StorageController.ts:312](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L312)*

___

___
<a id="preview"></a>

###  preview

**preview**: *`object`*

*Defined in [src/controllers/StorageController.ts:213](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L213)*

<a id="preview.actions-4"></a>

####  actions

**● actions**: *`(Anonymous function)`[]* =  [
      async (
        req,
        res,
        next,
        done,
      ) => {

        let filePath: string;

        if (typeof req.params.path !== 'string')
          filePath = req.params.path.join('/');
        else
          filePath = req.params.path;

        if (!filePath.startsWith('/'))
          filePath = '/' + filePath;

        if (filePath.split('/')[3] != 'public' &&
          !(await this.storageService.userHasAccessToPath(
            req.user._id.toString(),
            filePath
          ))
        )
          return done(403);

        const filesCollection = await this.dbService.collection<any>('fs.files', false);

        const fileQuery = await filesCollection.find({ filename: filePath })

        if (!fileQuery[0])
          return done(404);

        res.setHeader('Content-Type', mime.lookup(filePath))

        let range: any = (req.headers.range) ? req.headers.range.toString().replace(/bytes=/, "").split("-") : [];

        range[0] = range[0] ? parseInt(range[0], 10) : 0;
        range[1] = range[1] ? (parseInt(range[1], 10) || 0) : range[0] + ((1024 * 1024) - 1);

        if (range[1] >= fileQuery[0].length) {
          range[1] = fileQuery[0].length - 1;
        }

        range = { start: range[0], end: range[1] };

        if (!req.headers.range) {

          await this.dbService.openDownloadStreamByFilePath(filePath).then((stream) => {

            res.writeHead(200, {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': 0,
              'Content-Disposition': `inline; filename=${encodeURIComponent(fileQuery[0].filename.split('/')[fileQuery[0].filename.split('/').length - 1])}`,
              'Content-Type': mime.lookup(filePath),
              'Content-Length': fileQuery[0].length,
            });
            stream.pipe(res);
          });

        } else {

          await this.dbService.openDownloadStreamByFilePath(filePath, {
            start: range.start,
            end: range.end
          }).then((stream) => {

            res.writeHead(206, {
              'Cache-Control': 'no-cache, no-store, must-revalidate',
              'Pragma': 'no-cache',
              'Expires': 0,
              'Content-Type': mime.lookup(filePath),
              'Content-Disposition': `inline; filename=${encodeURIComponent(fileQuery[0].filename.split('/')[fileQuery[0].filename.split('/').length - 1])}`,
              'Accept-Ranges': 'bytes',
              'Content-Range': 'bytes ' + range.start + '-' + range.end + '/' + (fileQuery[0].length),
              'Content-Length': range.end - range.start + 1,
            });

            stream.pipe(res);

          });
        }

      }
    ]

*Defined in [src/controllers/StorageController.ts:217](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L217)*

___
<a id="preview.isstream"></a>

####  isStream

**● isStream**: *`true`* = true

*Defined in [src/controllers/StorageController.ts:215](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L215)*

___
<a id="preview.method-4"></a>

####  method

**● method**: *`string`* = "GET"

*Defined in [src/controllers/StorageController.ts:214](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L214)*

___
<a id="preview.publicaccess"></a>

####  publicAccess

**● publicAccess**: *`false`* = false

*Defined in [src/controllers/StorageController.ts:215](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L215)*

___
<a id="preview.route"></a>

####  route

**● route**: *`string`* = "api/storage/preview/:path*"

*Defined in [src/controllers/StorageController.ts:216](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L216)*

___

___
<a id="public"></a>

###  public

**public**: *`object`*

*Defined in [src/controllers/StorageController.ts:187](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L187)*

<a id="public.actions-5"></a>

####  actions

**● actions**: *`(Anonymous function)`[]* =  [
      async (
        req,
        res,
        next,
        done,
      ) => {

        req.params.path = '/' + ([...req.params.first, ...['public'], ...req.params.last].join('/'));

        // return res.json(req.params.path);

        const filesCollection = await this.dbService.collection<any>('fs.files', false);

        const dirQuery = await filesCollection.find({ $or: [{ filename: req.params.path + '/.keep' }] });

        return this.preview.actions[0](req, res, next, done);
      }]

*Defined in [src/controllers/StorageController.ts:192](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L192)*

___
<a id="public.isstream-1"></a>

####  isStream

**● isStream**: *`true`* = true

*Defined in [src/controllers/StorageController.ts:190](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L190)*

___
<a id="public.method-5"></a>

####  method

**● method**: *`string`* = "GET"

*Defined in [src/controllers/StorageController.ts:188](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L188)*

___
<a id="public.publicaccess-1"></a>

####  publicAccess

**● publicAccess**: *`true`* = true

*Defined in [src/controllers/StorageController.ts:189](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L189)*

___
<a id="public.route-1"></a>

####  route

**● route**: *`string`* = "dl/:first*/public/:last*"

*Defined in [src/controllers/StorageController.ts:191](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L191)*

___

___
<a id="test"></a>

###  test

**test**: *`object`*

*Defined in [src/controllers/StorageController.ts:43](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L43)*

<a id="test.actions-6"></a>

####  actions

**● actions**: *`(Anonymous function)`[]* =  [
      async (
        req,
        res,
        next,
        done,
        access: BusinessCheckAccessResultInterface
      ) => {

        const data = 'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiA/PjwhRE9DVFlQRSBzdmcgIFBVQkxJQyAnLS8vVzNDLy9EVEQgU1ZHIDEuMS8vRU4nICAnaHR0cDovL3d3dy53My5vcmcvR3JhcGhpY3MvU1ZHLzEuMS9EVEQvc3ZnMTEuZHRkJz48c3ZnIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDUwIDUwIiBoZWlnaHQ9IjUwcHgiIGlkPSJMYXllcl8xIiB2ZXJzaW9uPSIxLjEiIHZpZXdCb3g9IjAgMCA1MCA1MCIgd2lkdGg9IjUwcHgiIHhtbDpzcGFjZT0icHJlc2VydmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPjxyZWN0IGZpbGw9Im5vbmUiIGhlaWdodD0iNTAiIHdpZHRoPSI1MCIvPjxwYXRoIGQ9Ik0zNC4zOTcsMjlMMjAsNDhMNS42MDQsMjkgIEgxNUMxNSwwLDQ0LDEsNDQsMVMyNSwyLjM3MywyNSwyOUgzNC4zOTd6IiBmaWxsPSJub25lIiBzdHJva2U9IiMwMDAwMDAiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLW1pdGVybGltaXQ9IjEwIiBzdHJva2Utd2lkdGg9IjIiLz48L3N2Zz4=';

        const binaryString = Buffer.from(data, 'base64');

        // res.setHeader('Content-Type', 'application-octet-stream');
        // res.setHeader('Content-disposition', 'attachment; filename=test.svg');

        res.write(binaryString, 'binary', () => {
          res.end();
        });

        // const write = (data) => {
        //   return new Promise((resolve, reject) => {
        //     if (!res.write(data, 'base64', () => resolve()))
        //       resolve();
        //   });
        // }

        // for (const c of data.split(',')[1]) {
        //   console.log(c);
        //   await write(c);
        // }

        // res.end();

        // res.write(data.split(',')[1], 'binary', () => {
        //   res.end();
        // })

      }
    ]

*Defined in [src/controllers/StorageController.ts:46](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L46)*

___
<a id="test.method-6"></a>

####  method

**● method**: *`string`* = "get"

*Defined in [src/controllers/StorageController.ts:44](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L44)*

___
<a id="test.publicaccess-2"></a>

####  publicAccess

**● publicAccess**: *`true`* = true

*Defined in [src/controllers/StorageController.ts:45](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L45)*

___

___
<a id="upload"></a>

###  upload

**upload**: *`object`*

*Defined in [src/controllers/StorageController.ts:136](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L136)*

<a id="upload.actions-7"></a>

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
        var command: StorageCommandInterface = req.body;

        if (!command) return done(400);
        if (!command.path) return done(400);
        if (!command.path.startsWith('/'))
          command.path = '/' + command.path;

        if (
          !(await this.storageService.userHasAccessToPath(
            req.user._id.toString(),
            command.path
          ))
        )
          return done(400);

        await fs.ensureFile(join(this.storageService.dataPath, command.path));

        if (!command.total) {
          // await this.storageService.writeBase64AsFile(
          //   command.data,
          //   command.path
          // );
          done();
        } else {
          await this.storageService.checkPartsBeforeUpload(command);

          await fs.writeFile(
            join(this.storageService.dataPath, command.path) +
            `.${command.start || "0"}-${command.end || "0"}-${
            command.total
            }.part`,
            command.data,
            { encoding: 'hex' }
          );

          done();
        }
      }
    ]

*Defined in [src/controllers/StorageController.ts:138](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L138)*

___
<a id="upload.method-7"></a>

####  method

**● method**: *`string`* = "POST"

*Defined in [src/controllers/StorageController.ts:137](https://github.com/serendip-agency/serendip-business-api/blob/069e2af/src/controllers/StorageController.ts#L137)*

___

___

