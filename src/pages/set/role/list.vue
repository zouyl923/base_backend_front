<template>
    <el-card>
        <div class="search">
            <el-row>
                <el-col :span="2" :offset="22">
                    <el-button size="small" type="primary" @click="goPush()">添加</el-button>
                </el-col>
            </el-row>
        </div>
        <el-table :data="roleStore.list" row-key="id" :border="true" v-loading="roleStore.loading">
            <el-table-column prop="name" label="角色名称"></el-table-column>

            <el-table-column label="操作" width="180">
                <template #default="scope">
                    <el-button size="small" @click="goPush(scope.row)">编辑</el-button>
                    <el-button
                        v-if="scope.row.id > 1"
                        size="small"
                        type="danger"
                        @click="roleStore.del(scope.row.id)"
                    >
                        删除
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <Pagination :total="roleStore.total" @paginationData="paginationData"></Pagination>
    </el-card>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue';
import router from '@/router';
import useRoleStore from '@/store/set/role';
const roleStore = useRoleStore();

onMounted(async () => {
    await roleStore.getPageList();
});

function paginationData(val) {
    roleStore.search.page = val.page;
    roleStore.search.page_size = val.page_size;
    roleStore.getPageList();
}

function goPush(row: any) {
    router.push({
        path: '/set/role/push',
        query: {
            id: row ? row.id : 0,
        },
    });
}
</script>
