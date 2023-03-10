const { MongoClient } = require('mongodb')
const express = require('express')
const app = express()

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

app.get('/', async function (req, res) {
  const { msg } = req.query
  if (msg) {
    console.log('INFO: found msg:', msg)
    const new_msg = await collection.insertOne({ msg })
    console.log(`A document was inserted with the _id: ${new_msg.insertedId}`);
  }
  
  const cursor = await collection.find({})

  var messages = []
  await cursor.forEach((e) => messages.push(e))

  res.json(messages)
})

const server = app.listen(process.env.PORT || 4000)

process.on('SIGTERM', async () => {
  console.log('INFO: Received SIGTERM. Preparing shutdown ...');

  console.log('INFO: ... closing mongodb connection ...');
  await client.close()

  console.log('INFO: ... closing listen socket ...');
  await server.close()

  console.log('INFO: ... done. Cheers!');
  process.exit(0)
});