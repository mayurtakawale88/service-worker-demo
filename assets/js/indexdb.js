(function() {
    'use strict';
    self.indexedDB = self.indexedDB || self.mozIndexedDB || self.webkitIndexedDB || self.msIndexedDB;
    //check for support
    if (!self.indexedDB) {
      console.log('This browser doesn\'t support IndexedDB');
      return;
    }
  
    var dbPromise = self.indexedDB.open('test-db4', 1, function(upgradeDb) {
      if (!upgradeDb.objectStoreNames.contains('people')) {
        var peopleOS = upgradeDb.createObjectStore('people', {keyPath: 'email'});
        peopleOS.createIndex('gender', 'gender', {unique: false});
        peopleOS.createIndex('ssn', 'ssn', {unique: true});
      }
      if (!upgradeDb.objectStoreNames.contains('notes')) {
        var notesOS = upgradeDb.createObjectStore('notes', {autoIncrement: true});
        notesOS.createIndex('title', 'title', {unique: false});
      }
      if (!upgradeDb.objectStoreNames.contains('logs')) {
        var logsOS = upgradeDb.createObjectStore('logs', {keyPath: 'id',
          autoIncrement: true});
      }
    });
  })();

function getObjectStore (storeName, mode) {
    // retrieve our object store
    return db.transaction(storeName,mode).objectStore(storeName)
}

async function savePixel (url) {
    // get object_store and save our payload inside it
    var request = getObjectStore('pixel', 'readwrite').add({
      url: url,
      method: 'GET'
    })
    request.onsuccess = function (event) {
      console.log('a new pos_ request has been added to indexedb')
    }
    request.onerror = function (error) {
      console.error(error)
    }
}