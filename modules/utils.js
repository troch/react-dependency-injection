import React from 'react';
import isClassComponent from 'react-is-class';

export const renderComponent = (BaseComponent, props) =>
    isClassComponent(BaseComponent)
        ? React.createElement(BaseComponent, props)
        : BaseComponent(props);


export const displayName = (hocName, BaseComponent) =>
    isClassComponent(BaseComponent)
        ? hocName
        : `${hocName}(${BaseComponent.displayName || BaseComponent.name})`;

export const defaultOptions = {
    pure: true,
    contextName: '__dependencies'
};
