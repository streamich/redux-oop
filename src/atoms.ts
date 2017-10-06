import {Store} from 'redux';
import {pathDelete, pathPatch} from './actions';
import {
    sConnector,
    sId,
    sLocator,
    sParent,
    sPath,
    sStore,
    sTable,
    sym,
} from './util';
import {TId} from './types';
import {genPathSelector, selectByPath} from './selectors';

export type TModelLocator = (table: string, id: TId) => string[];
const defaultModelLocator: TModelLocator = (table, id) => [table, String(id)];

const setStore = (obj, store: () => Store<any>) => {
    obj[sStore] = store;
};

const setPath = (obj, path: () => string[]) => {
    obj[sPath] = path;
};

const getStore = obj => {
    return obj[sStore]();
};

const getPath = obj => {
    return obj[sPath]();
};

const hidden = (obj, key, value) =>
    Object.defineProperty(obj, key, {
        enumerable: false,
        writable: true,
        value,
    });

export const setConnector = (obj): Connector => {
    const conn = new Connector();
    conn.obj = obj;
    hidden(obj, sConnector, conn);
    obj[sConnector] = conn;
    return conn;
};

export const getConnector = (obj): Connector => {
    if (!obj || typeof obj !== 'object') return null;
    if (!obj[sConnector]) return setConnector(obj);
    else return obj[sConnector];
};

export class Connector {
    idKey: string;
    obj: any;
    parent: Connector = null;
    store: Store<any> = null;
    table: string;
    locator: TModelLocator;
    key: string;
    selector: (state) => any;

    get Store(): Store<any> {
        return this.store || (this.parent && this.parent.Store);
    }

    set Store(store: Store<any>) {
        this.store = store;
    }

    get Id(): TId {
        return this.obj[sId];
    }

    set Id(id: TId) {
        hidden(this.obj, sId, id);
        this.patch({[this.idKey]: id});
    }

    path(): string[] {
        if (this.locator) {
            return this.locator(this.table, this.obj[sId]);
        } else if (this.parent) {
            return [...this.parent.path(), this.key];
        } else {
            throw Error('No path set');
        }
    }

    get Selector(): (state) => any {
        if (!this.selector) this.selector = genPathSelector(this.path());
        return this.selector;
    }

    select() {
        return this.Selector(this.Store.getState());
    }

    dispatch(action) {
        this.Store.dispatch(action);
    }

    patch(patch: {[key: string]: any}) {
        this.dispatch(pathPatch(this.path(), patch));
    }

    del(path: string[]) {
        this.dispatch(pathDelete(path));
    }
}

export function id(
    store: Store<any>,
    table: string,
    locator: TModelLocator = defaultModelLocator
) {
    return (obj, key: string) => {
        const conn = setConnector(obj);
        conn.Store = store;
        conn.table = table;
        conn.locator = locator;
        conn.idKey = key;
        Object.defineProperties(obj, {
            [key]: {
                get: (): TId => conn.Id,
                set: (id: TId) => (conn.Id = id),
            },
        });
    };
}

export function prop(obj, key: string) {
    const conn = getConnector(obj);
    Object.defineProperty(obj, key, {
        enumerable: true,
        set: value => {
            let propConnector = getConnector(value);
            const sProp = sym('.' + key);

            if (propConnector) {
                hidden(obj, sProp, value);
                propConnector.key = key;
                propConnector.parent = conn;
            } else {
                const propObj = obj[sProp];
                if (typeof propObj !== void 0) delete obj[sProp];
                if (value !== void 0) conn.patch({[key]: value});
                else {
                    conn.Store.dispatch(pathDelete([...conn.path(), key]));
                }
            }
        },
        get: () => {
            const sProp = sym('.' + key);
            const value = obj[sProp];
            if (value !== void 0) {
                return value;
            } else {
                return conn.select()[key];
            }
        },
    });
}
