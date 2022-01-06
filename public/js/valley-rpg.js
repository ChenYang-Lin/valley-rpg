import MainScene from "./MainScene.js";
// import InventoryScene from "./InventoryScene.js";
// import CraftingScene from "./CraftingScene.js";

let zoom = 1;

const config = {
    width: window.innerWidth / zoom,
    height: window.innerHeight / zoom,
    backgroundColor: "#999999",
    type: Phaser.AUTO,
    parent: "valley-rpg",
    scene: [MainScene],
    scale: {
        zoom: zoom,
    },
    pixelArt: true,
    physics: {
        default: "matter",
        matter: {
            debug: true,
            gravity: { y: 0 },
        }
    },
    plugins: {
        scene: [
            {
                plugin: PhaserMatterCollisionPlugin.default,
                key: "mattercollision",
                mapping: "mattercollision",
            }
        ]
    }
}

const game = new Phaser.Game(config);

// Resize Display
window.addEventListener('resize', () => {
    game.scale.resize(window.innerWidth / zoom, window.innerHeight / zoom);
});

// Full Screen
document.querySelector("#fullscreen").addEventListener("click", toggleFullScreen);
function toggleFullScreen() {
    if ((document.fullScreenElement && document.fullScreenElement !== null) ||
        (!document.mozFullScreen && !document.webkitIsFullScreen)) {
        if (document.documentElement.requestFullScreen) {
            document.documentElement.requestFullScreen();
        } else if (document.documentElement.mozRequestFullScreen) {
            document.documentElement.mozRequestFullScreen();
        } else if (document.documentElement.webkitRequestFullScreen) {
            document.documentElement.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT);
        }
    } else {
        if (document.cancelFullScreen) {
            document.cancelFullScreen();
        } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
        } else if (document.webkitCancelFullScreen) {
            document.webkitCancelFullScreen();
        }
    }
}

