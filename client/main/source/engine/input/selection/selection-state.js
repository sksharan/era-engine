export class SelectionState {
    constructor() {
        if (new.target === SelectionState) {
            throw new Error('Cannot instantiate SelectionState directly');
        }
    }
    // Action to perform when transitioning into this state
    onEnter(sceneNode) {
        console.warn(`Called onEnter with sceneNode=${sceneNode}`);
    }
    // Returns the next state to transition to, otherwise returns null
    handleMouseDown(mouseX, mouseY, sceneNode) {
        console.warn(`Called handleMouseDown with mouseX=${mouseX}, mouseY=${mouseY}, sceneNode=${sceneNode}`);
        return null;
    }
    // Returns the next state to transition to, otherwise returns null
    handleMouseUp(mouseX, mouseY, sceneNode) {
        console.warn(`Called handleMouseUp with mouseX=${mouseX}, mouseY=${mouseY}, sceneNode=${sceneNode}`);
        return null;
    }
    // Returns the next state to transition to, otherwise returns null
    handleMouseMove(mouseX, mouseY, sceneNode) {
        console.warn(`Called handleMouseMove with mouseX=${mouseX}, mouseY=${mouseY}, sceneNode=${sceneNode}`);
        return null;
    }
    // Action to perform when transitioning out of this state
    onExit(sceneNode) {
        console.warn(`Called onExit with sceneNode=${sceneNode}`);
    }
}
