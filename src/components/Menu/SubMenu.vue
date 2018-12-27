<template functional>
    <ASubMenu v-on="listeners" :key="data.name">
        <span slot="title"><AIcon type="mail" /><span>{{ data.attrs.item.title }}</span></span>
        <template v-for="i in data.attrs.item.children">
            <AMenuItem v-if="!i.children" :key="i.name">
                <AIcon v-if="i.icon" :type="i.icon" />
                <span>{{ i.title }}</span>
            </AMenuItem>
            <SubMenu v-else :item="i" :key="i.name" />
        </template>
    </ASubMenu>
</template>
