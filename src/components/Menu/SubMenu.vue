<template functional>
    <ASubMenu v-on="listeners" :key="data.key">
        <template #title>
            <AIcon :type="props.item.icon" />
            <span>{{ props.item.title }}</span>
        </template>
        <template v-for="i of props.item.children">
            <AMenuItem v-if="!i.children" :key="i.key || i.name">
                <AIcon v-if="i.icon" :type="i.icon" />
                <span>{{ i.title }}</span>
            </AMenuItem>
            <SubMenu v-else :item="i" :key="i.key || i.name" />
        </template>
    </ASubMenu>
</template>
