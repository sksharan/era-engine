import {assert} from 'chai'
import {createHierarchyFromNodes} from '../hierarchy'

describe('Scene node panel', () => {

    describe('creating hierarchy from scene node list', () => {

        it('should be successful for empty list', () => {
            const hierarchy = createHierarchyFromNodes({sceneNodes: [], renderNodes: []});
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
            const renderNodes = [
                {data: 'A'},
                {data: 'A/D/E/F'},
                {data: 'A/D/G'},
                {data: 'B'},
                {data: 'B/D'},
                {data: 'B/D'},
                {data: 'C'},
                {data: 'A/D'},
                {data: 'A/D/E'},
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
                                            }],
                                            "renderNodes": [{
                                                "data": "A/D/E/F"
                                            }],
                                        }
                                    },
                                    "sceneNodes": [{
                                        "path": "a/d/e"
                                    }],
                                    "renderNodes": [{
                                        "data": "A/D/E"
                                    }],
                                },
                                "g": {
                                    "hierarchy": {},
                                    "sceneNodes": [{
                                        "path": "a/d/g"
                                    }],
                                    "renderNodes": [{
                                        "data": "A/D/G"
                                    }],
                                }
                            },
                            "sceneNodes": [{
                                "path": "a/d"
                            }],
                            "renderNodes": [{
                                "data": "A/D"
                            }],
                        }
                    },
                    "sceneNodes": [{
                        "path": "a"
                    }],
                    "renderNodes": [{
                        "data": "A"
                    }],
                },
                "b": {
                    "hierarchy": {
                        "d": {
                            "hierarchy": {},
                            "sceneNodes": [{
                                "path": "b/d"
                            }, {
                                "path": "b/d"
                            }],
                            "renderNodes": [{
                                "data": "B/D"
                            }, {
                                "data": "B/D"
                            }],
                        }
                    },
                    "sceneNodes": [{
                        "path": "b"
                    }],
                    "renderNodes": [{
                        "data": "B"
                    }],
                },
                "c": {
                    "hierarchy": {},
                    "sceneNodes": [{
                        "path": "c"
                    }],
                    "renderNodes": [{
                        "data": "C"
                    }],
                }
            };

            const hierarchy = createHierarchyFromNodes({sceneNodes, renderNodes});
            assert.equal(JSON.stringify(hierarchy), JSON.stringify(expectedHierarchy));
        });
    });

});
