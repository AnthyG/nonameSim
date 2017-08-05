function initGame(seedR2, iX, iY, sX, sY) {
    var iX = iX || 3;
    var iY = iY || 3;
    var sX = sX || 0;
    var sY = sY || 0;

    g.s.game.s = {
        bg: g.rectangle(
            g.stage.width,
            g.stage.height,
            "white"
        ),
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

    initChances();

    inv = {
        // wood: 4 // 4 * wood
    };

    makeChar(0 + tSize / 2, 0 + tSize / 2, "Light", 15, [
        "waterwalker"
    ]);

    initSeed(seedR2);

    fpsi = 0;
    cntr = 0;

    initChunks(iX, iY, sX, sY);

    g.s.game.s.assets.add(chnks2, blcks, objs, pobjs, chrs);

    g.s.game.s.bg.layer = 1;
    g.s.game.s.assets.layer = 2;
    g.s.game.s.overlays.layer = 3;
}