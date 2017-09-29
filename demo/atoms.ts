import {id, prop} from "../src/atoms";
import {reduce} from "../src/reducers";
import {createStore} from "redux";

const store = createStore(reduce, {});


class Address {
    @prop street: string;
    @prop zip: string;
}

class User {
    @id(store, 'users', (table, id) => [table, 'byId', String(id)]) test: number = 123;
    @prop name: string;
    @prop age: number;
    @prop address: Address = new Address;
}

// const addr = new Address;
// console.log(addr[sConnector]());

const usr = new User;
usr.name = 'Tester';
usr.address.street = 'smilsu';
usr.address.zip = 'LV-1082';
// const usr2 = new User;
console.log(usr.address);
console.log(usr.name);


// const user = new User;
// user.name = 'Foobar';
// user.age = 23;
// console.log('user.address', user.address);
// console.log(user.address.street = 'asdf');
//
console.log(require('util').inspect(store.getState(), false, 6, true));
