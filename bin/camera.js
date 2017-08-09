function renderCam(vp, sX, sY) {
    var vp = vp || 1;
    var sX = sX || 0;
    var sY = sY || 0;

    if (vp !== oldcam.vp || sX !== oldcam.x || sY !== oldcam.y) {
        oldcam = {
            "x": sX,
            "y": sY,
            "vp": vp
        };

        chnks = {};
        chnks2 = g.group();

        var blcks_ds = [];

        for (var i = sX - vp; i < sX + vp + 1; i++) {
            for (var i2 = sY - vp; i2 < sY + vp + 1; i2++) {
                var newChnk = g.group();

                console.log("Setting chunks position", i, i2, i * tSize * tNr, i2 * tSize * tNr);
                newChnk.setPosition(i2 * tSize * tNr, i * tSize * tNr);

                var chnk = makeChunk(i, i2);
                console.log(chnk);
                for (var i3 = 0; i3 < chnk.length; i3++) {
                    var nCr = newChnk.addChild(g.group());

                    for (var i4 = 0; i4 < chnk[i3].length; i4++) {
                        var cd = chnk[i3][i4];
                        var mb = makeBlock(i, i2, i3, i4, cd.r, cd.chnc);
                        nCr.addChild(mb);
                    }
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
    } else {
        // console.log("SAME", sX, sY, vp, oldcam, cam);
    }
}