"use strict";

let thingsToLoad = [
    "images/header.png",

    "bin/map.json",

    "images/water.json",
    "images/sand.json",
    "images/wood.json",

    "audio/soundtrack/Rebouz - Raindrops.mp3"
];

function load() {
    // //Display the file currently being loaded
    // console.log(`loading: ${g.loadingFile}`);

    // //Display the percentage of files currently loaded
    // console.log(`progress: ${g.loadingProgress}`);

    g.s.loading = g.group();

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

    if (g.loadingProgress === 100) {
        g.s.loading.visible = false;
        g.s.loading.renderable = false;
        g.s.loading.remove();
    }
}

let seedR,
    seed,
    tNr = 8,
    tSize,
    fpsi = 0,
    cntr;

let chancesRef,
    chances;

var cam,
    oldcam,
    chnks,
    chnks2;

let inv, // Inventory
    world;
// blcks, // Blocks/ Tiles
// // blcks_ds, // Block-Densities
// blcks_ds2, // Block-Densities 2 (inverted)
// objs, // Random-spawned objects
// pobjs; // Player-made Objects

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

function setup() {
    g.s.loading.visible = false;
    g.s.loading.renderable = false;
    g.s.loading.remove();

    music = g.sound("audio/soundtrack/Rebouz - Raindrops.mp3");
    music.loop = true;
    music.volume = 0.0175;
    // music.play();

    g.s.main = g.group();
    g.s.game = g.group();
    g.s.game.s = {
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
    header2.alpha = 0;
    g.fadeIn(header2, 60, false, "smoothstepCubed");

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
        initGame(38, 3, 3, 0, 0);
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

function none() {
    setScreen("none");
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

g.s = {};

g.start();