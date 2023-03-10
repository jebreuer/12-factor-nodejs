const { MongoClient } = require('mongodb')

const mongodb_uri = process.env.MONGODB_URI

if (!mongodb_uri) {
  console.error('FATAL: No mongodb URI found!')
  process.exit(1)
} else {
  console.log('INFO: found mongodb URI')
}

const client = new MongoClient(mongodb_uri);
const db = client.db()
const collection = db.collection('messages')

collection.deleteMany({}).then(() => {
    client.close().then(() => {
        console.log('Done.')
        process.exit(0)
    })
})
