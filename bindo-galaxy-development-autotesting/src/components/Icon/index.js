import { Icon } from 'antd';

const hash = process.env.SYS_ICONFONT_HASH;
/**
 * 使用antd组，iconfont.js来自www.iconfont.cn中的BindoGalaxy项目
 * https://www.iconfont.cn/manage/index?spm=a313x.7781069.1998910419.11&manage_type=myprojects&projectId=911174
 */
export default Icon.createFromIconfontCN({
  scriptUrl: `/js/iconfont${hash === '.undefined' ? '' : hash}.js`,
  extraCommonProps: {
    fill: '#333',
  },
});
