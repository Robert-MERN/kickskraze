import { Schema, connection } from "mongoose"

const appSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    delivery_charges: {
        type: Number,
        default: 200,
        required: [true, "Please provide the Delivery charges"],

    },
    vouchers: [
        {
            voucher_name: String,
            coupon_code: String,
            discount_amount: Number,
            expiry_date: Date,
        }
    ]

}, { timestamps: true });


// Use a global variable to prevent multiple instances of the DB
const Db = connection.useDb("Kickskraze");

const AppSettings = Db.models.AppSettings || Db.model('AppSettings', appSchema);
export default AppSettings