import {Model} from '../model';
import {id, prop} from '../atoms';
import {createStore} from 'redux';
import {reduce} from '../reducers';

describe('model', () => {
    describe('@prop', () => {
        it('is a decorator', () => {
            expect(typeof prop).toBe('function');
            expect(prop.length).toBe(2);
        });
    });
    describe('new Model', () => {
        it('creates model without crashing', () => {
            const model = new Model();
        });
    });
    describe('.set', () => {
        it('set a single key', () => {
            const store = createStore(reduce, {});
            class MyModel extends Model {
                @id(store, 'models')
                id = 1;
            }
            const model = new MyModel();
            model.set('foo', 'bar');
            expect(store.getState()).toMatchSnapshot();
        });
    });
});
