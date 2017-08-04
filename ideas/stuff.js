var fI = 0;
for (var i = 0; i < g.stage.height; i += tSize) {
    var ri = Math.seed(seed * (i + 1))();
    //console.log(i + " :: " + ri);
    blcks.addChild(g.group());

    var fI2 = 0;
    for (var i2 = 0; i2 < g.stage.width; i2 += tSize) {
        var ri2 = Math.seed(ri * (i2 + 1))();
        //console.log(i2 + " :: " + ri2);

        for (var cir = 0; cir < chances.length && ri2 >= chances[cir].c2; cir++);

        var chnc = JSON.parse(JSON.stringify(chances[cir]));

        makeBlock(fI, fI2, ri2, chnc);

        // console.log(i + " :: " + fI + " :: " + i2 + " :: " + fI2 + " :: " + ri2, chnc);

        fI2++;
    }
    fI++;
}





var blcks_ds = [];

for (var i = 0; i < blcks.children.length; i++) {
    var blcksI = blcks.children[i];
    blcks_ds[i] = [];
    for (var i2 = 0; i2 < blcksI.children.length; i2++) {
        var b = blcksI.children[i2];
        blcks_ds[i][i2] = b.chnc.ds;
    }
}

// console.log(blcks_ds);

var blcks_ds2 = blcks_ds[0].map(function(col, i) {
    return blcks_ds.map(function(row) {
        return row[i];
    });
});