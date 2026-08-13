import { createInertiaApp } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import '../css/app.css';

const appName = import.meta.env.VITE_APP_NAME || 'RentBohol';

createInertiaApp({
    title: (title) => title ? `${title} | ${appName}` : appName,
    resolve: (name) => {
        // Module pages use "Module::PageName" convention
        if (name.includes('::')) {
            const [module, page] = name.split('::');
            return resolvePageComponent(
                `../../Modules/${module}/resources/js/Pages/${page}.tsx`,
                import.meta.glob('../../Modules/*/resources/js/Pages/**/*.tsx')
            );
        }
        // Default pages in resources/js/Pages
        return resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob('./Pages/**/*.tsx')
        );
    },
    setup({ el, App, props }) {
        const root = createRoot(el);
        root.render(<App {...props} />);
    },
    progress: {
        color: '#ff6b4a',
        showSpinner: true,
    },
});
