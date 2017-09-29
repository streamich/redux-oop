import {Store} from "redux";
import {pathPatch} from "./actions";
import {sConnector, sId, sLocator, sParent, sPath, sStore, sTable, sym} from "./util";
import {TId} from "./types";

export type TModelLocator = (table: string, id: TId) => string[];
const defaultModelLocator: TModelLocator = (table, id) => [table, String(id)];

const setStore = (obj, store: () => Store<any>) => {
    obj[sStore] = store;
};

const setPath = (obj, path: () => string[]) => {
    obj[sPath] = path;
};

const getStore = (obj) => {
    return obj[sStore]();
};

const getPath = (obj) => {
    return obj[sPath]();
};

const setConnector = (obj): Connector => {
    const conn = new Connector;
    conn.obj = obj;
    obj[sConnector] = conn;
    return conn;
};

const getConnector = (obj): Connector => {
    if(!obj || (typeof obj !== 'object')) return null;
    if(!obj[sConnector]) return setConnector(obj);
    else return obj[sConnector];
};

export class Connector {
    obj: any;
    parent: Connector = null;
    store: Store<any> = null;
    table: string;
    locator: TModelLocator;
    key: string;

    get Store(): Store<any> {
        return this.store || (this.parent && this.parent.Store);
    }

    set Store(store: Store<any>) {
        this.store = store;
    }

    path(): string[] {
        if(this.locator) {
            return this.locator(this.table, this.obj[sId]);
        } else if(this.parent) {
            return [...this.parent.path(), this.key];
        } else {
            throw Error('No path set');
        }
    }
}

const save = (conn: Connector, key: string, value: any) =>
    conn.Store.dispatch(pathPatch(conn.path(), {[key]: value}));

export function id(store: Store<any>, table: string, locator: TModelLocator = defaultModelLocator) {
    return (obj, key: string) => {
        const conn = setConnector(obj);
        conn.Store = store;
        conn.table = table;
        conn.locator = locator;
        Object.defineProperties(obj, {
            [key]: {
                get: (): TId => obj[sId],
                set: (id: TId) => {
                    obj[sId] = id;
                    save(conn, key, id);
                },
            },
        });
    };
}

export function prop(obj, key: string) {
    const conn = getConnector(obj);
    Object.defineProperty(obj, key, {
        set: (value) => {
            let propConnector = getConnector(value);
            const sProp = sym('.' + key);

            if(propConnector) {
                obj[sProp] = value;
                propConnector.key = key;
                propConnector.parent = conn;
            } else {
                const propObj = obj[sProp];
                if(typeof propObj !== void 0) {
                    delete obj[sProp];
                }
                save(conn, key, value);
            }
        },
        get: () => {
            const sProp = sym('.' + key);
            const value = obj[sProp];
            if(value !== void 0) {
                return value;
            } else {
                console.log('implement selctor');
            }
        },
    });
}
