var makeBlock = function makeBlock(Cx, Cy, bx, by, r, chnc) {
    var cc = chnc.clr;
    if (typeof cc === "string") {
        var b = g.rectangle(
            tSize,
            tSize,
            cc,
            // "red",
            // 2
        );
    } else {
        var bFrames = [];

        if (cc.hasOwnProperty("A") && cc.A !== "") {
            for (var i = -2; i < chances[chancesRef[chnc.l]].rsrcs.a + 1; i++) {
                bFrames[i] = cc.A.replace(/\[A\]/gm, i) + ".png";
            }
        }
        for (var i in cc) {
            // console.log(i, cc[i], bFrames[i]);
            if (i !== "A" && typeof cc[i] === "string") {
                bFrames[i] = cc[i] + ".png";
            } else if (i !== "A") {
                // Play frames 10 to 15:
                // animatedSprite.playAnimation([10, 15]);

                bFrames[i] = cc[i] + ".png";

                // bFrames[i] = true;
                // if (cc[i][0] === true) {
                //     bFrames[i] = cc[i][1];
                // }
            }
        }

        // for (i = 0; i < chances[chancesRef[chnc.l]].rsrcs.a + 1; i++) {
        //     bFrames[i] = cc[i] + ".png";
        // }

        var b = g.sprite(
            bFrames,
            tSize,
            tSize
        );

        b.show(chnc.rsrcs.a);
    }

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

    b.setPosition(by * tSize, bx * tSize);

    b.vx = 0;
    b.vy = 0;

    return b;
};

var makeChunk = function makeChunk(x, y) {
    var chnk = [];

    for (var i = 0; i < tNr; i++) {
        chnk[i] = [];
    }

    var
        topC = chnks.hasOwnProperty(x + "," + (y - 1)),
        leftC = chnks.hasOwnProperty((x - 1) + "," + y),
        rightC = chnks.hasOwnProperty((x + 1) + "," + y),
        bottomC = chnks.hasOwnProperty(x + "," + (y + 1));

    // console.log(chnks,
    //     chnks[x + "," + (y - 1)],
    //     chnks[(x - 1) + "," + y],
    //     chnks[(x + 1) + "," + y],
    //     chnks[x + "," + (y + 1)]
    // );

    // console.log(x, y);
    // console.log(topC, rightC, bottomC, leftC);

    // first is 0,0
    // it has no neighbors (all 4 above vars = false),
    // so it has to randomly generate all 4 corners

    // Generate Chunk-ri (y) and ri2 (x)
    var ri = Math.seed(seed * (y + seed))();
    var ri2 = Math.seed(ri * (x + seed))();

    // console.log(ri2);

    // All following `tNr`'s are -1 because array's start with 0, not 1.
    var tNr1 = tNr - 1;

    // Generate Chunk's Corners-ri's (y) and ri2's (x)
    var ris = [];
    var ris2 = [];

    // Top left
    ris[0] = Math.seed(ri2 * (0 * tSize + ri2))();
    ris2[0] = (
        leftC ? chnks[(x - 1) + "," + y][0][tNr1].r :
        (
            topC ? chnks[x + "," + (y - 1)][tNr1][0].r :
            Math.seed(ris[0] * (0 * tSize + ri2))()
        )
    );
    // Top right
    ris[1] = Math.seed(ri2 * (0 * tSize + ri2))();
    ris2[1] = (
        topC ? chnks[x + "," + (y - 1)][tNr1][tNr1].r :
        (
            rightC ? chnks[(x + 1) + "," + y][0][0].r :
            Math.seed(ris[1] * (tNr1 * tSize + ri2))()
        )
    );
    // Bottom left
    ris[2] = Math.seed(ri2 * (tNr1 * tSize + ri2))();
    ris2[2] = (
        leftC ? chnks[(x - 1) + "," + y][tNr1][tNr1].r :
        (
            bottomC ? chnks[x + "," + (y + 1)][0][0].r :
            Math.seed(ris[2] * (0 * tSize + ri2))()
        )
    );
    // Bottom right
    ris[3] = Math.seed(ri2 * (tNr1 * tSize + ri2))();
    ris2[3] = (
        bottomC ? chnks[x + "," + (y + 1)][0][tNr1].r :
        (
            rightC ? chnks[(x + 1) + "," + y][tNr1][0].r :
            Math.seed(ris[3] * (tNr1 * tSize + ri2))()
        )
    );

    // console.log(ris2);

    // Do the chnc-thingies
    var fchncs = [];

    for (var i = 0; i < 4; i++) {
        for (var cir = 0; cir < chances.length && ris2[i] >= chances[cir].c2; cir++);
        fchncs[i] = JSON.parse(JSON.stringify(chances[cir]));
    }

    // console.log(fchncs);

    // Add the blocks to the chnk
    chnk[0][0] = {
        r: ris2[0],
        chnc: fchncs[0]
    };
    chnk[tNr1][0] = {
        r: ris2[1],
        chnc: fchncs[1]
    };
    chnk[0][tNr1] = {
        r: ris2[2],
        chnc: fchncs[2]
    };
    chnk[tNr1][tNr1] = {
        r: ris2[3],
        chnc: fchncs[3]
    };
    // chnk[0][0] = makeBlock(x, y, 0, 0, ris2[0], fchncs[0]);
    // chnk[tNr1][0] = makeBlock(x, y, tNr1, 0, ris2[1], fchncs[1]);
    // chnk[0][tNr1] = makeBlock(x, y, 0, tNr1, ris2[2], fchncs[2]);
    // chnk[tNr1][tNr1] = makeBlock(x, y, tNr1, tNr1, ris2[3], fchncs[3]);

    // console.log(chnk[0][0], chnk[tNr1][0], chnk[0][tNr1], chnk[tNr1][tNr1]);

    // Generate all in-between tiles for the left side
    var eiA = interpolationArray(
        chancesRef[fchncs[0].l],
        chancesRef[fchncs[1].l],
        tNr1
    );
    // console.log("Left", eiA);
    for (var i = 0; i < eiA.length; i++) {
        var _ri = Math.seed(ri2 * (0 * tSize + seed))();
        var _ri2 = Math.seed(ris[0] * (i * tSize + seed))();

        var cir = eiA[i];
        var chnc2 = JSON.parse(JSON.stringify(chances[cir]));

        chnk[i + 1][0] = {
            r: _ri2,
            chnc: chnc2
        };
        // chnk[0][i + 1] = makeBlock(x, y, i + 1, 0, _ri2, chnc2);
    }

    // Generate all in-between tiles for the right side
    var eiA = interpolationArray(
        chancesRef[fchncs[2].l],
        chancesRef[fchncs[3].l],
        tNr1
    );
    // console.log("Right", eiA);
    for (var i = 0; i < eiA.length; i++) {
        var _ri = Math.seed(ri2 * (0 * tSize + seed))();
        var _ri2 = Math.seed(ris[0] * (i * tSize + seed))();

        var cir = eiA[i];
        var chnc2 = JSON.parse(JSON.stringify(chances[cir]));

        chnk[i + 1][tNr1] = {
            r: _ri2,
            chnc: chnc2
        };
        // chnk[tNr1][i + 1] = makeBlock(x, y, i + 1, tNr1, _ri2, chnc2);
    }

    // console.log(chnk);

    // Generate all in-between tiles for the y-axis
    for (var i = 0; i < tNr; i++) {
        // console.log(i, chnk[i][0].chnc.l, chnk[i][tNr1].chnc.l);

        var eiA = interpolationArray(
            chancesRef[chnk[i][0].chnc.l],
            chancesRef[chnk[i][tNr1].chnc.l],
            tNr
        );
        // console.log(eiA);
        for (var i2 = 0; i2 < eiA.length; i2++) {
            var _ri = Math.seed(ri2 * (i * tSize + seed))();
            var _ri2 = Math.seed(ris[0] * (i2 * tSize + seed))();

            var cir = eiA[i2];
            var chnc2 = JSON.parse(JSON.stringify(chances[cir]));

            chnk[i][i2] = {
                r: _ri2,
                chnc: chnc2
            };
            // chnk[i][i2] = makeBlock(x, y, i2, i, _ri2, chnc2);
        }
        // console.log(chnk[i]);
    }

    // console.log(chnk);

    chnks[x + "," + y] = chnk;

    return chnk;
};