
// export const width = window.innerWidth / zoom;
// export const height = window.innerHeight / zoom;
export const width = 480;
export const height = 270;
// export const width = 960;
// export const height = 540;

export const tileSize = 32;

// Current Scene
let currScene = null;
export const setCurrScene = (scene) => {
    currScene = scene;
}
export const getCurrScene = () => {
    return currScene;
}

// Mobile
let mobile = false;
export const setMobile = (isMobile) => {
    mobile = isMobile;
}
export const getMobile = (isMobile) => {
    return mobile;
}