import {Model} from '../src/model';
import {reduce} from '../src/reducers';
import {id, prop} from '../src/atoms';
import {createStore, applyMiddleware} from 'redux';

const logger = store => next => action => {
    console.log('LOG:', action);
    next(action);
};

const store = createStore(reduce, {}, applyMiddleware(logger as any));

class Rectangle extends Model {
    @prop time: number;
    @prop xy: [number, number];
}

class Image extends Model {
    @prop src: string;
    @prop mark: Rectangle = new Rectangle();
}

class Post extends Model {
    @id(store, 'posts')
    id;
    @prop text: string;
    @prop img = new Image();
}

const post = new Post();
post.id = 123;
post.text = 'Blog post...';
post.img.src = 'http://...';
post.img.mark.time = 44;
post.img.mark.xy = [1, 2];

console.log(require('util').inspect(store.getState(), false, 6, true));
