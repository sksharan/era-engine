export class RefNodeCache {
    constructor() {
        this.cache = {};
    }

    hasReference({referenceId}) {
        if (!referenceId) {
            throw new TypeError('Reference ID required');
        }
        return this.cache[referenceId] !== null && this.cache[referenceId] !== undefined;
    }

    getReference({referenceId}) {
        if (!referenceId) {
            throw new TypeError('Reference ID required');
        }
        if (!this.hasReference({referenceId})) {
            throw new Error(`No entry in cache for reference ID ${referenceId}`);
        }
        return this.cache[referenceId];
    }

    updateReference({referenceId, sceneNodes, renderNodes}) {
        if (!referenceId) {
            throw new TypeError('Reference ID required');
        }
        if (!sceneNodes) {
            throw new TypeError('Scene nodes required');
        }
        if (!renderNodes) {
            throw new TypeError('Render nodes required');
        }
        this.cache[referenceId] = {
            sceneNodes,
            renderNodes,
        };
    }
}
