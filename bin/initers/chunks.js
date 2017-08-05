function initChunks(iX, iY, sX, sY) {
    var iX = iX || 3;
    var iY = iY || 3;
    var sX = sX || 0;
    var sY = sY || 0;

    console.log(iX, iY, sX, sY);

    chnks = {};
    chnks2 = g.group();

    var blcks_ds = [];

    for (var i = sX; i < sX + iX; i++) {
        for (var i2 = sY; i2 < sY + iY; i2++) {
            var newChnk = g.group();

            console.log("Setting chunks position", i, i2, i * tSize * tNr, i2 * tSize * tNr);
            newChnk.setPosition(i * tSize * tNr, i2 * tSize * tNr);

            var chnk = makeChunk(i, i2);
            console.log(chnk);
            for (var i3 = 0; i3 < chnk.length; i3++) {
                var nCr = newChnk.addChild(g.group());

                for (var i4 = 0; i4 < chnk[i3].length; i4++) {
                    var cd = chnk[i3][i4];
                    var mb = makeBlock(i, i2, i4, i3, cd.r, cd.chnc);
                    nCr.addChild(mb);
                }

                // newChnk.addChild(g.group());

                // for (var i4 = 0; i4 < chnk[i3].length; i4++) {
                //     newChnk.children[i3].addChild(chnk[i3][i4]);
                // }
            }

            chnks2.addChild(newChnk);
        }
    }

    blcks_ds2 = blcks_ds;

    // blcks_ds2 = blcks_ds[0].map(function(col, i) {
    //     return blcks_ds.map(function(row) {
    //         return row[i];
    //     });
    // });

    // console.log(blcks_ds2);
}