<template>
	<div class="page-slider">
		<div class="header">
			<div class="name">xxx系统</div>
		</div>

		<el-menu class="menu" active-text-color="red" :default-active="menuActive">
			<div v-for="item in adminMenuStore.treeList" :key="item.id">
				<el-sub-menu v-if="item.children" :index="'0-' + item.id">
					<template #title>
						<class-icon :name="item.icon"></class-icon>
						<span class="name">{{ item.name }}</span>
					</template>
					<el-menu-item-group>
						<el-menu-item v-for="subItem in item.children" :key="subItem.id"
							:index="'0-' + item.id + '-' + subItem.id" @click="changeMenu(item, subItem)">
							<span class="name" style="margin-left: 10px">{{ subItem.name }}</span>
						</el-menu-item>
					</el-menu-item-group>
				</el-sub-menu>
				<el-menu-item v-else :index="'0-' + item.id" @click="changeMenu(item, null)">

					<template #title>
						<class-icon :name="item.icon"></class-icon>
						<span class="name">{{ item.name }}</span>
					</template>
				</el-menu-item>
			</div>
		</el-menu>
	</div>
</template>

<script lang="ts" setup>
import { onMounted, watch, ref } from 'vue';
import { useRouter } from 'vue-router'
import useAdminMenuStore from '@/store/set/menu';
const adminMenuStore = useAdminMenuStore();
onMounted(() => {
	adminMenuStore.getTreeList()
})

const menuActive = ref("")
const router = useRouter()
watch(() => router.currentRoute.value,
	(newValue) => {
		let breadcrumb = adminMenuStore.getBreadcrumb();
		breadcrumb = breadcrumb ? breadcrumb : [];
		if (newValue.meta.breadcrumb == "3") {
			breadcrumb.push({
				name: newValue.meta.title,
				path: newValue.path,
			});
		}
		let defaultActive = "0";
		if (breadcrumb && breadcrumb.length > 0) {
			breadcrumb.map((val: any) => {
				if (val.id && val.id > 0) {
					defaultActive = defaultActive + "-" + val.id;
				}
			});
		} else {
			defaultActive = "0-1";
		}
		menuActive.value = defaultActive;
	}, { immediate: true, deep: true }
);


function changeMenu(item: any, subItem: any) {
	let breadcrumb = [];
	let jumpUrl = '';
	breadcrumb.push({
		id: item.id,
		name: item.name,
		path: item.uri,
	});
	jumpUrl = item.uri
	if (subItem) {
		breadcrumb.push({
			id: subItem.id,
			name: subItem.name,
			path: subItem.uri,
		});
		jumpUrl = subItem.uri
	}
	adminMenuStore.setBreadcrumb(breadcrumb);
	router.push(jumpUrl);
}
</script>

<style lang="scss" scoped>
.page-slider {
	width: $base-menu-width;
	height: 100vh;
	background: $base-menu-background;

	.header {
		width: 100%;
		height: 60px;
		line-height: 60px;

		display: flex;
		align-items: center;
		justify-content: center;
		border-right: 1px solid #ccc;

		.name {
			font-size: 18px;
		}
	}

	.menu {
		.name {
			font-family: AlibabaPuHuiTi-Semibold;
			font-size: 15px;
			// color: rgba(113, 117, 121, 1);
		}
	}
}
</style>
