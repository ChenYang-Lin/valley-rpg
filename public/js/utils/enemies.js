const enemies = [
    {
        name: "bear",
        properties: [
            {
                name: 'drops',
                type: 'string',
                value: "[\"fur\",\"meat\"]",
            },
            {
                name: 'health',
                type: 'int',
                value: 10,
            },
        ],
        x: 328,
        y: 96,
    },
    {
        name: "ent",
        properties: [
            {
                name: 'drops',
                type: 'string',
                value: "[\"health_potion\",\"wand_fire\"]",
            },
            {
                name: 'health',
                type: 'int',
                value: 8,
            },
        ],
        x: 416,
        y: 224,
    },
    {
        name: "wolf",
        properties: [
            {
                name: 'drops',
                type: 'string',
                value: "[\"meat\"]",
            },
            {
                name: 'health',
                type: 'int',
                value: 5,
            },
        ],
        x: 224,
        y: 448,
    },
]

export {
    enemies,
}