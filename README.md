# 帮助文档

## 加载依赖

```node.js
npm install
```

## 项目结构：

```text
·-- App.vue
|                               
|----· pages                                                    ·
|    |                                                          |
|    |-----· home                                               |
|    |     |                                                    |
|    |     ·-----· my-search                                    |
|    |           |                                              |
|    |           ·-----· search     <--------------------·      |
|    |                 |                                 |      |
|    |                 ·-----· goods_list                |      |
|    |                       |                           |      |
|    |                       ·-----· goods_detail        |      |
|    |                             |                     |      |
|    |                             ·----- cart           |      |
|    |-----· cate                                        |      |
|    |     |                                             |      |
|    |     |-----· my-search    -------------------------·      |
|    |     |                                                    |
|    |     |-----· goods_list                                   |
|    |     |     |                                              |
|    |     ·-----·-----· goods_detail                           |
|    |                 |                                        |
|    |                 ·----- cart                              |
|    |                                                          |
|    |                                                          |
|    |-----· cart      <---------·                              |
|    |     |                     |                              |
|    |     |----- my-address     |                              |
|    |     |----- my-goods       |                              |
|    |     ·-----· my-settle     |                              |
|    |           |               |                              |
|    |           ·----- if ---> my                              |
|    |                                                          |
|    |                                                          |
|    ·-----· my                                                 |
|          |                                                    |
|          |----- my-login                                      |
|          ·----- my-userinfo                                   |
|                                                               |
|----· subpkg                                                   |
|    |                                                          |
|    |----- search                                              |
|    |----- goods_list                                          |
|    ·----- goods_detail                                        |
|                                                               |
|----· components                                               |
|    |                                                          |
|    |----- my-search                                           |
|    |----- my-goods                                            |
|    |----- my-address                                          |
|    |----- my-settle                                           |
|    |----- my-login                                            |
|    ·----- my-userinfo                                         |
|                                                               |
|----· static                                                   |
|                                                               |
|----· mixins                                                   |
|    |                                                          |
|    ·----- tabbar-badge                                        |
|                                                               |
|----· store                                                    |
|    |                                                          |
|    |----- store                                               |
|    |----- cart                                                |
·    ·----- user                                                ·

```

