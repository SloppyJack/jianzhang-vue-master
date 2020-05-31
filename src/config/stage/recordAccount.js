const recordAccountRouter = {
  route: null,
  name: null,
  title: '记账',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-shili',
  filePath: 'view/book/', // 文件路径
  order: null,
  inNav: true,
  children: [
    {
      title: '开始记账',
      type: 'view',
      name: 'BookCreate',
      route: '/book/add',
      filePath: 'view/book/book-create.vue',
      inNav: true,
      icon: 'iconfont icon-tushuguanli',
    }
  ],
}

export default recordAccountRouter
