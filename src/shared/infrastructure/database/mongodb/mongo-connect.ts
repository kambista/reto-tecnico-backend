import mongoose from "mongoose";

interface Options {
  mongoUri: string;
  dbName: string;
}

export default class MongoConnect {
  static async connect(options: Options) {
    await mongoose.connect(options.mongoUri, {
      dbName: options.dbName,
    });
  }
}
