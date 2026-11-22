// A counter for mask ids, so two Plume icons on one page never share an id.
let n = 0;
export const nextId = () => (n = (n + 1) % 1e9).toString(36);
