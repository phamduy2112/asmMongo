import {MongoClient} from 'mongodb'
const url = "mongodb://localhost:27017";
const dbName = 'asm_db';

async function connectDb() {
    const client = new MongoClient(url);
    await client.connect();
    console.log('Kết nối thành công đến server');
    return client.db(dbName);
}
export default connectDb