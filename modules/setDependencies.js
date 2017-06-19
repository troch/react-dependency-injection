import React from 'react';
import PropTypes from 'proptypes';
import assign from 'object-assign';

import { renderComponent, displayName, defaultOptions } from './utils';

export default function setDependencies(dependencies, options = {}) {
    const finalOptions = assign({}, defaultOptions, options);
    const Component = finalOptions.pure ? React.PureComponent : React.Component;

    return (BaseComponent) => {
        class DependencyProvider extends Component {
            constructor(props, context) {
                super(props, context);

                this.existingDependencies = context[finalOptions.contextName] || {};
            }

            getChildContext() {
                const finalDependencies = typeof dependencies === 'function'
                    ? dependencies(this.props, this.existingDependencies)
                    : dependencies;

                return {
                    [ finalOptions.contextName ]: finalDependencies
                };
            }

            render() {
                return renderComponent(BaseComponent, this.props);
            }
        }

        DependencyProvider.childContextTypes = {
            [ finalOptions.contextName ]: PropTypes.object.isRequired
        }

        DependencyProvider.contextTypes = {
            [ finalOptions.contextName ]: PropTypes.object
        }

        DependencyProvider.displayName = displayName('DependencyProvider', BaseComponent);

        return DependencyProvider;
    };
}
