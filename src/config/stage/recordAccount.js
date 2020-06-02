const recordAccountRouter = {
  route: null,
  name: null,
  title: '记账',
  type: 'folder', // 类型: folder, tab, view
  icon: 'iconfont icon-gengduo',
  filePath: 'view/recordAccount/', // 文件路径
  order: 3,
  inNav: true,
  children: [
    {
      title: '开始记账',
      type: 'view',
      name: 'RecordAccountCreate',
      route: '/recordAccount/add',
      filePath: 'view/recordAccount/record-create.vue',
      inNav: true,
      icon: 'iconfont icon-gengduo',
    }
  ],
}

export default recordAccountRouter
