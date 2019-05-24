import {
  handleActions,
} from 'redux-actions'
import reduxKey from '../constants/reduxKey'

const initState = {
  pageLoading: false,
  storesMap: new Map(), // 当前登录用户的店铺（slug -> store）
  storesIDRefSlug: new Map(), // storeID和storeSlug映射关系
  storesSlugRefID: new Map(), // storeSlug和storeID映射关系
  modulesMap: new Map(), // 当前用户店铺下的Module列表
}

export default handleActions({
  [reduxKey.UPDATE_PAGES_REDUCER]: (state, { payload }) => ({
    ...state,
    ...payload,
  }),
}, initState);
