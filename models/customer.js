var mongoose = require("mongoose");

// Can't use joins in NoSQL, can't use foreign keys. Feelsbadman.

var CustomerSchema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    impSpecialist: {
        type: String,
        default: ""
    },
    salesRep: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: ""
    },
    archivingSe: {
        type: String,
        default: ""
    },
    accManager: {
        type: String,
        default: ""
    },
    location: {
        type: String,
        default: ""
    },
    supervision: {
        type: String,
        default: ""
    },
    tem: {
        type: String,
        default: ""
    },
    tam: {
        type: String,
        default: ""
    },
    natIp: {
        type: String,
        default: ""
    },
    contacts: [],
    created: {
        type: Date,
        default: Date.now
    },
    incumbentSolution: {
        type: String,
        default: ""
    },
    numberOfUsers: {
        type: String,
        default: ""
    },
    comments: {
        type: String,
        default: ""
    },
    existing_archive_prospect: {
        type: Boolean,
        default: false
    },
    existing_archive_customer: {
        type: Boolean,
        default: false
    },
    existing_security_customer: {
        type: Boolean,
        default: false
    },
    is_using_DAG: {
        type: String,
        default: ""
    },
    describe_HA_DR: {
        type: String,
        default: ""
    },
    pso: {
        ticket: {
            type: String,
            default: ""
        },
        location: {
            type: String,
            default: "Salesforce"
        }
    },
    shipreq: {
        type: String,
        default: ""
    }
});

var Customer = mongoose.model("Customer", CustomerSchema);

// Customer.create({
//     name: "Kearney",
//     status: "OLD",
//     salesRep: "1One",
//     archivingSe: "2Two",
//     accManager: "3Three",
//     location: "4Four",
//     supervision: "5Five",
//     natIp: "6Six",
//     contacts: "7Seven"
// });
//
// var newCustomer = new Customer({
//     _id: "Tesla"
// });
//
// newCustomer.save(function (error, result) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log("Successfully created customer: " + result["_id"]);
//     }
// });

module.exports = Customer;