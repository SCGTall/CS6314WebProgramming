let db = require('../modules/database');

// log level control
const Level = {
    DEVELOPING: 0,
    DEBUGGING: 1,
    OPERATING: 2,
    TESTING: 3,
}
var logLevel = Level.DEBUGGING;
exports.Level = Level;
exports.logLevel = logLevel;

// selected print
var selectedPrint = function(obj) {
    let outp = {};
    Object.keys(obj).forEach((key) => {
        if (Array.isArray(obj[key]) && obj[key].length > 5) {  // array
            if (obj[key].length > 5) {
                let sliced = obj[key].slice(0, 5);
                sliced.push("...");
                outp[key] = sliced;
            } else {
                outp[key] = obj[key];
            }
        } else if (typeof(obj[key]) == "object" && Object.keys(obj[key]) !== undefined) {  // dict
            let ks = Object.keys(obj[key]);
            if (ks.length > 5) {
                let sliced = ks.slice(0, 5);
                outp[key] = {};
                for (let k of sliced) {
                    outp[key][k] = obj[key][k];
                }
                outp[key]["..."] = "...";
            } else {
                outp[key] = obj[key];
            }
        }else {
            outp[key] = obj[key];
        }
    })
    console.log(outp);
}
exports.selectedPrint = selectedPrint;


