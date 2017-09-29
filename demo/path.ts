import {createStore} from 'redux';
import {reduce} from "../src/reducers";
import {pathPatch} from "../src/actions";


const store = createStore(reduce, {});

store.dispatch(pathPatch(['1', '2'], {foo: 'bar'}));
store.dispatch(pathPatch(['1', '2'], {foo: 'bar2'}));
store.dispatch(pathPatch(['1'], {foo2: 'bar2'}));

console.log(store.getState());
