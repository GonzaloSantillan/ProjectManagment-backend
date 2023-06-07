import mongoose from "mongoose";

const conectarDb = async () => {
    try {
        const connection = await mongoose.connect(process.env.DATABASEURL, {
            useNewUrlParser:true,
            useUnifiedTopology:true,
        });
        const url = `${connection.connection.host}:${connection.connection.port}`;
        console.log('MongoDb connected to: ' + url);
    } catch (error) {
        console.log('Fail: ' + error.message);
        process.exit(1);
    }
}

export default conectarDb;