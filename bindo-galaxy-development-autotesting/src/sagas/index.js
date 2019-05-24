import { all } from 'redux-saga/effects';
import user from './user';
import galaxy from './galaxy';
import app from './app';
import menu from './menu';
import module from './module';
import pages from './pages';

export default function* rootSaga() {
  yield all([
    user,
    galaxy,
    app,
    menu,
    module,
    pages,
  ]);
}
