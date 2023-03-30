import * as dotenv from 'dotenv';
dotenv.config();
import { MongoClient, ServerApiVersion } from 'mongodb';
//const uri = process.env.DATABASE_URL;
//Esto esta hardcodeado no se hace asi :(
const uri = "mongodb://127.0.0.1:27017";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
/*await client.connect();
const db = client.db("covamatDB");
const info = db.runCommand( { connectionStatus: 1, showPrivileges: true } );
console.log('Estado del cliente: '+ info);
client.close();*/

export default client;