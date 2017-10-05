import {createStore} from 'redux';
import {Model} from '../src/model';
import {reduce} from '../src/reducers';

const store = createStore(reduce, {});
const user = new Model();

user.table = 'users';
user.id = 123;
user.dispatch = store.dispatch.bind(store);

console.log(store.getState());

user.patch({
    name: 'Vadim',
    age: 213,
});

console.log(store.getState());
