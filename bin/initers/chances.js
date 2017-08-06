function initChances() {
    chancesRef = {
        "water": 0
    };
    chances = [{
        "l": "water", // label
        "clr": "#3BAFDA", // colour
        "c": 13, // chance
        "ds": 0,
        /* "density speed", how fast to travel
        A weight of 0 denotes a wall.
        A weight cannot be negative.
        A weight cannot be between 0 and 1 (exclusive).
        A weight can contain decimal values (greater than 1).
        */
        "rsrcs": { // resources
            "a": -2, // amount (-2 = infinite, -1 = none, 0 = depleted)
            "cd": 2, // cooldown in seconds, to prevent click-spamming (bringt hier aba nix, weil a=-1 is)
            "d": 70, // degrade-time in seconds (-1 = infinite)
            "dT": { // degrades to..
                "sand": 23,
                "dirt": 15,
                "grass": 16,
                "wood": 7,
                "water": 21,
                "rocks": 18
            }
        }
    }];

    function new_chnc(l, clr, c, ds, rsrcs) {
        var exChnc = {
            "l": "",
            "clr": "",
            "c": 0,
            "ds": 0,
            "rsrcs": {
                "a": 0,
                "cd": 0,
                "d": 0,
                "dT": {

                }
            }
        };

        var validate = function(tO, ptO) {
            var nerr = true;
            var ptO = (ptO ? ptO + "." : "");

            for (var x in tO) {
                var y = typeof tO[x];

                // console.log("\n" + ptO + x + " :: " + (eval("typeof " + ptO + x)) + " :: " + y);
                if (eval("typeof " + ptO + x + " !== \"" + y + "\"") && (x !== "clr" && eval("typeof " + ptO + x + " !== \"object\""))) {
                    nerr = false;
                } else if (x === "clr" && eval("typeof " + ptO + x + " === \"object\"")) {
                    nerr = eval(ptO + x + ".length") > 0;
                    // console.log(nerr);

                    if (nerr) {
                        // console.log("exChnc." + ptO + x + " = " + ptO + x);
                        eval("exChnc." + ptO + x + " = " + ptO + x);
                    }
                } else {
                    var nerr2 = true;
                    if (y === "object")
                        nerr2 = validate(tO[x], ptO + x);
                    if (nerr && !nerr2) {
                        nerr = nerr2;
                        // console.log(x + " :: " + nerr2);
                    }

                    if (nerr) {
                        // console.log("exChnc." + ptO + x + " = " + ptO + x);
                        eval("exChnc." + ptO + x + " = " + ptO + x);
                    }
                }
            }

            return nerr;
        }
        var nerr = validate(exChnc);
        // console.log(nerr);
        if (nerr) {
            var cRef = chances.push(exChnc) - 1;
            // console.log(chances[cRef].l);
            chancesRef[exChnc.l] = cRef;
        }
    }

    new_chnc(
        "sand",
        "#E8CE4D",
        11,
        1.3, {
            "a": 4,
            "cd": 2,
            "d": 5,
            "dT": {
                "dirt": 15,
                "grass": 65,
                "wood": 15,
                "rocks": 10
            }
        }
    );
    new_chnc(
        "dirt",
        "#AA8E69",
        10,
        1, {
            "a": -1,
            "cd": 1,
            "d": 5,
            "dT": {
                "dirt": 25,
                "grass": 40,
                "wood": 5,
                "water": 15,
                "rocks": 15
            }
        }
    );
    new_chnc(
        "grass",
        "#8CC152",
        44,
        1.1, {
            "a": 1,
            "cd": 2,
            "d": 10,
            "dT": {
                "dirt": 15,
                "grass": 65,
                "wood": 15,
                "rocks": 10
            }
        }
    );
    new_chnc(
        "wood",
        // "#2ABA66",
        [
            "tree3"
        ],
        15,
        1.5, {
            "a": 3,
            "cd": 4,
            "d": 30,
            "dT": {
                "dirt": 60,
                "grass": 25,
                "rocks": 15
            }
        }
    );
    new_chnc(
        "stone",
        "#AAB2BD",
        17,
        1.2, {
            "a": 10,
            "cd": 3,
            "d": 40,
            "dT": {
                "dirt": 34,
                "grass": 27,
                "wood": 3,
                "water": 7,
                "rocks": 29
            }
        }
    );

    var csum = 0;
    for (var i = 0; i < chances.length; i++) {
        csum += (chances[i].c / 100.0);
        chances[i].c2 = csum;

        var csum2 = 0;
        for (var i2 in chances[i].rsrcs.dT) {
            var i2c = chances[i].rsrcs.dT[i2];
            csum2 += (i2c / 100.0);
            chances[i].rsrcs.dT[i2] = csum2;
        }
    }
}