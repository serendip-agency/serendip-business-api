// /**
//  * @module Client
//  */
// import { HttpServiceInterface, DbService, Server, HttpService } from "serendip";
// import * as SBC from "serendip-business-client";
// import * as WS from "ws";
// import * as _ from "underscore";
// import { EntityModel } from "serendip-business-model";
// import { MongodbProvider } from "serendip-mongodb-provider";
// import * as fs from "fs-extra";
// import { join } from "path";
// export class ClientService implements HttpServiceInterface {
//   business: SBC.BusinessService;
//   data: SBC.DataService;
//   ws: SBC.WsService;
//   entitySocket: WebSocket;
//   constructor(private httpService: HttpService, private dbService: DbService) {}
//   async start() {
//     try {
//       console.log("trying to start serendip client");
//       if (process.env["serendip.stopped"]) {
//         console.log("\n\t Serendip Client is stopped with env variable. \n");
//         return;
//       }
//       SBC.DbService.configure({
//         defaultProvider: "Mongodb",
//         providers: {
//           Mongodb: {
//             object: new MongodbProvider() as any,
//             options: {
//               mongoDb: process.env["sbc.mongoDb"],
//               mongoUrl: process.env["db.mongoUrl"],
//               authSource: process.env["db.authSource"],
//               user: process.env["db.user"],
//               password: process.env["db.password"]
//             }
//           }
//         }
//       });
//       SBC.WsService.configure({
//         webSocketClass: WS
//       });
//       SBC.AuthService.configure({
//         username: process.env["sbc.username"],
//         password: process.env["sbc.password"]
//       });
//       if (process.env["sbc.server"])
//         SBC.DataService.server = process.env["sbc.server"];
//       SBC.DataService.configure({
//         business: process.env["sbc.business"]
//       });
//       const localStoragePath = join(Server.dir, "..", ".localStorage.json");
//       SBC.LocalStorageService.configure({
//         clear: async () => {
//           try {
//             await fs.unlink(localStoragePath);
//           } catch {}
//           await fs.writeJSON(localStoragePath, {});
//         },
//         load: async () => {
//           if (!(await fs.pathExists(localStoragePath)))
//             await fs.writeJSON(localStoragePath, {});
//           try {
//             return await fs.readJSON(localStoragePath);
//           } catch {
//             await fs.unlink(localStoragePath);
//             return {};
//           }
//         },
//         get: async key => {
//           if (!(await fs.pathExists(localStoragePath)))
//             await fs.writeJSON(localStoragePath, {});
//           try {
//             return (await fs.readJSON(localStoragePath))[key];
//           } catch {
//             await fs.unlink(localStoragePath);
//             return null;
//           }
//         },
//         set: async (key, value) => {
//           let storage = {};
//           try {
//             storage = await fs.readJSON(localStoragePath);
//           } catch (error) {}
//           storage[key] = value;
//           try {
//             await fs.unlink(localStoragePath);
//           } catch {}
//           await fs.writeJSON(localStoragePath, storage);
//         },
//         remove: async key => {
//           const storage = await fs.readJSON(localStoragePath);
//           delete storage[key];
//           try {
//             await fs.unlink(localStoragePath);
//           } catch {}
//           await fs.writeJSON(localStoragePath, storage);
//         },
//         save: async storage => {
//           try {
//             await fs.unlink(localStoragePath);
//           } catch {}
//           await fs.writeJSON(localStoragePath, storage);
//         }
//       });
//       await SBC.Client.bootstrap({
//         services: [
//           SBC.DbService,
//           SBC.DataService,
//           SBC.BusinessService,
//           SBC.AuthService,
//           SBC.HttpClientService,
//           SBC.LocalStorageService,
//           SBC.WsService
//         ],
//         logging: "info"
//       });
//       console.log("\n\tSerendip client service started!\n");
//       this.data = SBC.Client.services["DataService"];
//       this.business = SBC.Client.services["BusinessService"];
//       this.ws = SBC.Client.services["WsService"];
//       // console.log("sync start at " + new Date());
//       // this.data
//       //   .sync()
//       //   .then(() => {
//       //     console.log("sync done at " + new Date());
//       //   })
//       //   .catch(e => {
//       //     console.error("sync error at " + new Date(), e);
//       //   });
//       if (this.data && process.env["sbc.business"])
//         for (const collectionName of [
//           "Users",
//           "Tokens",
//           "Businesses",
//           "Clients",
//           "AuthCodes"
//         ]) {
//           if (collectionName != "EntityChanges")
//             if (collectionName[0] === collectionName[0].toUpperCase()) {
//               const collection = await this.dbService.collection(
//                 collectionName,
//                 false
//               );
//               var neverPushedToSerendip: any[] = await collection.find({
//                 _business: { $ne: process.env["sbc.business"] }
//               });
//               for (const item of neverPushedToSerendip) {
//                 console.log(
//                   `pushing ${collectionName} >  ${item._entity} #${item._id}`,
//                   item
//                 );
//                 await collection.updateOne(
//                   await this.data.update(collectionName, item)
//                 );
//               }
//               const eventStream = this.dbService.events()[collectionName];
//               eventStream.on("insert", doc => {
//                 if (doc._fromSocket) return;
//                 doc._fromCode = true;
//                 this.data
//                   .insert(collectionName, doc)
//                   .then(() => console.log(`${doc._id} insert synced`))
//                   .catch(e => console.log(`${doc._id} insert sync error`, e));
//               });
//               eventStream.on("update", doc => {
//                 if (doc._fromSocket) return;
//                 doc._fromCode = true;
//                 this.data
//                   .update(collectionName, doc)
//                   .then(() => console.log(`${doc._id} update synced`))
//                   .catch(e => console.log(`${doc._id} update sync error`, e));
//               });
//               eventStream.on("delete", doc => {
//                 if (doc._fromSocket) return;
//                 doc._fromCode = true;
//                 this.data
//                   .delete(collectionName, doc._id)
//                   .then(() => console.log(`${doc._id} delete synced`))
//                   .catch(e => console.log(`${doc._id} delete sync error`, e));
//               });
//             }
//         }
//       this.initEntitySocket()
//         .then(() => {})
//         .catch(e => {
//           console.error("entity socket error", e);
//         });
//     } catch (error) {
//       console.error("error starting client service", error);
//     }
//   }
//   async initEntitySocket() {
//     this.entitySocket = await this.ws.newSocket("/entity", true);
//     console.log("SBC socket connected!");
//     this.entitySocket.onclose = () => {
//       this.initEntitySocket();
//     };
//     this.entitySocket.onmessage = async msg => {
//       let data: {
//         event: "update" | "delete" | "insert";
//         model: EntityModel;
//       };
//       try {
//         data = JSON.parse(msg.data);
//       } catch (error) {}
//       if (data && data.model && !data.model._fromCode) {
//         console.log("message from socket", data.event, data.model);
//         const collection = await this.dbService.collection(
//           data.model._entity,
//           true
//         );
//         // prevent infinite loop
//         data.model._fromSocket = true;
//         if (data.event == "delete") {
//           await collection.deleteOne(data.model._id);
//         }
//         if (data.event == "update") {
//           await collection.updateOne(data.model);
//         }
//         if (data.event == "insert") {
//           await collection.insertOne(data.model);
//         }
//       }
//       // if (data.model) {
//       //   data.model = this.data.decrypt(data.model);
//       // }
//     };
//   }
// }
