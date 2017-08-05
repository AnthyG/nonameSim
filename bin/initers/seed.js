function initSeed(seedR2) {
    var seedR2 = seedR2 || parseInt(Math.random() * 100 + 1);
    seedR = seedR2;
    seed = Math.seed(seedR)();
    console.log(seedR2 + " :: " + seed);
}