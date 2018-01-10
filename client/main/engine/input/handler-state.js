import {NoneSelectedState} from './selection/index'
import {RootSceneNode} from '../index'
import {subscribeToNodeSelectedEvent} from '../../common/index'

class HandlerState {
    constructor() {
        this._selectionState = new NoneSelectedState();
        this._listenersInitialized = false;
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
    initListeners() {
        if (this._listenersInitialized) {
            return;
        }
        this._listenersInitialized = true;
        subscribeToNodeSelectedEvent((selectedObjectBaseNode) => {
            const nextState = this._selectionState.onNodeSelectedEvent(selectedObjectBaseNode);
            this.selectionState = nextState;
        });
    }
}
export const CurrentHandlerState = new HandlerState();
