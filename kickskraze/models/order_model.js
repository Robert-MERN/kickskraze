import { Schema, connection } from "mongoose"
import Counter from "./counter_model";


const ordersSchema = new Schema(
    {
        orderNumber: {
            type: String,
            unique: true, // Ensures no duplicates
        },
        email: {
            type: String,
            required: [true, "Please enter your email"]
        },
        special_instructions: {
            type: String,
        },
        firstName: {
            type: String,
            required: [true, "Please type your first name"]
        },
        lastName: {
            type: String,
            required: [true, "Please enter your last name"]
        },
        city: {
            type: String,
            required: [true, "Please enter your city"]
        },
        postal_code: {
            type: String,
        },
        address: {
            type: String,
            required: [true, "Please enter your postal code"]
        },
        phone: {
            type: String,
            required: [true, "Please type your phone no."]
        },
        delivery_charges: {
            type: Number,
            default: 200,
        },
        coupon_code: {
            type: String,
        },
        purchase: Array,
        payment_method: {
            type: String,
        },
        status: {
            type: String,
            default: "booked"
        },
        tracking_no: {
            type: String,
        },
        courier_name: {
            type: String,
        },
        verification: {
            type: String,
            default: "unverified"
        },
        store_name: {
            type: [String],
        },
        warehouse_status: {
            type: String,
            default: "idle"
        },
        isDeleted: {
            type: Boolean,
            default: false,
        }
    },
    { timestamps: true }
)



const PREFIX = "KK"; // Define your custom prefix
// **Pre-save middleware for auto-incremented order numbers**
ordersSchema.pre("save", async function (next) {
    if (!this.orderNumber) {
        const counter = await Counter.findByIdAndUpdate(
            { _id: "orderId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );
        this.orderNumber = `${PREFIX}${counter.seq}`;
    }
    next();
});




// Use a global variable to prevent multiple instances of the DB
const Db = connection.useDb("Kickskraze");

const Orders = Db.models.Orders || Db.model('Orders', ordersSchema);
export default Orders