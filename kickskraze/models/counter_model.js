import { Schema, connection } from "mongoose"

const counterSchema = new Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 1000 }, // Start from KB1000
});

// Create or reuse the Counter model
const Db = connection.useDb("Kickskraze");
const Counter = Db.models.Counter || Db.model("Counter", counterSchema);
export default Counter;