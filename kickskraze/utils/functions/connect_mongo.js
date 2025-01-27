import mongoose from "mongoose";
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']); // Google DNS servers

mongoose.set("strictQuery", true);
const connect_mongo = async () => mongoose.connect(process.env.MONGO_URI);

export default connect_mongo