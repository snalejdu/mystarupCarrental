import { createInertiaApp } from '@inertiajs/react';
import ReactDOMServer from 'react-dom/server';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import createServer from '@inertiajs/react/server';

const appName = import.meta.env.VITE_APP_NAME || 'RentBohol';

createServer((page) =>
    createInertiaApp({
        page,
        render: ReactDOMServer.renderToString as any,
        title: (title) => title ? `${title} | ${appName}` : appName,
        resolve: (name) => {
            if (name.includes('::')) {
                const [module, pageName] = name.split('::');
                return resolvePageComponent(
                    `../../Modules/${module}/resources/js/Pages/${pageName}.tsx`,
                    import.meta.glob<any>('../../Modules/*/resources/js/Pages/**/*.tsx')
                );
            }
            return resolvePageComponent(
                `./Pages/${name}.tsx`,
                import.meta.glob<any>('./Pages/**/*.tsx')
            );
        },
        setup: ({ App, props }: any) => <App {...props} />,
    })
);
