var chnks = {
    // "0,0": [
    //     [0, 1, 2],
    //     [0, 1, 2],
    //     [0, 1, 2]
    // ],
    // "1,0": chnk,
    // "2,0": chnk,

    // "0,1": chnk,
    // "1,1": chnk,
    // "2,1": chnk,

    // "0,2": chnk,
    // "1,2": chnk,
    // "2,2": chnk
};

var makeBlock = function makeBlock(Cx, Cy, bx, by, r, chnc) {
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
        topC = chnks.hasOwnProperty(x + "," + y - 1),
        leftC = chnks.hasOwnProperty(x - 1 + "," + y),
        rightC = chnks.hasOwnProperty(x + 1 + "," + y),
        bottomC = chnks.hasOwnProperty(x + "," + y + 1);

    console.log(chnks, topC, rightC, bottomC, leftC);

    // first is 0,0
    // it has no neighbors (all 4 above vars = false),
    // so it has to randomly generate all 4 corners

    // Generate Chunk-ri
    var ri = Math.seed(seed * (y + 1))();
    var ri2 = Math.seed(ri * (x + 1))();

    console.log(ri2);

    // All following `tNr`'s are -1 because array's start with 0, not 1.
    var tNr1 = tNr - 1;

    // Generate Chunk's Corners-ri's (y) and ri2's (x)
    var ris = [];
    var ris2 = [];

    // Top left
    ris[0] = Math.seed(ri2 * (0 * tSize + 1))();
    ris2[0] = (
        leftC ? chnks[x - 1 + "," + y][0][tNr1].r :
        (
            topC ? chnks[x + "," + y - 1][tNr1][0].r :
            Math.seed(ris[0] * (0 * tSize + 1))()
        )
    );
    // Top right
    ris[1] = Math.seed(ri2 * (0 * tSize + 1))();
    ris2[0] = (
        topC ? chnks[x + "," + y - 1][tNr1][tNr1].r :
        (
            rightC ? chnks[x + 1 + "," + y][0][0].r :
            Math.seed(ris[1] * (tNr1 * tSize + 1))()
        )
    );
    // Bottom left
    ris[2] = Math.seed(ri2 * (tNr1 * tSize + 1))();
    ris2[0] = (
        leftC ? chnks[x - 1 + "," + y][tNr1][tNr1].r :
        (
            bottomC ? chnks[x + "," + y + 1][0][0].r :
            Math.seed(ris[2] * (0 * tSize + 1))()
        )
    );
    // Bottom right
    ris[3] = Math.seed(ri2 * (tNr1 * tSize + 1))();
    ris2[0] = (
        bottomC ? chnks[x + "," + y + 1][0][tNr1].r :
        (
            rightC ? chnks[x + 1 + "," + y][tNr1][0].r :
            Math.seed(ris[3] * (tNr1 * tSize + 1))()
        )
    );

    console.log(ris2);

    // Do the chnc-thingies
    var fchncs = [];

    for (var i = 0; i < 4; i++) {
        for (var cir = 0; cir < chances.length && ris2[i] >= chances[cir].c2; cir++);
        fchncs[i] = JSON.parse(JSON.stringify(chances[cir]));
    }

    console.log(fchncs);

    // Add the blocks to the chnk
    chnk[0][0] = makeBlock(x, y, 0, 0, ris2[0], fchncs[0]);
    chnk[tNr1][0] = makeBlock(x, y, tNr1, 0, ris2[1], fchncs[1]);
    chnk[0][tNr1] = makeBlock(x, y, 0, tNr1, ris2[2], fchncs[2]);
    chnk[tNr1][tNr1] = makeBlock(x, y, tNr1, tNr1, ris2[3], fchncs[3]);

    console.log(chnk[0], chnk[tNr1]);

    // Generate all in-between tiles for the left side
    var eiA = interpolationArray(
        chancesRef[fchncs[0].l],
        chancesRef[fchncs[2].l],
        tNr
    );
    console.log("Left", eiA);
    for (var i = 0; i < eiA.length; i++) {
        var _ri = Math.seed(ri2 * (0 * tSize + 1))();
        var _ri2 = Math.seed(ris[0] * (i * tSize + 1))();

        var cir = eiA[i];
        var chnc2 = JSON.parse(JSON.stringify(chances[cir]));

        chnk[i + 1][0] = makeBlock(x, y, 0, i + 1, _ri2, chnc2);
    }

    // Generate all in-between tiles for the right side
    var eiA = interpolationArray(
        chancesRef[fchncs[1].l],
        chancesRef[fchncs[3].l],
        tNr
    );
    console.log("Right", eiA);
    for (var i = 0; i < eiA.length; i++) {
        var _ri = Math.seed(ri2 * (0 * tSize + 1))();
        var _ri2 = Math.seed(ris[0] * (i * tSize + 1))();

        var cir = eiA[i];
        var chnc2 = JSON.parse(JSON.stringify(chances[cir]));

        chnk[i + 1][tNr1] = makeBlock(x, y, tNr1, i + 1, _ri2, chnc2);
    }

    console.log(chnk);

    // Generate all in-between tiles for the y-axis
    for (var i = 0; i < tNr; i++) {
        // console.log(i, chnk[i], chnk[i][0].chnc.l, chnk[i][tNr1].chnc.l);
        var eiA = interpolationArray(
            chancesRef[chnk[i][0].chnc.l],
            chancesRef[chnk[i][tNr1].chnc.l],
            tNr
        );
        // console.log(eiA);
        for (var i2 = 0; i2 < eiA.length; i2++) {
            var _ri = Math.seed(ri2 * (i2 * tSize + 1))();
            var _ri2 = Math.seed(ris[0] * (i * tSize + 1))();

            var cir = eiA[i2];
            var chnc2 = JSON.parse(JSON.stringify(chances[cir]));

            chnk[i][i2] = makeBlock(x, y, i, i2, _ri2, chnc2);
        }
        // console.log(chnk[i]);
    }

    console.log(chnk);

    /*
    for (var i in firstTiles) {
        var i2 = firstTiles[i];

        var ri = Math.seed(seed * (i * tSize + 1))();
        var ri2 = Math.seed(ri * (i2 * tSize + 1))();

        for (var cir = 0; cir < chances.length && ri2 >= chances[cir].c2; cir++);

        var chnc = JSON.parse(JSON.stringify(chances[cir]));

        makeBlock(x, y, 0, 0, ri2, chnc);
    }
    */

    chnks[x + "," + y] = chnk;

    return chnk;
};