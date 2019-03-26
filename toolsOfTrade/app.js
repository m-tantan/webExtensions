var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var ObjectId = require('mongodb').ObjectID;
var url = 'mongodb://toolsoftrade:KGEVvPS8qhe5FHr4OprkjqTig9xaOGjcJzB1bzXdpNKqqWwhqQ9aBUpdsl4pOBWL6mf2BaNxxN778oYqMDpODQ%3D%3D@toolsoftrade.documents.azure.com:10255/?ssl=true&replicaSet=globaldb';

var insertDocument = function (db, callback) {
    db.collection('scores').insertOne({
        "id": "AndersenFamily",
        "lastName": "Andersen",
        "parents": [
            { "firstName": "Thomas" },
            { "firstName": "Mary Kay" }
        ],
        "children": [
            { "firstName": "John", "gender": "male", "grade": 7 }
        ],
        "pets": [
            { "givenName": "Fluffy" }
        ],
        "address": { "country": "USA", "state": "WA", "city": "Seattle" }
    }, function (err, result) {
        assert.equal(err, null);
        console.log("Inserted a document into the families collection.");
        callback();
    });
};

var findFamilies = function (db, callback) {
    var cursor = db.collection('scores').find();
    cursor.each(function (err, doc) {
        assert.equal(err, null);
        if (doc != null) {
            console.dir(doc);
        } else {
            callback();
        }
    });
};

var updateFamilies = function (db, callback) {
    db.collection('scores').updateOne(
        { "lastName": "Andersen" },
        {
            $set: {
                "pets": [
                    { "givenName": "Fluffy" },
                    { "givenName": "Rocky" }
                ]
            },
            $currentDate: { "lastModified": true }
        }, function (err, results) {
            console.log(results);
            callback();
        });
};

var removeFamilies = function (db, callback) {
    db.collection('scores').deleteMany(
        { "lastName": "Andersen" },
        function (err, results) {
            console.log(results);
            callback();
        }
    );
};

MongoClient.connect(url, function (err, client) {
    assert.equal(null, err);
    var db = client.db('Bookmarks');
    insertDocument(db, function () {
        findFamilies(db, function () {
            updateFamilies(db, function () {
                // removeFamilies(db, function () {
                    client.close();
                // });
            });
        });
    });
});