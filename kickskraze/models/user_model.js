import { Schema, connection } from "mongoose"

const userSchema = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    email: {
        type: String,
        required: [true, "Please Enter Your Email"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "Please Enter Your Passwords"],
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });


// Use a global variable to prevent multiple instances of the DB
let Db = global._kickskrazeDb;

if (!Db) {
    Db = global._kickskrazeDb = connection.useDb("Kickskraze");
}

const Users = Db.models.Users || Db.model('Users', userSchema);
export default Users