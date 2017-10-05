import {TId} from './types';

const action = name => `redux-oop/${name}`;

export const PATH_PATCH = action('PATH_PATCH');
export const PATH_DELETE = action('PATH_DELETE');
export const MODEL_PATCH = action('MODEL_PATCH');
export const MODEL_DELETE = action('MODEL_DELETE');

type TPatch = {[key: string]: any};

export const pathPatch = (path: string[], patch: TPatch) => ({
    type: PATH_PATCH,
    path,
    patch,
});
export const pathDelete = (path: string[]) => ({type: PATH_DELETE, path});

export const patchModel = (table: string, id: TId, patch: TPatch) => ({
    type: MODEL_PATCH,
    table,
    id,
    patch,
});
export const deleteModel = (table: string, id: TId) => ({
    type: MODEL_DELETE,
    table,
    id,
});
