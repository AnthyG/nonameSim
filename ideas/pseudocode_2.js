var chnks;

function setup() {
    chnks = g.group();
}

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

    chnks.children[Cy].children[Cx].children[bx]
};

var makeChunk = function makeChunk(x, y) {
    if (!chnks.children[y]) {
        chnks.children[y] = g.group(); // Y-Chunk-Lane
    }

    var chnk = g.group(); // Chnk
    chnks.children[y].children[x] = chnk; // Chnk in Y-Lane @ x

    for (var i = 0; i < tNr; i++) {
        var ri = Math.seed(seed * (i * tSize + 1))();

        chnks.children[Cy].children[Cx].children[i] = g.group(); // Chnk 

        for (var i2 = 0; i2 < tNr; i2++) {
            var ri2 = Math.seed(ri * (i2 * tSize + 1))();

            for (var cir = 0; cir < chances.length && ri2 >= chances[cir].c2; cir++);

            var chnc = JSON.parse(JSON.stringify(chances[cir]));

            makeBlock(Cx, Cy, i2, i, ri2, chnc)
        }
    }
};