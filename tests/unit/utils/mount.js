import { mount as mt, shallowMount as shallowMt } from '@vue/test-utils';

export const shallowMount = (component, propsData = {}, otherData = {}) =>
    shallowMt(component, { propsData, ...otherData });

export const mount = (component, propsData = {}, otherData = {}) =>
    mt(component, { propsData, ...otherData });
