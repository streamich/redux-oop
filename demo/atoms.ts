import {id, prop} from "../src/atoms";
import {reduce} from "../src/reducers";
import {createStore, applyMiddleware} from "redux";
import {pathDelete} from "../src/actions";

const logger = store => next => action => {
    console.log("LOG:", action);
    next(action);
};

const store = createStore(reduce, {}, applyMiddleware(logger as any));


class Address {
    @prop street: string;
    @prop zip: string;
}

class User {
    @id(store, 'users') id: number = 123;
    @prop name: string;
    @prop age: number;
    @prop deleted = 'del';
    @prop address: Address = new Address;
}

const usr = new User;
usr.name = 'Tester';
usr.address.street = 'smilsu';
usr.address.zip = 'LV-1082';
usr.deleted = void 0;

console.log(usr.address);
console.log(usr.name);
console.log(usr.age);
console.log(usr.deleted);
console.log(usr.address.street);

const usr2 = new User;
usr2.id = 123;

console.log('usr2', usr2.name);


console.log(require('util').inspect(store.getState(), false, 6, true));
