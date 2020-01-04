["idb"].forEach(lib =>
  importScripts(location.origin + "/workers/lib/" + lib + ".js")
);
const dbs = {
  SYNC: () =>
    idb.openDB("SYNC", 1, {
      upgrade(db) {
        db.createObjectStore("pull");
        db.createObjectStore("push");
      }
    }),
  DATA: () =>
    idb.openDB("DATA", 1, {
      upgrade(db) {
        db.createObjectStore("collections");
      }
    }),
  CACHE: () =>
    idb.openDB("CACHE", 1, {
      upgrade(db) {
        db.createObjectStore("cache");
      }
    })
};

const methods = {
  list: function(opts) {
    return dbs[opts.dbName]().then(db => {
      const tx = db.transaction(opts.storeName);
      const records = [];
      const oStore = tx.objectStore(opts.storeName);

      let recordSkipped = 0;

      // This would be this.store.getAllKeys(), but it isn't supported by Edge or Safari.
      // openKeyCursor isn't supported by Safari, so we fall back

      oStore.iterateCursor(cursor => {
        if (!cursor) {
          return;
        }

        if (!opts.skip || recordSkipped >= opts.skip) {
          records.push(cursor.value);
        } else {
          recordSkipped++;
        }

        if (opts.limit) {
          if (records.length === opts.limit) {
            return;
          }
        }

        cursor.continue();
      });

      return tx.complete.then(() => {
        return records;
      });
    });
  },
  setAll: function(opts) {
    return dbs[opts.dbName]().then(db => {
      const tx = db.transaction(opts.storeName, "readwrite");
      return Promise.all(
        opts.data.map(item =>
          tx.objectStore(opts.storeName).put(item.val, item.key)
        )
      );
    });
  },
  keys: function(opts) {
    return dbs[opts.dbName]().then(db => {
      const tx = db.transaction(opts.storeName);
      const keys = [];

      return tx.objectStore(opts.storeName).getAllKeys();
    });
  },

  get: function(opts) {
    return dbs[opts.dbName]().then(db => {
      return db
        .transaction(opts.storeName)
        .objectStore(opts.storeName)
        .get(opts.key);
    });
  },

  getAll: function(opts) {
    return dbs[opts.dbName]().then(db => {
      return db
        .transaction(opts.storeName)
        .objectStore(opts.storeName)
        .getAll();
    });
  },

  count: function(opts) {
    return dbs[opts.dbName]().then(db => {
      return db
        .transaction(opts.storeName)
        .objectStore(opts.storeName)
        .count();
    });
  },

  set: function(opts) {
    return dbs[opts.dbName]().then(db => {
      const tx = db.transaction(opts.storeName, "readwrite");
      return tx.objectStore(opts.storeName).put(opts.val, opts.key);
      //  return tx.complete;
    });
  },

  clear: function(opts) {
    return dbs[opts.dbName]().then(db => {
      const tx = db.transaction(opts.storeName, "readwrite");
      tx.objectStore(opts.storeName).clear();
      return tx.complete;
    });
  },

  delete: function(opts) {
    return dbs[opts.dbName]().then(db => {
      const tx = db.transaction(opts.storeName, "readwrite");
      tx.objectStore(opts.storeName).delete(opts.key);
      return tx.complete;
    });
  }
};

self.module = {
  exports: function(input, send) {
   
    methods[input.method](input.options)
      .then(result => {
        send({
          pid: input.pid,
          method: input.method,
          options: input.options,
          model: result
        });
      })
      .catch(error => {
        console.error(error, input);
        send({
          pid: input.pid,
          method: input.method,
          options: input.options,
          error: JSON.parse(JSON.stringify(error))
        });
      });
  }
};
