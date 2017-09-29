import {patchModel} from "./actions";

export class Model {

    table = 'model';
    id = 123;

    dispatch = (action) => {
        console.log('dispatching....');
    };

    set(key, value) {
        this.patch({[key]: value});
    }

    patch(patch) {
        const action = patchModel(this.table, this.id, patch);
        this.dispatch(action);
    }
}
