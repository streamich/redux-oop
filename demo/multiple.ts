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

class Comment extends Model {
    @id(store, 'comments')
    commentId: string;
    @prop text: string = '';
}

const user = new User();
const comm = new Comment();

comm.commentId = 'id-123';
comm.text = 'This is comment';

console.log(require('util').inspect(store.getState(), false, 6, true));
