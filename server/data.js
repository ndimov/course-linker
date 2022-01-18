// This file handles storing, fetching, and querying the
// underlying data from MongoDB for courses and links

const { MongoClient } = require('mongodb');

const client = new MongoClient(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

exports.searchResults = async (searchStr, listing, onResultAction) => {
    normalizedSearch = searchStr.toLowerCase();
    return new Promise((resolve, reject) => {
        client.connect(err => {
            const collection = client.db("course-linker").collection("chats");
            collection.find({ "listing": listing}).sort( { code: 1, extra: 1} ).toArray()
                .then(results => {
                    results.forEach(result => {
                        if (result.code && result.code.toLowerCase().includes(normalizedSearch) || result.name.toLowerCase().includes(normalizedSearch)) {
                            var msg;
                            msg = {
                                code: result.code,
                                name: result.name,
                                extra: result.extra,
                                link: result.link
                            }
                            console.log(msg);
                            onResultAction(msg);
                        }
                    })
                    resolve("Finished iterating over results.")
                    return;
                })
                .catch(error => console.error(error))
        })
    })
}

// This method fetches the active listings from the database
// that should be exposed to the client
exports.getListings = async () => {
    return new Promise((resolve, reject) => {
        client.connect(err => {
            const collection = client.db("course-linker").collection("listings");
            collection.find().toArray()
                .then(results => {
                    let listings = [];
                    results.forEach(result => {
                        listing = {
                            name: result.name,
                            description: result.description,
                        }
                        listings.push(listing);
                    });
                    resolve(listings);
                    return;
                })
                .catch(error => console.error(error))
        })
    })
}

// This method adds a given chat into the database
exports.addChat = async (obj) => {
    insertObj = {
        code: obj.code || '',
        name: obj.name || '',
        extra: obj.extra,
        link: obj.link || '',
        listing: obj.listing || ''
    }
    return new Promise((resolve, reject) => {
        client.connect(err => {
            const collection = client.db("course-linker").collection("chats");
            collection.insertOne(insertObj, function (err, res) {
                if (err) throw err;
                console.log("Inserted chat:");
                console.log(insertObj);
                resolve("Success");
            });
        })
    })
}
