const recordAccountRouter = {
  route: null,
  name: null,
  title: '记账',
  type: 'folder', // 类型: folder, tab, view
  icon: 'el-icon-edit',
  filePath: 'view/record/', // 文件路径
  order: 3,
  inNav: true,
  children: [
    {
      title: '开始记账',
      type: 'view',
      name: 'RecordCreate',
      route: '/record/add',
      filePath: 'view/record/record-create.vue',
      inNav: true
    },
    {
      title: '记账明细',
      type: 'view',
      name: 'RecordDetail',
      route: '/record/list',
      filePath: 'view/record/record-list.vue',
      inNav: true
    }
  ],
}

export default recordAccountRouter
