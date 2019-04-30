
[![MIT Licence](https://badges.frapsoft.com/os/mit/mit.svg?v=103)](https://opensource.org/licenses/mit-license.php)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg)](https://GitHub.com/m-esm/serendip/graphs/commit-activity)
[![Website shields.io](https://img.shields.io/website-up-down-green-red/http/shields.io.svg)](https://serendip.agency/)
![Open Source Love](https://badges.frapsoft.com/os/v1/open-source.png?v=103)
![TypeScript](https://badges.frapsoft.com/typescript/love/typescript.svg?v=101)


![SF](https://raw.githubusercontent.com/serendip-agency/serendip-business-API/master/readme_icon.png " ")

## Serendip Business API
It's the source code of our main business API. this web API is built on [Serendip framework](https://github.com/serendip-agency/serendip-framework) and is responsible for
* Authorization and authentication of serendip users both SaaS and on-premises using serendip-framework authentication
* Handling document entity INSERT/UPDATE/DELETE/QUERY operations. 
* Storing differentiate of document versions using serendip-framework json-patch.
* Handling upload and download streams to GridFs ( through [mongodb-provider](https://npmjs.com/package/serendip-mongodb-provider) or [griddb-provider](https://npmjs.com/package/serendip-griddb-provider) ) [*this will be moved to separate micro-service]
* Handling business(team) authorization & management on BusinessService and BusinessController

 This web API provides data for other micro-services which are connected to the same database grid as this web API is. these include our input/output and trigger services, such as:
 * [telegram agent](https://github.com/serendip-agency/serendip-telegram-agent)
 * [website backend]( https://github.com/serendip-agency/serendip-web ) ( [serendip.agency](https://serendip.agency) runs on this )
 * [sms agent](https://github.com/serendip-agency/serendip-sms-agent)
 * [mail agent](https://github.com/serendip-agency/serendip-mail-agent)

### Client
We have built a [client package](https://github.com/serendip-agency/serendip-business-client), which is configured to work with our API on http and websocket protocol.
it will easily authenticate you with our API and it will let you:
* use our real-time event system through web socket
* use our file streams as input and output to your system. ( fs in the cloud )
* sync your data encrypted and browse them or get analytics from them on our dashboard [serendip.cloud](https://serendip.cloud)
* access to our event/trigger system ( using our dashboard ) that trigger sms/email/fax/push/http_request based on insert/delete/update events on your that in real-time. 

### Authentication
authenticating with this API is possible with any http client for [password grant type](https://www.oauth.com/oauth2-servers/access-tokens/password-grant/) or our [SSO(single sign-on)](https://github.com/serendip-agency/serendip-sso) for [authorization_code grant type](https://www.oauth.com/oauth2-servers/access-tokens/authorization-code-request/) which needs your client and it's redirect URL defined and approved in your business setting on serendip.

### Usage Notes
 This Web API is accessible in domains below and you need account and business created to access routes
 * [business.serendip.cloud](http://business.serendip.cloud)
 * [business.serendip.ir](http://business.serendip.ir)
 
| Request Method | URL Path | Controller > Endpoint |
| - | - | - |
| [POST] | /api/auth/register | AuthController > register | 
| [POST] | /api/auth/sendresetpasswordtoken | AuthController > sendResetPasswordToken | 
| [POST] | /api/auth/addusertogroup | AuthController > addUserToGroup | 
| [POST] | /api/auth/deleteuserfromgroup | AuthController > deleteUserFromGroup | 
| [POST] | /api/auth/changepassword | AuthController > changePassword | 
| [POST] | /api/auth/resetpassword | AuthController > resetPassword | 
| [POST] | /api/auth/sendverifyemail | AuthController > sendVerifyEmail | 
| [POST] | /api/auth/sendverifysms | AuthController > sendVerifySms | 
| [POST] | /api/auth/verifymobile | AuthController > verifyMobile | 
| [POST] | /api/auth/verifyemail | AuthController > verifyEmail | 
| [POST] | /api/auth/clienttoken | AuthController > clientToken | 
| [POST] | /api/auth/refreshtoken | AuthController > refreshToken | 
| [GET] | /api/auth/sessions | AuthController > sessions
| [POST] | /api/auth/checktoken | AuthController > checkToken | 
| [POST] | /api/auth/onetimepassword | AuthController > oneTimePassword | 
| [POST] | /api/auth/newauthcode | AuthController > newAuthCode | 
| [POST] | /api/auth/token | AuthController > token
| [GET] | /api/server/cluster-testing | ServerController > clusterTesting | 
| [GET] | /api/server/cluster-workers | ServerController > clusterWorkers | 
| [GET] | /api/server/routes | ServerController > routes
| [GET] | /api/server/throw | ServerController > throw
| [GET] | /api/server/nexterror | ServerController > nextError | 
| [GET] | /api/server/doneerror | ServerController > doneError | 
| [GET] | /api/server/services | ServerController > services | 
| [GET] | /api/business/list | BusinessController > list
| [POST] | /api/business/grid | BusinessController > grid | 
| [POST] | /api/business/savebusiness | BusinessController > saveBusiness | 
| [POST] | /api/business/deletemember | BusinessController > deleteMember | 
| [POST] | /api/business/addmember | BusinessController > addMember | 
| [POST] | /api/entity/:entity/zip | EntityController > zip | 
| [POST] | /api/entity/export | EntityController > export | 
| [POST] | /api/entity/:entity/details | EntityController > details | 
| [POST] | /api/entity/changes | EntityController > changes | 
| [POST] | /api/entity/:entity/list | EntityController > list | 
| [POST] | /api/entity/:entity/count | EntityController > count | 
| [POST] | /api/entity/:entity/search | EntityController > search | 
| [POST] | /api/entity/:entity/insert | EntityController > insert | 
| [POST] | /api/entity/:entity/update | EntityController > update | 
| [POST] | /api/entity/:entity/delete | EntityController > delete | 
| [GET] | /api/server/cluster-testing | ServerController > clusterTesting | 
| [GET] | /api/server/cluster-workers | ServerController > clusterWorkers | 
| [GET] | /api/server/routes | ServerController > routes
| [GET] | /api/server/throw | ServerController > throw
| [GET] | /api/server/nexterror | ServerController > nextError | 
| [GET] | /api/server/doneerror | ServerController > doneError | 
| [GET] | /api/server/services | ServerController > services | 
| [GET] | /api/storage/test | StorageController > test
| [POST] | /api/storage/newfolder | StorageController > newFolder | 
| [POST] | /api/storage/upload | StorageController > upload | 
| [GET] | /dl/:first*/public/:last* | StorageController > public | 
| [GET] | /api/storage/preview/:path* | StorageController > preview | 
| [POST] | /api/storage/parts | StorageController > parts | 
| [POST] | /api/storage/list | StorageController > list
| [POST] | /api/storage/assemble | StorageController > assemble | 

### API Documentation
coming soon ...

### Code Documentation
This documents are auto generated from typescript source using [typedoc](https://github.com/TypeStrong/typedoc)
* [Auth](modules/auth.md)
* [Business](modules/business.md)
* [Client](modules/client.md)
* [Dashboard](modules/dashboard.md)
* [Db](modules/db.md)
* [Entity](modules/entity.md)
* [Profile](modules/profile.md)
* [Server](modules/server.md)
* [Storage](modules/storage.md)

### Contribution
 We would love for you to contribute to Serendip and help making it better!  

### Related
* [serendip-grridb-provider](https://github.com/serendip-agency/serendip-grridb-provider)
* [serendip-grridb-node](https://github.com/serendip-agency/serendip-grridb-node)
* [serendip-grridb-controller](https://github.com/serendip-agency/serendip-grridb-controller)
* [serendip-mongodb-controller](https://github.com/serendip-agency/serendip-mongodb-controller)
* [serendip-business-model](https://github.com/serendip-agency/serendip-business-model)
* [serendip-utility](https://github.com/serendip-agency/utility)


![_](https://serendip.agency/assets/svg/serendip-architecture.svg "serendip architecture")
 


 

