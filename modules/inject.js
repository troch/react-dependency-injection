import React from 'react';
import PropTypes from 'proptypes';
import assign from 'object-assign';

import { renderComponent, displayName, defaultOptions } from './utils';

export default function inject(...args) {
    const length = args.length;

    const last = args[length - 1];
    const hasOptions = typeof last !== 'string';
    const dependencyNames = hasOptions
        ? args.slice(0, -1)
        : args;

    if (!dependencyNames.length) {
        console.error('[react-dependency-injection][inject] No dependency names supplied');
    }

    const options = hasOptions
        ? assign({}, defaultOptions, last)
        : defaultOptions;

    const Component = options.pure ? React.PureComponent : React.Component;

    return (BaseComponent) => {
        class Inject extends Component {
            constructor(props, context) {
                super(props, context);

                const dependencies = context[options.contextName];

                this.pickedDependencies = dependencyNames.reduce(
                    (deps, name) => {
                        const dep = dependencies[name];

                        if (!dep) {
                            console.error(`[react-dependency-injection][inject] No dependency named '${name}' was found`);
                            return deps;
                        }

                        return assign(deps, {[ name ]: dependencies[name] });
                    },
                    {}
                );
            }

            render() {
                const props = assign({}, this.pickedDependencies, this.props);

                return renderComponent(BaseComponent, props);
            }
        }

        Inject.contextTypes = {
            [ options.contextName ]: PropTypes.object.isRequired
        }

        Inject.displayName = displayName('Inject', BaseComponent);

        return Inject;
    };
}
