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
        overlays: g.group()
    };
    g.s.game.s.overlays.add(pauseBtn);

    initMap();

    g.loader.resources["bin/map.json"].data = mapJSON;
    world = g.makeTiledWorld("bin/map.json", "images/timeBombPanic.png");
}