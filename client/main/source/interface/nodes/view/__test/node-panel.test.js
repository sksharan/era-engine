import {assert} from 'chai'
import {createHierarchyFromNodes} from '../node-panel'

describe('Scene node panel', () => {

    describe('creating hierarchy from scene node list', () => {

        it('should be successful for empty list', () => {
            const hierarchy = createHierarchyFromNodes([]);
            const expectedHierarchy = {};
            assert.equal(JSON.stringify(hierarchy), JSON.stringify(expectedHierarchy));
        });

        it('should be successful for non-empty list', () => {
            const sceneNodes = [
                {path: 'a'},
                {path: 'a/d/e/f'},
                {path: 'a/d/g'},
                {path: 'b'},
                {path: 'b/d'},
                {path: 'b/d'},
                {path: 'c'},
                {path: 'a/d'},
                {path: 'a/d/e'},
            ];

            const expectedHierarchy = {
                "a": {
                    "hierarchy": {
                        "d": {
                            "hierarchy": {
                                "e": {
                                    "hierarchy": {
                                        "f": {
                                            "hierarchy": {},
                                            "sceneNodes": [{
                                                "path": "a/d/e/f"
                                            }]
                                        }
                                    },
                                    "sceneNodes": [{
                                        "path": "a/d/e"
                                    }]
                                },
                                "g": {
                                    "hierarchy": {},
                                    "sceneNodes": [{
                                        "path": "a/d/g"
                                    }]
                                }
                            },
                            "sceneNodes": [{
                                "path": "a/d"
                            }]
                        }
                    },
                    "sceneNodes": [{
                        "path": "a"
                    }]
                },
                "b": {
                    "hierarchy": {
                        "d": {
                            "hierarchy": {},
                            "sceneNodes": [{
                                "path": "b/d"
                            }, {
                                "path": "b/d"
                            }]
                        }
                    },
                    "sceneNodes": [{
                        "path": "b"
                    }]
                },
                "c": {
                    "hierarchy": {},
                    "sceneNodes": [{
                        "path": "c"
                    }]
                }
            };

            const hierarchy = createHierarchyFromNodes(sceneNodes);
            assert.equal(JSON.stringify(hierarchy), JSON.stringify(expectedHierarchy));
        });
    });

});
