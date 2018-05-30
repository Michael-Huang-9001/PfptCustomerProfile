var express = require("express");
var router = express.Router();
// var User = require("../models/user");
var mongoose = require("mongoose");
var bcrypt = require("bcrypt");
mongoose.Promise = Promise;

var ldap_auth = require("ldapjs");
var client = ldap_auth.createClient({
    url: "ldap://ldap.corp.proofpoint.com",
});

var Customer = require("../models/customer");
var ApplianceQuestions = require("../models/appliances");
var DesignSummaryQuestions = require("../models/design_summary");
var DesktopNetworkQuestions = require("../models/desktop_network");
var EmailPSQuestions = require("../models/email_ps");
var EmailSEQuestions = require("../models/email_se");
var JournalingQuestions = require("../models/journaling");
var OtherDataSourcesQuestions = require("../models/other_data_sources");
var UsageQuestions = require("../models/usage");
var ImportQuestions = require("../models/import");
var POCQuestions = require("../models/poc");
var RFEQuestions = require("../models/rfe");
var User = require("../models/user");

// For authenticating cookies/sessions.
function authenticate_session(req, res, next) {
    if (req.session.user) {
        next();
    } else {
        res.redirect("/login");
    }
}

function authenticate_ldap(username, password) {
    var domain_name = "uid=" + username + ",ou=People,dc=extreme-email,dc=com";
    console.log("Domain info: " + domain_name);

    var login_result = client.bind(domain_name, password, (error) => {
        if (error) {
            console.log(error);
            return false;
        } else {
            return false;
        }
    });

    return login_result;

}

// LOGOUT AND KILL SESSION
router.post("/logout", function (req, res) {
    var user = req.session.user;
    req.session.destroy(() => {
        console.log("Logging out: " + user);

    });
    res.redirect("/login");
});

//Entry point for the app startup
router.get("/", function (req, res) {
    res.redirect("/index");
});

//NEW ROUTE
router.get("/new", authenticate_session, function (req, res) {
    res.render("new", {error_message: undefined});
});

// REGISTER
router.get("/register", function (req, res) {
    res.render("register", {error_message: undefined});
});

// POST REGISTER
router.post("/register", function (req, res) {
    if (!req.body.registration_info["username"] || !req.body.registration_info["password"] || !req.body.registration_info["confirm_password"]) {
        res.render("register", {error_message: "Please enter all fields."});
    } else {
        if (req.body.registration_info["password"] == req.body.registration_info["confirm_password"]) {
            async function register_user() {
                var hashed_password = await bcrypt.hash(req.body.registration_info["password"], 10);
                await User.create({username: req.body.registration_info["username"], password: hashed_password});
            }

            register_user().then(() => {
                res.redirect("/login");
            }).catch((error) => {
                if (error["code"] == 11000) {
                    console.log("-- Duplicate entry for user: " + req.body.registration_info["username"]);
                    // Send pop up alert to HTML here
                    res.render("register", {error_message: "User already exists: " + req.body.registration_info["username"]});
                } else {
                    console.log(error);
                }
            });
        } else {
            res.render("register", {error_message: "Passwords are not equal."});
        }
    }
});

// LOGIN
router.get("/login", function (req, res) {
    res.render("login", {fail: false});
});

// POST LOGIN
router.post("/login", function (req, res) {
    if (!req.body.login || req.body.login == undefined) {
        res.render("login", {fail: true});
    } else {
        if (authenticate_ldap(req.body.login["username"], req.body.login["password"]) == true) {
            req.session.user = req.body.login["username"];
            res.redirect("/index");
        } else {
            res.render("login", {fail: true});
        }

        // User.findOne({username: req.body.login["username"]}).then((result) => {
        //     if (result == null) {
        //         res.render("login", {fail: true});
        //     } else {
        //         bcrypt.compare(req.body.login["password"], result["password"], function (err, validated) {
        //             if (validated) {
        //                 // Do auth/sessions here
        //                 console.log("Logged in: " + req.body.login["username"]);
        //                 req.session.user = req.body.login["username"];
        //                 res.redirect("/index");
        //             } else {
        //                 res.render("login", {fail: true});
        //             }
        //         });
        //     }
        // }).catch((error) => {
        //     if (error) {
        //         res.render("login", {fail: true});
        //     }
        // });
    }
});

//CREATE ROUTE
router.post("/new", authenticate_session, function (req, res) {

        if (req == undefined || req == null) {
            console.log("req is empty");
        }

        console.log("- Trying to create new customer...");

        Customer.create(req.body.customer, (error) => {
            if (error) {
                if (error["code"] == 11000) {
                    console.log("-- Duplicate entry for customer: " + req.body.customer["name"]);
                    // Send pop up alert to HTML here
                    res.render("new", {error_message: "Duplicate entry for customer: " + req.body.customer["name"]});
                } else {
                    console.log(error);
                }
            } else {
                ApplianceQuestions.create({name: req.body.customer["name"]});
                DesignSummaryQuestions.create({name: req.body.customer["name"]});
                DesktopNetworkQuestions.create({name: req.body.customer["name"]});
                EmailPSQuestions.create({name: req.body.customer["name"]});
                EmailSEQuestions.create({name: req.body.customer["name"]});
                ImportQuestions.create({name: req.body.customer["name"]});
                JournalingQuestions.create({name: req.body.customer["name"]});
                OtherDataSourcesQuestions.create({name: req.body.customer["name"]});
                POCQuestions.create({name: req.body.customer["name"]});
                RFEQuestions.create({name: req.body.customer["name"]});
                UsageQuestions.create({name: req.body.customer["name"]});

                res.redirect("/index");
                console.log("Creation of customer " + req.body.customer["name"] + " successful.");
            }
        });

        // Customer.create(req.body.customer).then(() => {
        //     ApplianceQuestions.create({name: req.body.customer["name"]});
        //     DesignSummaryQuestions.create({name: req.body.customer["name"]});
        //     DesktopNetworkQuestions.create({name: req.body.customer["name"]});
        //     EmailPSQuestions.create({name: req.body.customer["name"]});
        //     EmailSEQuestions.create({name: req.body.customer["name"]});
        //     ImportQuestions.create({name: req.body.customer["name"]});
        //     JournalingQuestions.create({name: req.body.customer["name"]});
        //     OtherDataSourcesQuestions.create({name: req.body.customer["name"]});
        //     POCQuestions.create({name: req.body.customer["name"]});
        //     RFEQuestions.create({name: req.body.customer["name"]});
        //     UsageQuestions.create({name: req.body.customer["name"]});
        //
        //     res.redirect("/index");
        //     console.log("Creation of customer " + req.body.customer["name"] + " successful.");
        // }).catch((error) => {
        //     if (error["code"] == 11000) {
        //         console.log("-- Duplicate entry for customer: " + req.body.customer["name"]);
        //         // Send pop up alert to HTML here
        //         res.render("new", {error_message: "Duplicate."});
        //     } else {
        //         console.log(error);
        //     }
        // });
    }
);

//UPDATE ROUTE
router.put("/index/:id", authenticate_session, function (req, res) {
        // Considering changing to else ifs

        // For updating name, make a ton of promises and execute them, THEN render the page.
        if (req.body.customer != undefined && req.body.customer != null) {
            console.log("- Trying to update customer information...")

            // Make a bunch of await calls and wait for the queries to finish.
            async function updateID() {
                await Customer.findOneAndUpdate({name: req.params.id}, req.body.customer).exec();
                await ApplianceQuestions.findOneAndUpdate({name: req.params.id}, {"name": req.body.customer["name"]}).exec();
                await DesignSummaryQuestions.findOneAndUpdate({name: req.params.id}, {"name": req.body.customer["name"]}).exec();
                await DesktopNetworkQuestions.findOneAndUpdate({name: req.params.id}, {"name": req.body.customer["name"]}).exec();
                await EmailPSQuestions.findOneAndUpdate({name: req.params.id}, {"name": req.body.customer["name"]}).exec();
                await EmailSEQuestions.findOneAndUpdate({name: req.params.id}, {"name": req.body.customer["name"]}).exec();
                await ImportQuestions.findOneAndUpdate({name: req.params.id}, {"name": req.body.customer["name"]}).exec();
                await JournalingQuestions.findOneAndUpdate({name: req.params.id}, {"name": req.body.customer["name"]}).exec();
                await OtherDataSourcesQuestions.findOneAndUpdate({name: req.params.id}, {"name": req.body.customer["name"]}).exec();
                await POCQuestions.findOneAndUpdate({name: req.params.id}, {"name": req.body.customer["name"]}).exec();
                await RFEQuestions.findOneAndUpdate({name: req.params.id}, {"name": req.body.customer["name"]}).exec();
                await UsageQuestions.findOneAndUpdate({name: req.params.id}, {"name": req.body.customer["name"]}).exec();
            }

            // Only if all the queries finish, redirect the page to the new customer name.
            updateID().then(() => {
                res.redirect("/index/" + req.body.customer["name"]);
            }).catch((error) => {
                // If an error occurs, catch the error.
                if (error["code"] == 11000) { // Dupe ID
                    console.log("-- Duplicate key for customer: " + req.body.customer["name"]);
                } else {
                    console.log(error + "\n---");
                }
            });
        }

        // Updating appliance questions
        if (req.body.appliance_questions != undefined && req.body.appliance_questions != null) {
            ApplianceQuestions.findOneAndUpdate({name: req.params.id}, req.body.appliance_questions).then(() => {
                res.redirect("/index/" + req.params.id);
            }).catch((error) => {
                console.log(error);
                res.redirect("/index");
            });
        }

        // Updating design summary questions
        if (req.body.design_summary_questions != undefined && req.body.design_summary_questions != null) {
            DesignSummaryQuestions.findOneAndUpdate({name: req.params.id}, req.body.design_summary_questions).then(() => {
                res.redirect("/index/" + req.params.id);
            }).catch((error) => {
                console.log(error);
                res.redirect("/index");
            });
        }

        // Updating desktop network questions
        if (req.body.desktop_network_questions != undefined && req.body.desktop_network_questions != null) {
            DesktopNetworkQuestions.findOneAndUpdate({name: req.params.id}, req.body.desktop_network_questions).then(() => {
                res.redirect("/index/" + req.params.id);
            }).catch((error) => {
                console.log(error);
                res.redirect("/index");
            });
        }

        // Updating Email SE Questions
        if (req.body.email_se_questions != undefined && req.body.email_se_questions != null) {
            EmailSEQuestions.findOneAndUpdate({"name": req.params.id}, req.body.email_se_questions).then(() => {
                res.redirect("/index/" + req.params.id);
            }).catch((error) => {
                console.log(error);
                res.redirect("/index");
            });
        }

        // Updating Email PS Questions
        if (req.body.email_ps_questions != undefined && req.body.email_ps_questions != null) {
            EmailPSQuestions.findOneAndUpdate({"name": req.params.id}, req.body.email_ps_questions).then(() => {
                res.redirect("/index/" + req.params.id);
            }).catch((error) => {
                console.log(error);
                res.redirect("/index");
            });
        }

        // Updating Import Questions
        if (req.body.import_questions != undefined && req.body.import_questions != null) {
            ImportQuestions.findOneAndUpdate({"name": req.params.id}, req.body.import_questions).then(() => {
                res.redirect("/index/" + req.params.id);
            }).catch((error) => {
                console.log(error);
                res.redirect("/index");
            });
        }

        // Updating Journaling questions
        if (req.body.journaling_questions != undefined && req.body.journaling_questions != null) {
            JournalingQuestions.findOneAndUpdate({"name": req.params.id}, req.body.journaling_questions).then(() => {
                res.redirect("/index/" + req.params.id);
            }).catch((error) => {
                console.log(error);
                res.redirect("/index");
            });
        }

        // Updating Other Data Sources Questions
        if (req.body.other_data_source_questions != undefined && req.body.other_data_source_questions != null) {
            OtherDataSourcesQuestions.findOneAndUpdate({name: req.params.id}, req.body.other_data_source_questions).then(() => {
                res.redirect("/index/" + req.params.id);
            }).catch((error) => {
                console.log(error);
                res.redirect("/index");
            });
        }

        // Updating POC Questions
        if (req.body.poc_questions != undefined && req.body.poc_questions != null) {
            POCQuestions.findOneAndUpdate({name: req.params.id}, req.body.poc_questions).then(() => {
                res.redirect("/index/" + req.params.id);
            }).catch((error) => {
                console.log(error);
                res.redirect("/index");
            });
        }

        // Updating RFE Questions
        if (req.body.rfe_questions != undefined && req.body.rfe_questions != null) {
            RFEQuestions.findOneAndUpdate({name: req.params.id}, req.body.rfe_questions).then(() => {
                res.redirect("/index/" + req.params.id);
            }).catch((error) => {
                console.log(error);
                res.redirect("/index");
            });
        }

        // Updating Usage Questions
        if (req.body.usage_questions != undefined && req.body.usage_questions != null) {
            UsageQuestions.findOneAndUpdate({name: req.params.id}, req.body.usage_questions).then(() => {
                res.redirect("/index/" + req.params.id);
            }).catch((error) => {
                console.log(error);
                res.redirect("/index");
            });
        }
    }
);

//INDEX ROUTE
router.get("/index", authenticate_session, function (req, res) {

    Customer.find({}).then((customers) => {
        res.render("index", {customers: customers});
    }).catch((error) => {
        console.log("An error has occurred.");
        console.log(error);
    });

    // Customer.find({}, function (err, customers) {
    //     if (err) {
    //         console.log("An error has occurred.");
    //         console.log(err);
    //     } else {
    //         res.render("index", {customers: customers});
    //     }
    // });
});


// SHOW ROUTE
router.get("/index/:id", authenticate_session, function (req, res) {

    // ATTEMPTING TO ESCAPE CALLBACK HELL: ESCAPED B O I S

    // var appliances_query = ApplianceQuestions.findOne({"name": req.params.id}).exec();
    // var customer_query = Customer.findOne({"name": req.params.id}).exec();
    // var desktop_network_query = DesktopNetworkQuestions.findOne({"name": req.params.id}).exec();
    // var email_ps_questions_query = EmailPSQuestions.findOne({"name": req.params.id}).exec();
    // var email_se_questions_query = EmailSEQuestions.findOne({"name": req.params.id}).exec();
    // var import_query = ImportQuestions.findOne({"name": req.params.id}).exec();
    // var journaling_query = JournalingQuestions.findOne({"name": req.params.id}).exec();
    // var other_data_sources_query = OtherDataSourcesQuestions.findOne({"name": req.params.id}).exec();
    // var poc_query = POCQuestions.findOne({"name": req.params.id}).exec();
    // var usage_query = UsageQuestions.findOne({"name": req.params.id}).exec();

    // Query every table and grab the results in a blocking manner
    async function query(search_term) {
        var questionnaire = {};
        questionnaire["appliance_questions"] = await ApplianceQuestions.findOne(search_term).exec();
        questionnaire["customer"] = await Customer.findOne(search_term).exec();
        questionnaire["design_summary_questions"] = await DesignSummaryQuestions.findOne(search_term).exec();
        questionnaire["desktop_network_questions"] = await DesktopNetworkQuestions.findOne(search_term).exec();
        questionnaire["email_ps_questions"] = await EmailPSQuestions.findOne(search_term).exec();
        questionnaire["email_se_questions"] = await EmailSEQuestions.findOne(search_term).exec();
        questionnaire["import_questions"] = await ImportQuestions.findOne(search_term).exec();
        questionnaire["journaling_questions"] = await JournalingQuestions.findOne(search_term).exec();
        questionnaire["other_data_source_questions"] = await OtherDataSourcesQuestions.findOne(search_term).exec();
        questionnaire["poc_questions"] = await POCQuestions.findOne(search_term).exec();
        questionnaire["rfe_questions"] = await RFEQuestions.findOne(search_term).exec();
        questionnaire["usage_questions"] = await UsageQuestions.findOne(search_term).exec();
        return questionnaire;
    }

    // RENDER ALL THE THINGS
    query({"name": req.params.id}).then((result) => {
        res.render("show", result);
    }).catch((error) => {
        console.log(error);
    });

});

module.exports = router;