import {Connector, getConnector} from './atoms';
import {TId} from './types';

export type TObject = {[key: string]: any};

export class Model {
    static cid = 1;

    /**
     * A special property of models, the cid or client id is a unique
     * identifier automatically assigned to all models when they're first created
     * @type {number}
     */
    cid = Model.cid++;

    /**
     * Connector set on the model using `@id` decorator.
     * @returns {Connector}
     * @private
     */
    get __$$$__(): Connector {
        return getConnector(this);
    }

    /**
     * Get a single key from `attributes` object.
     * @param {string} key
     * @returns {any}
     */
    get(key: string): any {
        return this.__$$$__.select()[key];
    }

    /**
     * Update a single key in `attributes` object.
     * @param {string} key
     * @param value
     */
    set(key: string, value: any) {
        this.patch({[key]: value});
    }

    /**
     * Update model's `attributes` by merging in supplied object.
     * @param {TObject} patch
     */
    patch(patch: TObject) {
        this.__$$$__.patch(patch);
    }

    /**
     * The attributes property is the internal hash containing the
     * model's state in Redux.
     *
     * Please don't modify the `.attributes` object directly. If you'd
     * like to retrieve and munge a copy of the model's attributes,
     * use `.toJSON()` instead.
     * @returns {TObject}
     */
    get attributes(): TObject {
        return this.__$$$__.select();
    }

    /**
     * Return a shallow copy of the model's `attributes`.
     * @returns {TObject}
     */
    toJSON(): TObject {
        return {...this.attributes};
    }

    /**
     * Returns `true` if the attribute is set to a non-null or non-undefined value.
     * @param {string} key
     * @returns {boolean}
     */
    has(key: string): boolean {
        const value = this[key];

        return value !== null && value !== void 0;
    }

    /**
     * Remove an attribute by deleting it from the internal attributes hash.
     * @param {string} key
     */
    unset(key: string) {
        this.__$$$__.del([...this.path(), key]);
    }

    /**
     * Returns a path array to the current model.
     * @returns {string[]}
     */
    path(): string[] {
        return this.__$$$__.path();
    }

    /**
     * Removes all attributes from the model, including the `id` attribute.
     */
    clear() {
        this.__$$$__.del(this.path());
    }

    /**
     * Returns a new instance of the model with identical attributes.
     * @param {TId} id
     * @returns {this}
     */
    clone(id: TId): this {
        const {idKey} = this.__$$$__;
        if (!idKey) throw Error('Cannot clone model without @id.');

        const Klass = this.constructor as any;
        const instance = new Klass();
        const {[idKey]: omit, ...attributes} = this.attributes;
        instance[idKey] = id;
        instance.patch(attributes);
        return instance;
    }
}
