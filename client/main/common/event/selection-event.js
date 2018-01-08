export const triggerNodeSelectedEvent = (renderNode) => {
    console.warn(`Triggering selection event ${renderNode.id}`);
}

export const triggerNodeDeselectedEvent = (renderNode) => {
    console.warn(`Triggering de-selected event ${renderNode.id}`);
}
