// Test-specific behavior
const canvas = document.getElementById('canvas');
if (!canvas) {
    console.warn('No canvas detected, adding canvas to document');
    document.body.insertAdjacentHTML('beforeend', '<canvas id="canvas" height="720" width="1080"></canvas>');
}

const gl = document.getElementById('canvas').getContext('webgl');
export {gl};
