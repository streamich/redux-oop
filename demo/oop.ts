import {Model} from '../src/model';
import {reduce} from '../src/reducers';
import {id, prop} from '../src/atoms';
import {createStore, applyMiddleware} from 'redux';

const logger = store => next => action => {
    console.log('LOG:', action);
    next(action);
};

const store = createStore(reduce, {}, applyMiddleware(logger as any));

class User extends Model {
    @id(store, 'users')
    id = 123;
    @prop name: string;
}

const usr = new User();
usr.name = 'Bill';

console.log(usr.id);
console.log(usr.name);
console.log(usr.attributes);

usr.patch({
    username: 'bill',
    age: 24,
});

console.log(usr.attributes);
console.log(usr.toJSON());

console.log(usr.has('name'));
console.log(usr.has('foo'));

console.log(usr.get('name'));

usr.unset('name');
console.log(usr.name);

console.log(usr.path());
usr.clear();

usr.name = 'Foo';

const usr2 = usr.clone(1);
console.log(usr2);

console.log(require('util').inspect(store.getState(), false, 6, true));
