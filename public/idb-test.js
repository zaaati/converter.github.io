import * idb from 'idb';

var dbPromise = idb.open('test-db', 4, function (upgradeDb) {
    switch(upgradeDb.version) {
        case 0:
            var keyValStore = upgradeDb.createObjectStore('keyval');
            keyValStore.put("world", "hello");
        case 1:
            upgradeDb.createObjectStore('people', {keyPath: 'name'});
        case 2:
            var peopleStore = upgradeDb.transaction.objectStore('people');
            peopleStore.createIndex('animal', 'favoriteAnimal');
        case 3:
            peopleStore = upgradeDb.transaction.objectStore('people');
            peopleStore.createIndex('age', 'age');
    }
});

// read "hello" in "keyval"
dbPromise.then(function (db) {
    var tx = db.transaction('keyval');
    var keyValStore = tx.objectStore('keyval');
    return keyValStore.get('hello');
}).then(function (val) {
    console.log('The value of "hello" is:', val);
});

dbPromise.then(function (db) {
    var tx = db.transaction('keyval', 'readwrite');
    var keyValStore = tx.objectStore('keyval');
    keyValStore.put('cat', 'favoriteAnimal');
    return tx.complete;
}).then(function () {
    console.log('Added favoriteAnimal: cat to keyval');
});

dbPromise.then(function (db) {
    var ts = db.transaction('keyva', 'readwrite');
    var keyValStore = tx.objectStore('keyval');
    keyValStore.put('awesome', 'zatti');
    return tx.complete;
}).then(function() {  

console.log("Added zatti is awesome");
});

dbPromise.then(function(db) {
    var tx = db.transaction('people', 'readwrite');
    var peopleStore = tx.objectStore('people');

    peopleStore.put({
        name: 'Hakeem',
        age: 17,
        favoriteAnimal: 'Dog'
    });
    
    peopleStore.put({
        name: 'Moses',
        age: 19,
        favoriteAnimal: 'Lion'
    });

    return tx.complete;
}).then(function() {
    console.log('People added');
});

dbPromise.then(function(db) {
    var tx = db.transaction('people');
    var peopleStore = tx.objectStore('people');
    var animalIndex = peopleStore.index('animal');

    // return peopleStore.getAll();
    return animalIndex.getAll();
}).then(function(people) {
    console.log('People by animal:', people);
});

dbPromise.then(function(db) {
    var tx = db.transaction('people');
    var peopleStore = tx.objectStore('people');
    var ageIndex = peopleStore.index('age');

    return ageIndex.getAll();
}).then(function(people) {
    console.log("People by age:", people);
});

dbPromise.then(function(db) {
    var tx = db.transaction('people');
    var peopleStore = tx.objectStore('people');
    var ageIndex = peopleStore.index('age');

    return ageIndex.oepneCursor();
}).then(function(cursor) {
    if (!cursor) return;
    return cursor.advance(2); //Skips 2 people
}).then(function logPerson(cursor) {
    if (!cursor) return;
    console.log("Cursored at:", cursor.value.name);
    return cursor.continue().then(logPerson);
}).then(function() {
    console.log("Done cursoring!");
});
