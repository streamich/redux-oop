import {PATH_DELETE, PATH_PATCH} from './actions';

export function reducePathPatch(state, {path, patch}) {
    if (!path.length) return {...state, ...patch};
    else {
        const [step, ...restPath] = path;
        // if (step === void 0) return state;
        return {
            ...state,
            [step]: reducePathPatch(state[step] || {}, {path: restPath, patch}),
        };
    }
}

export function reducePathDelete(state, {path}) {
    if (path.length === 1) {
        const [step] = path;
        const {[step]: omit, ...newState} = state;
        return newState;
    } else {
        const [step, ...restPath] = path;
        return {
            ...state,
            [step]: reducePathDelete(state[step] || {}, {path: restPath}),
        };
    }
}

export function reduce(state, action) {
    switch (action.type) {
        case PATH_PATCH:
            return reducePathPatch(state, action);
        case PATH_DELETE:
            return reducePathDelete(state, action);
        default:
            return state;
    }
}
