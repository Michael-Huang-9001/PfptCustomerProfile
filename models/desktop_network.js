var mongoose = require("mongoose");
// var Schema = mongoose.Schema;

var desktop_network_schema = new mongoose.Schema({
    name: {
        type: String,
        unique: true,
        required: true
    },
    network_security: {
        allow_outside_access: {
            type: String,
            default: ""
        },
        DMZ: {
            type: String,
            default: ""
        },
        firewalls: {
            type: String,
            default: ""
        },
        require_vpn: {
            type: String,
            default: ""
        },
        enable_outside_access: {
            type: String,
            default: ""
        },
        load_balancer_VIP: {
            type: String,
            default: ""
        },
        nat_IP_list: {
            type: String,
            default: ""
        },
        proxy_servers: {
            type: String,
            default: ""
        }
    },
    // end_user_desktop_env: {
    //     browsers: { // One or more strings, Chrome/Firefox/IE/Edge
    //         type: String,
    //         default: ""
    //     },
    //     browser_versions: {
    //         type: String,
    //         default: ""
    //     },
    //     ie11: {
    //         type: String,
    //         default: ""
    //     },
    //     ie11_compatibility: {
    //         type: String,
    //         default: ""
    //     },
    //     is_ie11_enterprise: {
    //         type: String,
    //         default: ""
    //     },
    //     is_popups_enabled: {
    //         type: String,
    //         default: ""
    //     },
    //     is_OWA_used: {
    //         type: String,
    //         default: ""
    //     },
    //     browsers_access: { // One or more strings, Chrome/Firefox/IE/Edge
    //         type: String,
    //         default: ""
    //     }
    // },
    disaster_recovery: {
        is_replicating_exchange_and_AD: {
            type: String,
            default: ""
        },
        config_description: {
            type: String,
            default: ""
        },
        diagram: {
            type: String,
            default: ""
        }
    },
    // Authentication (SAML & Remote Auth) not shown in page
    authentication: {
        use_SSO: {
            type: String,
            default: ""
        },
        have_IDP: {
            type: String,
            default: ""
        },
        what_IDP: {
            type: String,
            default: ""
        },
        where_security_group: {
            type: String,
            default: ""
        },
        intiated_IDP: {
            type: String,
            default: ""
        },
        require_request_encryption: { // Not supported
            type: String,
            default: ""
        },
        require_response_signing: { // supported
            type: String,
            default: ""
        },
        require_response_encryption: {
            type: String,
            default: ""
        },
        require_third_party_cert: {
            type: String,
            default: ""
        },
        response_attributes: {
            type: String,
            default: ""
        },
        intend_to_deploy_remote_auth: {
            type: String,
            default: ""
        },
        all_users_trusted: {
            type: String,
            default: ""
        },
        domain_controllers: {
            type: String,
            default: ""
        }
    },
    comments: {
        type: String,
        default: ""
    }
});

var DesktopNetworkQuestions = mongoose.model("DesktopNetworkQuestions", desktop_network_schema);

// var newCustomer = new DesktopNetworkQuestions({
//     _id: "Tesla"
// });
//
// newCustomer.save(function (error, result) {
//     if (error) {
//         console.log(error);
//     } else {
//         console.log("Successfully created desktop network questions for customer: " + result["_id"]);
//     }
// });

module.exports = DesktopNetworkQuestions;