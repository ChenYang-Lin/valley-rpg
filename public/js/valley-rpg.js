/** @type {import("../phaser/typings/phaser")} */

import StartScene from "./scenes/StartScene.js";
import { width, height } from "./utils/utils.js";

const config = {
    width: width,
    height: height,
    backgroundColor: "#999999",
    type: Phaser.AUTO,
    parent: "valley-rpg",
    scene: [StartScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,

    },
    pixelArt: true,
    // render: {
    //     pixelArt: true,
    // },
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
                key: 'matterCollision',
                mapping: 'matterCollision',
            }
        ],
    }
}

const game = new Phaser.Game(config);

// Resize Display
// window.addEventListener('resize', () => {
//     game.scale.resize(window.innerWidth / zoom, window.innerHeight / zoom);
// });

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


// Check device
if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
    console.log("this device is mobile")
} else {
    console.log("this device is desktop")
}