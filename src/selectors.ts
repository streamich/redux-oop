export const selectModel = (state: any, table: string) => state[table];
export const selectProp = (state: any, table: string, prop: string) =>
    (selectModel(state, table) || {})[prop];

export const selectByPath = (state: object, path: string[]) => {
    let curr = state;
    for (let i = 0; i < path.length; i++) {
        if (!curr || typeof curr !== 'object') return void 0;
        curr = curr[path[i]];
    }
    return curr;
};

export const genPathSelector = path => state => selectByPath(state, path);
