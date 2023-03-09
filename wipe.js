const { MongoClient } = require('mongodb')

const vcap_services = JSON.parse(process.env.VCAP_SERVICES)
const mongodb_uri = vcap_services['stackit-mongodb']?.at(0)?.credentials?.uri

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
