export class ReferenceCache {
    constructor() {
        this.cache = {};
    }

    hasReference({referenceId}) {
        return this.cache[referenceId] !== null && this.cache[referenceId] !== undefined;
    }

    getReference({referenceId}) {
        if (!this.hasReference({referenceId})) {
            throw new Error(`No entry in cache for reference id ${referenceId}`);
        }
        return this.cache[referenceId];
    }

    updateReference({referenceId, data}) {
        if (!referenceId) {
            throw new TypeError('Reference id is required');
        }
        if (!data) {
            throw new TypeError('Data is required');
        }
        this.cache[referenceId] = data;
    }
}
