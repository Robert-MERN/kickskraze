import mongoose from "mongoose";
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']); // Google DNS servers

mongoose.set("strictQuery", true);
const connect_mongo = async () => mongoose.connect(process.env.MONGO_URI, {
    maxPoolSize: 10,  // Adjust pool size based on your server load
    serverSelectionTimeoutMS: 60000, // Timeout if can't connect
    socketTimeoutMS: 45000, // Close sockets after inactivity
});

export default connect_mongo