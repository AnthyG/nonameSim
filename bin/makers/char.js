var makeChar = function makeChar(x, y, n, invcm, skills) {
    var skills = skills || [
        // "waterwalker"
    ];

    // var chr = g.circle(
    //     10,
    //     "",
    //     "black",
    //     2
    // );
    // var chr2 = chr.addChild(g.circle(
    //     10,
    //     "white"
    // ));
    // chr2.alpha = 0.5;

    var chr = g.circle(
        10,
        "white",
        "black",
        2
    );

    var chrN = chr.addChild(
        g.text(
            n,
            "8px Arial",
            "white"
        )
    );
    chr.putTop(chrN);

    chr.c = {
        "n": n, // Name
        "bx": 0, // blcks[x]
        "by": 0, // blcks[y]
        // "x": tSize / 2, // "real" x
        // "y": tSize / 2, // "real" y
        "cmove": false, // current move
        "movearr": [], // array to destination
        "cactx": 0,
        "cacty": 0,
        "cactI": false, // current act index
        "cldwn": 0, // cooldown
        "invcm": invcm, // Max nr of items in the inv
        "invc": 0, // Nr of items, currently in the inv
        "inv": {}, // Inventory
        "skills": skills, // skills
        "children": { // some other stuff, like the act-line
            "actline": undefined
        }
    };

    chr.setPosition(
        g.stage.width / tNr / 2 - chr.halfWidth,
        g.stage.width / tNr / 2 - chr.halfHeight
    );

    chr.vx = 0;
    chr.vy = 0;

    g.breathe(chr, 1.1, 1.1, 150);
    g.pulse(chr, 150, 0.575);

    chrs.addChild(chr);
};