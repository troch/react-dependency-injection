import React from 'react';
import { mount } from 'enzyme';
import { expect } from 'chai';
import { JSDOM } from 'jsdom';

import { setDependencies, inject } from '../modules';

const { window } = new JSDOM('<!doctype html><html><body></body></html>');

global.document = window.document;
global.window = window;
global.navigator = window.navigator;

describe('react-dependencies', () => {
    class Component extends React.Component {
        render() {
            return (
                <div></div>
            );
        }
    }

    const ComponentWithDI = inject('dep1', 'dep2')(Component);

    class App extends React.Component {
        render() {
            return <ComponentWithDI />;
        }
    }

    const dependencies = {
        dep1: 'myDep1',
        dep2: 'myDep2'
    };

    const AppWithDeps = setDependencies(dependencies)(App);

    const appNode = mount(<AppWithDeps { ...dependencies } />);

    it('should set dependencies in context and inject them to props', () => {
        const componentNode = appNode.find(Component);

        expect(componentNode.prop('dep1')).to.equal('myDep1');
        expect(componentNode.prop('dep2')).to.equal('myDep2');
    });
});

