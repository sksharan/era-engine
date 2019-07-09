import {assert} from 'chai';
import {createHierarchyFromNodes} from '../hierarchy';

describe('Scene node panel', () => {
    describe('creating hierarchy from scene node list', () => {
        it('should be successful for empty list', () => {
            const hierarchy = createHierarchyFromNodes({sceneNodes: [], renderNodes: []});
            const expectedHierarchy = {};
            assert.equal(JSON.stringify(hierarchy), JSON.stringify(expectedHierarchy));
        });

        it('should be successful for non-empty list', () => {
            // Hierarchy constructed from scene node paths
            const sceneNodes = [
                {path: 'a'},
                {path: 'a/d/e/f'},
                {path: 'a/d/g'},
                {path: 'b'},
                {path: 'b/d'}, // For duplicates, only one used in hierarchy
                {path: 'b/d'},
                {path: 'c'},
                {path: 'a/d'},
                {path: 'a/d/e'}
            ];
            // Render node structure could be anything
            const renderNodes = [
                {data: 'A'},
                {data: 'A/D/E/F'},
                {data: 'A/D/G'},
                {data: 'B'},
                {data: 'B/D'}, // For duplicates, only one used in hierarchy
                {data: 'B/D'},
                {data: 'C'},
                {data: 'A/D'},
                {data: 'A/D/E'}
            ];

            const expectedHierarchy = {
                a: {
                    hierarchy: {
                        d: {
                            hierarchy: {
                                e: {
                                    hierarchy: {
                                        f: {
                                            hierarchy: {},
                                            sceneNode: {
                                                path: 'a/d/e/f'
                                            },
                                            renderNode: {
                                                data: 'A/D/E/F'
                                            }
                                        }
                                    },
                                    sceneNode: {
                                        path: 'a/d/e'
                                    },
                                    renderNode: {
                                        data: 'A/D/E'
                                    }
                                },
                                g: {
                                    hierarchy: {},
                                    sceneNode: {
                                        path: 'a/d/g'
                                    },
                                    renderNode: {
                                        data: 'A/D/G'
                                    }
                                }
                            },
                            sceneNode: {
                                path: 'a/d'
                            },
                            renderNode: {
                                data: 'A/D'
                            }
                        }
                    },
                    sceneNode: {
                        path: 'a'
                    },
                    renderNode: {
                        data: 'A'
                    }
                },
                b: {
                    hierarchy: {
                        d: {
                            hierarchy: {},
                            sceneNode: {
                                path: 'b/d'
                            },
                            renderNode: {
                                data: 'B/D'
                            }
                        }
                    },
                    sceneNode: {
                        path: 'b'
                    },
                    renderNode: {
                        data: 'B'
                    }
                },
                c: {
                    hierarchy: {},
                    sceneNode: {
                        path: 'c'
                    },
                    renderNode: {
                        data: 'C'
                    }
                }
            };

            const hierarchy = createHierarchyFromNodes({sceneNodes, renderNodes});
            assert.equal(JSON.stringify(hierarchy), JSON.stringify(expectedHierarchy));
        });
    });
});
