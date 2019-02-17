<template functional>
    <ASubMenu v-on="listeners" :key="data.key || data.name">
        <span slot="title"><AIcon :type="data.attrs.item.icon" /><span>{{ data.attrs.item.title }}</span></span>
        <template v-for="i of data.attrs.item.children">
            <AMenuItem v-if="!i.children" :key="i.key || i.name">
                <AIcon v-if="i.icon" :type="i.icon" />
                <span>{{ i.title }}</span>
            </AMenuItem>
            <SubMenu v-else :item="i" :key="i.key || i.name" />
        </template>
    </ASubMenu>
</template>
