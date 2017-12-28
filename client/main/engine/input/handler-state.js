import {NoneSelectedState} from './selection/index'
import {RootSceneNode} from '../index'

class HandlerState {
    constructor() {
        this._selectionState = new NoneSelectedState();
    }
    get selectionState() {
        return this._selectionState;
    }
    set selectionState(selectionState) {
        if (selectionState !== null) {
            this._selectionState.onExit(RootSceneNode);
            this._selectionState = selectionState;
            this._selectionState.onEnter(RootSceneNode);
        }
    }
}
export const CurrentHandlerState = new HandlerState();
