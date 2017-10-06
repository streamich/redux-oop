import {TId} from './types';

const action = name => `oop/${name}`;

export const PATH_PATCH = action('PATH_PATCH');
export const PATH_DELETE = action('PATH_DELETE');

type TPatch = {[key: string]: any};

export const pathPatch = (path: string[], patch: TPatch) => ({
    type: PATH_PATCH,
    path,
    patch,
});

export const pathDelete = (path: string[]) => ({type: PATH_DELETE, path});
