<script setup lang="ts">
import { ref } from 'vue'

const tableData = ref([
  {
    date: '2016-05-03',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    value: '1'
  },
  {
    date: '2016-05-02',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    value: '2'
  },
  {
    date: '2016-05-04',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    value: '3'
  },
  {
    date: '2016-05-01',
    name: 'Tom',
    address: 'No. 189, Grove St, Los Angeles',
    value: '4'
  }
])
const editIndex = ref(-1)

const handleEdit = (row) => {
  editIndex.value = tableData.value.indexOf(row)
}

const handleSave = () => {
  editIndex.value = -1
  console.log(tableData.value)
}

const handleDelete = (row) => {
  tableData.value.splice(tableData.value.indexOf(row), 1)
}
</script>

<template>
  <div class="p-10">
    <el-table :data="tableData" border>
      <el-table-column prop="date" label="Date"></el-table-column>
      <el-table-column prop="name" label="Name"></el-table-column>
      <el-table-column prop="address" label="Address"></el-table-column>
      <el-table-column label="Value">
        <template #default="scope">
          <span v-show="scope.$index !== editIndex">{{ scope.row.value }}</span>
          <el-input
            v-show="scope.$index === editIndex"
            v-model="scope.row.value"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="Operate">
        <template #default="{ row }">
          <el-button link @click="handleEdit(row)">Edit</el-button>
          <el-button type="primary" link @click="handleSave">Save</el-button>
          <el-button type="danger" link @click="handleDelete(row)"
            >Delete</el-button
          >
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<style lang="scss" scoped>
  
</style>


