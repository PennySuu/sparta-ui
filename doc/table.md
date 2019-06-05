# Table 表格

用于展示批量数据

### 基本用法

:::demo 当`sp-table`元素中注入`list`对象数组后，在`sp-table-column`中用`prop`属性来对应对象中的键名即可填入数据，用`label`属性来定义表格的列名。可以使用`width`属性来定义列宽。通过`template`自定义单元格内容，用`scope`单元格对应的值。
```vue
<template>
  <sp-table :list="tableList1">
    <sp-table-column
      :ellipsis="true"
      prop="name"
      label="店铺名称"
      width="200">
    </sp-table-column>
    <sp-table-column
      prop="withdrawing"
      label="提现中的金额"
      :formatter="formatter"
      width="200">
    </sp-table-column>
    <sp-table-column
      prop="tag"
      label="操作">
      <template slot-scope="scope">
        <sp-button type="primary">
          {{ scope.cell }}
          {{ scope.row.tag }}
        </sp-button>
      </template>
    </sp-table-column>
  </sp-table>
</template>

<script>
export default{
  data() {
    return {
      tableList1: [
        {
          name: 'Steven Jobs',
          withdrawing: '20.00',
          tag: 'yo'
        },
        {
          name: 'Steven Jobs',
          withdrawing: '20.00',
          tag: 'yo'
        }
      ]
    }
  },
  methods: {
    formatter(cell) {
      return cell + '元'
    }
  }
}
</script>
```
:::

### 带选择的表格

:::demo 手动添加一个`el-table-column`，设type属性为`selection`即可。
```vue
<template>
  <sp-table :list="tableList1">
    <sp-table-column
      :ellipsis="true"
      prop="name"
      label="店铺名称"
      width="200">
    </sp-table-column>
    <sp-table-column
      prop="withdrawing"
      label="提现中的金额"
      :formatter="formatter"
      width="200">
    </sp-table-column>
    <sp-table-column
      prop="tag"
      label="操作">
      <template slot-scope="scope">
        <sp-button type="primary">
          click
        </sp-button>
      </template>
    </sp-table-column>
  </sp-table>
</template>

<script>
export default{
  data() {
    return {
      tableList1: [
        {
          name: 'Steven Jobs',
          withdrawing: '20.00',
          tag: 'yo'
        },
        {
          name: 'Steven Jobs',
          withdrawing: '20.00',
          tag: 'yo'
        }
      ]
    }
  },
  methods: {
    formatter(cell) {
      return cell + '元'
    }
  }
}
</script>
```
:::


### Attributes
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| list | 设置 table 数据源 | array | — | [] |
| emptyText | 设置 table 没有数据时候的默认文案| string | — | '无相关数据' |
| loading | 设置 table 是否处于加载，如果是则会出现loading bar | boolean | — | false |
| cellEmptyText | 设置单元格没有数据的默认文案 | string | — | '--' |
| cellEmptyText | 设置单元格没有数据的默认文案 | string | — | '--' |
| formatter | 设置单元格数据格式化方法 | function | — | — |

### Table-column Attributes
| 参数      | 说明    | 类型      | 可选值       | 默认值   |
|---------- |-------- |---------- |-------------  |-------- |
| prop | 设置每列单元格获取数据的key | string| — | '' |
| label | 设置 table 每列头部单元格的文案 | string| — | '' |
| width | 设置 table 每列的宽度 | string | — | '' |
| ellipsis | 设置 table 指定列是否超长ellipsis | boolean | — | false |
| template | 设置单元格内html，单元数据通过slot-scope的值加cell获取，如slot-scope值为`scope`，则获取方式为`{{ scope.cell }}` | slot | — | — |

### Table-column Scoped Slot
| name | 说明 |
|------|--------|
| — | 自定义列的内容，参数为 { cell, row }，cell为该单元格对应的数据prop的值，row为该行的所有数据 |


<script>
export default{
  data() {
    return {
      tableList1: [
        {
          name: 'Steven Jobs',
          withdrawing: '20.00',
          tag: 'yo'
        },
        {
          name: 'Steven Jobs',
          withdrawing: '20.00',
          tag: 'yo'
        }
      ]
    }
  },
  methods: {
    formatter(cell) {
      return cell + '元'
    }
  }
}
</script>