document.body.insertAdjacentHTML('afterbegin', '<canvas id="canvas" height="480" width="720"></canvas>');
const gl = document.getElementById('canvas').getContext('webgl');
export {gl};
