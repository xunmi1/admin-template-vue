import { mount } from '@vue/test-utils';
import Menu from '@c/Menu/Menu';
import SubMenu from '@c/Menu/SubMenu';

describe('Menu', () => {
    it('renders SubMenu passed', () => {
        const menuData = [
            {
                icon: 'pie-chart',
                name: 'Home',
                title: '测试1',
                children: [
                    {
                        icon: 'credit-card',
                        name: 'Home1',
                        title: '测试12'
                    }
                ]
            },
            {
                icon: 'setting',
                name: 'BlankPage2',
                title: '测试2'
            },
            {
                icon: 'pie-chart',
                name: 'Home',
                title: '测试1',
                children: [
                    {
                        icon: 'credit-card',
                        name: 'Home1',
                        title: '测试12'
                    }
                ]
            },
        ];
        const wrapper = mount(Menu, {
            stubs: {
                SubMenu: true,
                AMenu: true,
                AMenuItem: true,
                AIcon: true
            },
            propsData: { menuData }
        });
        expect(wrapper.findAll(SubMenu)).toHaveLength(2);
        expect(wrapper.html()).toMatchSnapshot();
    });
});
