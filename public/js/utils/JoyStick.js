export default class JoyStick {
    constructor(scene) {
        this.scene = scene;
        console.log(scene);
        this.joyStick = scene.plugins.get('rexvirtualjoystickplugin').add(scene, {
            x: 400,
            y: 300,
            // radius: 100,
            base: scene.add.circle(0, 0, 100, 0x888888),
            thumb: scene.add.circle(0, 0, 50, 0xcccccc),
            // dir: '8dir',   // 'up&down'|0|'left&right'|1|'4dir'|2|'8dir'|3
            // forceMin: 16,
            // enable: true
        })
        this.scene.add.existing(this);
        //     .on('update', this.dumpJoyStickState, this);

        // this.text = this.add.text(0, 0);
        // this.dumpJoyStickState();
    }

    //     dumpJoyStickState() {
    //         var cursorKeys = this.joyStick.createCursorKeys();
    //         var s = 'Key down: ';
    //         for (var name in cursorKeys) {
    //             if (cursorKeys[name].isDown) {
    //                 s += `${name} `;
    //             }
    //         }

    //         s += `
    // Force: ${Math.floor(this.joyStick.force * 100) / 100}
    // Angle: ${Math.floor(this.joyStick.angle * 100) / 100}
    // `;

    //         s += '\nTimestamp:\n';
    //         for (var name in cursorKeys) {
    //             var key = cursorKeys[name];
    //             s += `${name}: duration=${key.duration / 1000}\n`;
    //         }
    //         this.text.setText(s);
    //     }

    static preload(scene) {
        let url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexvirtualjoystickplugin.min.js';
        scene.load.plugin('rexvirtualjoystickplugin', url, true);
    }
}