

export const selectModel = (state: any, table: string) => state[table];
export const selectProp = (state: any, table: string, prop: string) => (selectModel(state, table) || {})[prop];
