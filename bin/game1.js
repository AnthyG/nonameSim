"use strict";

let thingsToLoad = [
    "images/header.png",
    "audio/soundtrack/Rebouz - Raindrops.mp3"
];

function load() {
    // //Display the file currently being loaded
    // console.log(`loading: ${g.loadingFile}`);

    // //Display the percentage of files currently loaded
    // console.log(`progress: ${g.loadingProgress}`);

    var bg_load = g.rectangle(
        g.canvas.width,
        g.canvas.height,
        "#8CC152"
    );
    bg_load.setPosition(0, 0);
    var bg_loadBar = bg_load.addChild(
        g.rectangle(
            g.stage.halfWidth,
            40,
            "#AAB2BD"
        )
    );
    bg_load.putCenter(bg_loadBar);
    var loadBar = bg_loadBar.addChild(
        g.rectangle(
            bg_loadBar.width / 100 * g.loadingProgress,
            bg_loadBar.height,
            "#3BAFDA"
        )
    );
    var loadText = bg_loadBar.addChild(
        g.text(
            Math.round(g.loadingProgress) + "%",
            "16px Arial",
            "black"
        )
    );
    bg_loadBar.putCenter(loadText);
    var loadingText = bg_loadBar.addChild(
        g.text(
            g.loadingFile,
            "12px Arial",
            "black"
        )
    );
    bg_loadBar.putBottom(loadingText);
}

let seedR,
    seed,
    tNr = 8,
    tSize,
    fpsi = 0,
    cntr;

let chancesRef,
    chances;

let inv, // Inventory
    blcks, // Blocks/ Tiles
    // blcks_ds, // Block-Densities
    blcks_ds2, // Block-Densities 2 (inverted)
    objs, // Random-spawned objects
    pobjs; // Player-made Objects

let chrs, // Characters
    sChrs, // Selected Characters
    chrsTP, // Character-Text-Popups
    chrsAL; // Character-Act-Lines

var music;

var header,
    playBtn,
    pauseBtn,
    pauseRBtn,
    pauseMBtn;



var makeBlock = function makeBlock(bx, by, r, chnc) {
    var b = g.rectangle(
        tSize,
        tSize,
        chnc.clr
    );

    var bA = b.addChild(
        g.text(
            chnc.rsrcs.a,
            "10px Arial",
            "white"
        )
    );
    b.putCenter(bA);

    b.chnc = chnc;
    b.r = r;

    b.setPosition(bx * tSize, by * tSize);

    b.vx = 0;
    b.vy = 0;

    blcks.children[by].addChild(b);
};

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



function initGame(seedR2) {
    g.s.game.s = {
        assets: g.group(),
        overlays: g.group()
    };
    g.s.game.s.overlays.add(pauseBtn);

    blcks = g.group();
    objs = g.group();
    pobjs = g.group();

    chrs = g.group();
    chrsTP = g.group();
    chrsAL = g.group();

    chrsAL.visible = false

    chancesRef = {
        "dirt": 0
    };
    chances = [{
        "l": "dirt", // label
        "clr": "#AA8E69", // colour
        "c": 10, // chance
        "ds": 1,
        /* "density speed", how fast to travel
        A weight of 0 denotes a wall.
        A weight cannot be negative.
        A weight cannot be between 0 and 1 (exclusive).
        A weight can contain decimal values (greater than 1).
        */
        "rsrcs": { // resources
            "a": -1, // amount (-2 = infinite, -1 = none, 0 = depleted)
            "cd": 1, // cooldown in seconds, to prevent click-spamming (bringt hier aba nix, weil a=-1 is)
            "d": 5, // degrade-time in seconds (-1 = infinite)
            "dT": { // degrades to..
                "dirt": 25,
                "grass": 40,
                "wood": 5,
                "water": 15,
                "rocks": 15
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

                // console.log(ptO + x + " :: " + (eval("typeof " + ptO + x)) + " :: " + y);
                if (eval("typeof " + ptO + x + " !== \"" + y + "\"")) {
                    nerr = false;
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
        "grass",
        "#8CC152",
        55,
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
        "#2ABA66",
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
        "water",
        "#3BAFDA",
        13,
        0, {
            "a": -2,
            "cd": 2,
            "d": 70,
            "dT": {
                "dirt": 25,
                "grass": 32,
                "wood": 7,
                "water": 20,
                "rocks": 16
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

    inv = {
        // wood: 4 // 4 * wood
    };

    makeChar(0 + tSize / 2, 0 + tSize / 2, "Light", 15, [
        "waterwalker"
    ]);

    var seedR2 = seedR2 || parseInt(Math.random() * 100 + 1);
    seedR = seedR2;
    seed = Math.seed(seedR)();
    console.log(seedR2 + " :: " + seed);

    var blcks_ds = [];

    for (var i = 0; i < tNr; i++) {
        var ri = Math.seed(seed * (i * tSize + 1))();
        blcks.addChild(g.group());
        blcks_ds[i] = [];

        for (var i2 = 0; i2 < tNr; i2++) {
            var ri2 = Math.seed(ri * (i2 * tSize + 1))();

            for (var cir = 0; cir < chances.length && ri2 >= chances[cir].c2; cir++);

            var chnc = JSON.parse(JSON.stringify(chances[cir]));

            makeBlock(i2, i, ri2, chnc);

            blcks_ds[i][i2] = chnc.ds;

            // console.log(i + " :: " + i2 + " :: " + ri2, chnc);
        }
    }

    blcks_ds2 = blcks_ds;

    // blcks_ds2 = blcks_ds[0].map(function(col, i) {
    //     return blcks_ds.map(function(row) {
    //         return row[i];
    //     });
    // });
    // blcks_ds2 = blcks_ds2[0].map(function(col, i) {
    //     return blcks_ds2.map(function(row) {
    //         return row[i];
    //     });
    // });

    // console.log(blcks_ds2);

    g.s.game.s.assets.add(blcks, objs, pobjs, chrs);
}

function setup() {
    music = g.sound("audio/soundtrack/Rebouz - Raindrops.mp3");
    music.loop = true;
    music.volume = 0.0175;
    // music.play();

    g.s.main = g.group();
    g.s.game = g.group();
    g.s.game.s = {
        assets: g.group(),
        overlays: g.group()
    };
    g.s.pause = g.group();

    var bg_main = g.rectangle(
        g.stage.width,
        g.stage.height,
        "#8CC152"
    );
    bg_main.setPosition(0, 0);
    var bg_pause = g.rectangle(
        g.stage.width,
        g.stage.height,
        "#8CC152"
    );

    // Doesn't quite do anything, because the game-screen isn't getting drewn
    // bg_pause.alpha = 0.5;

    bg_pause.setPosition(0, 0);

    // header = g.sprite("images/header.png");
    // header.setPosition(g.stage.halfWidth - header.halfWidth, g.stage.halfHeight - header.halfHeight);
    header = g.text(
        "NoNameSim",
        "54px Arial",
        "black"
    );
    var header2 = header.addChild(
        g.text(
            "NoNameSim",
            "56px Arial",
            "white"
        )
    );
    header.putCenter(header2);
    g.stage.putCenter(header);

    playBtn = g.text(
        "Play",
        "27px Arial",
        "black"
    );
    header.putBottom(playBtn);
    playBtn.interact = true;
    playBtn.release = () => {
        initGame();
        g.state = game;
    };

    pauseBtn = g.text(
        "||",
        "15px Arial",
        "white"
    );
    var pauseBtn2 = pauseBtn.addChild(
        g.text(
            "||",
            "13px Arial",
            "black"
        )
    );
    pauseBtn.putCenter(pauseBtn2);
    pauseBtn.setPosition(10, 10);
    pauseBtn.release = () => {
        g.state = pause;
    };

    pauseRBtn = g.text(
        "Resume",
        "13.5px Arial",
        "black"
    );
    g.stage.putCenter(pauseRBtn);
    pauseRBtn.release = () => {
        g.state = game;
    };
    pauseMBtn = g.text(
        "Main menu",
        "13.5px Arial",
        "black"
    );
    pauseRBtn.putBottom(pauseMBtn);
    pauseMBtn.release = () => {
        g.state = main;
    };

    g.s.main.add(bg_main, header, playBtn);
    g.s.game.s.overlays.add(pauseBtn);
    g.s.pause.add(bg_pause, pauseRBtn, pauseMBtn);

    g.state = main;
}

var acts = {
    "gather": function(chr, cI) {
        var b = blcks.children[chr.cacty].children[chr.cactx];

        var iI = b.chnc.rsrcs.a === -2;
        if (b.chnc.rsrcs.a > 0 || iI) {
            if (chr.invc < chr.invcm) {

                // console.log("'" + chr.n + "' (#" + cI + ") gathering " + b.chnc.l + " at " + chr.cactx + ", " + chr.cacty, b.chnc);

                if (!iI)
                    b.chnc.rsrcs.a--;

                var collected = false;
                if (typeof chr.inv[b.chnc.l] === "undefined") {
                    chr.inv[b.chnc.l] = 1;
                    chr.invc++;
                    collected = true;
                } else {
                    chr.inv[b.chnc.l]++;
                    chr.invc++;
                    collected = true;
                }
                if (collected)
                    ChrTextPop(cI, b.chnc.l + " +1", "black");

                chr.cldwn = b.chnc.rsrcs.cd;

                blcks.children[chr.cacty].children[chr.cactx] = b;

                chrs.children[cI].c = chr;
            } else {
                ChrTextPop(cI, "Inventory full", "red");
            }
        }
    }
};

var ChrTextPop = function ChrTextPop(cI, text, clr) {
    var chrTP = g.text(
        text,
        "8px Arial",
        clr
    );

    chrs.children[cI].putCenter(chrTP);
    chrs.children[cI].putTop(chrTP);

    chrTP.setPivot(0.5, 0.5);

    chrTP.vy = -1;

    chrsTP.addChild(chrTP);

    var dIF = 60;
    (function(_cI, _chrTP) {
        var chrTPani = g.fadeOut(_chrTP, dIF, 0);
        var chrTPani2 = g.breathe(_chrTP, 1.6, 1.2, dIF / 2);
        chrTPani.onComplete = () => {
            try {
                g.remove(_chrTP);
            } catch (err) {

            }
        };
    })(cI, chrTP);
}

function moveChr(cI, byTo, bxTo, actI) {
    if (chrs.children[cI] && blcks_ds2[byTo][bxTo] && acts[actI]) {
        var chrC = chrs.children[cI];
        var chr = chrC.c;

        // console.log(chrC, chr);

        var graph = new Graph(blcks_ds2, {
            "diagonal": true
        });
        var start = graph.grid[chr.bx][chr.by];
        var end = graph.grid[bxTo][byTo];
        var result = astar.search(graph, start, end, {
            "closest": true,
            "heuristic": astar.heuristics.diagonal
        });

        chr.movearr = result;

        chr.cactx = bxTo;
        chr.cacty = byTo;
        chr.cactI = actI;

        chrC.c = chr;
    }
}

function ButtonInteracts() {
    if (g.s.game.visible === true) {
        pauseBtn.interact = true;

        g.pointer.tap = () => {
            var px = g.pointer.x - g.borderSize,
                py = g.pointer.y - g.borderSize;

            var pbx = Math.floor(px / tSize % tNr),
                pby = Math.floor(py / tSize % tNr);

            // console.log(px, py, pbx, pby);

            moveChr(0, pby, pbx, "gather");
        };
    } else {
        pauseBtn.interact = false;

        g.pointer.tap = () => {};
    }
    if (g.s.main.visible === true) {
        playBtn.interact = true;
    } else {
        playBtn.interact = false;
    }
    if (g.s.pause.visible === true) {
        pauseRBtn.interact = true;
        pauseMBtn.interact = true;
    } else {
        pauseRBtn.interact = false;
        pauseMBtn.interact = false;
    }
}

function setScreen(nS) {
    // console.log("Screen:", nS);
    for (var x in g.s) {
        g.s[x].visible = x === nS;
        if (x === "game") {
            for (var x2 in g.s[x].s) {
                g.s[x].s[x2].visible = x === nS;
            }
        }
    }
    ButtonInteracts();
}

function main() {
    setScreen("main");
}

function pause() {
    setScreen("pause");
}

function game() {
    setScreen("game");

    var uDone = false;
    if (fpsi >= g.fps) {
        fpsi = 0;
        cntr++;
        uDone = true;
        // console.log("UDONE", uDone);
    }

    for (var i = 0; i < blcks.children.length; i++) {
        var blcksI = blcks.children[i];
        for (var i2 = 0; i2 < blcksI.children.length; i2++) {
            var b = blcksI.children[i2];

            if (uDone) {
                if (b.chnc.rsrcs.d > 0) {
                    //b.chnc.rsrcs.d--;
                }

                var
                    topT = i === 0,
                    leftT = i2 === 0,
                    rightT = i2 === tNr - 1,
                    bottomT = i === tNr - 1,
                    rid;

                rid = (topT ? blcks.children[i + 1].children[i2].r : 0);
                rid += (leftT ? blcks.children[i].children[i2 + 1].r : 0);
                rid += (rightT ? blcks.children[i].children[i2 - 1].r : 0);
                rid += (bottomT ? blcks.children[i - 1].children[i2].r : 0);

                // console.log(i + " :: " + rid);
                if (!topT && !leftT && !rightT && !bottomT) {
                    // console.log(i + " :: " + i2);
                    rid += blcks.children[i + 1].children[i2].r +
                        blcks.children[i].children[i2 + 1].r +
                        blcks.children[i].children[i2 - 1].r +
                        blcks.children[i - 1].children[i2].r;
                }

                /*console.log("A: " + b.r + " :: " + b.chnc.rsrcs.d
                    + " :: " + b.chnc.rsrcs.a + " :: " + rid);*/
                b.r = Math.seed(b.r * (b.chnc.rsrcs.d / 100.0 + 1) *
                    (b.chnc.rsrcs.a + 3) * rid)();
                // console.log("A2: " + b.r);

                if (b.chnc.rsrcs.d === 0 || b.chnc.rsrcs.a === 0) {
                    var ri2 = Math.seed(b.r * cntr)();
                    /*
                    for (var cir = 0; cir < b.chnc.rsrcs.dT.length && ri2 >= b.chnc.rsrcs.dT[cir][2]; cir++);
                    */
                    var cir;
                    for (var cir2 in b.chnc.rsrcs.dT) {
                        if (ri2 >= b.chnc.rsrcs.dT[cir2]) {
                            // console.log("B: " + i + " :: " + i2 + " :: " + cir);
                            continue;
                        } else {
                            cir = cir2;
                            break;
                        }
                    }
                    /* console.log("C: " + b.r + " :: " + cntr + " :: " + ri2
                        + " :: " + b.chnc.rsrcs.dT["dirt"] + " :: " + cir);
                    */

                    var chnc = JSON.parse(JSON.stringify(chances[chancesRef[cir]]));

                    console.log("Assigning new chance to ", i, i2, b.r, b.chnc, chnc);

                    b.r = ri2;
                    b.chnc = chnc;

                    console.log(blcks_ds2.length - i, i, i2);
                    // blcks_ds2[i][i2] = b.chnc.ds;
                    blcks_ds2[blcks_ds2.length - i][i2] = b.chnc.ds;
                }

                b.fillStyle = b.chnc.clr;

                b.children[0].text = b.chnc.rsrcs.a;
                b.putCenter(b.children[0]);

                // console.log(i, i2, blcks.children[i].children[i2], b);
                blcks.children[i].children[i2] = b;
            }
        }
    }

    for (var i in chrs.children) {
        var chrC = chrs.children[i];

        let collision = g.contain(chrC, g.stage, false);

        var chr = chrC.c;

        if (uDone) {
            if (chr.cmove) {
                chr.bx = chr.cmove.x;
                chr.by = chr.cmove.y;
            }

            if (chr.movearr.length > 0) {
                var b = chr.movearr.shift();

                chr.cmove = b;
            } else {
                chr.cmove = false;
                chrC.vx = 0;
                chrC.vy = 0;

                if (chr.cactI && chr.cldwn === 0) {
                    acts[chr.cactI](chr, i);
                }

                if (chr.cldwn > 0) {
                    chr.cldwn--;
                }

                chrC.c = chr;
            }
        }

        if (chr.cmove) {
            var b = chr.cmove;
            // console.log(">Move", b);

            // Direction
            var bcx = b.x - chr.bx,
                bcy = b.y - chr.by;

            // Goal-Coors
            var gbx = b.x * tSize + tSize / 2,
                gby = b.y * tSize + tSize / 2;

            // Cur-Coors
            var cbx = chr.bx * tSize + tSize / 2,
                cby = chr.by * tSize + tSize / 2;

            var bcx2 = gbx - cbx,
                bcy2 = gby - cby;

            // chrC.vx = bcx2 / g.fps;
            // chrC.vy = bcx2 / g.fps;
            var nx = chrC.x + bcx2 / g.fps,
                ny = chrC.y + bcy2 / g.fps;
            chrC.setPosition(nx, ny);

            chrC.c = chr;
        }

        if (chr.children.actline)
            g.remove(chr.children.actline);

        chr.children.actline = g.line(
            blcks.children[chr.cacty].children[chr.cactx].chnc.clr,
            4,
            chrC.centerX,
            chrC.centerY,
            blcks.children[chr.cacty].children[chr.cactx].centerX,
            blcks.children[chr.cacty].children[chr.cactx].centerY
        );
        chrsAL.addChild(chr.children.actline);

        chrC.layer = 1;

        // console.log(chrC, chr);
        g.move(chrC);
    }

    for (var i in chrsTP.children) {
        var chrTP = chrsTP.children[i];

        g.move(chrTP);
    }

    fpsi++;
}

let g = hexi(
    512,
    512,
    setup,
    thingsToLoad,
    load
);
tSize = g.canvas.width / tNr;

g.fps = 30;
g.borderSize = 0;
g.border = g.borderSize + "px #3BAFDA solid";
g.backgroundColor = 0x000000;

g.scaleToWindow();
//Scale the html UI <div> container
scaleToWindow(document.querySelector("#ui"));
window.addEventListener("resize", function(event) {
    scaleToWindow(document.querySelector("#ui"));
});

g.s = [];

g.start();