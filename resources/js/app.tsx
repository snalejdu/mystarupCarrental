import { createInertiaApp, router } from '@inertiajs/react';
import { createRoot } from 'react-dom/client';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import '../css/app.css';
import { initAuthSync, notifyAuthStateChange } from './lib/authSync';

const appName = import.meta.env.VITE_APP_NAME || 'RentBohol';

createInertiaApp({
    title: (title) => title ? `${title} | ${appName}` : appName,
    resolve: (name) => {
        // Module pages use "Module::PageName" convention
        if (name.includes('::')) {
            const [module, page] = name.split('::');
            return resolvePageComponent(
                `../../Modules/${module}/resources/js/Pages/${page}.tsx`,
                import.meta.glob<any>('../../Modules/*/resources/js/Pages/**/*.tsx')
            );
        }
        // Default pages in resources/js/Pages
        return resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob<any>('./Pages/**/*.tsx')
        );
    },
    setup({ el, App, props }: any) {
        // Initialize cross-tab authentication synchronization
        const initialUser = (props.initialPage?.props as any)?.auth?.user;
        initAuthSync(initialUser?.id);

        // Keep auth state in sync across Inertia client navigations
        router.on('navigate', (event) => {
            const pageUser = (event.detail.page?.props as any)?.auth?.user;
            notifyAuthStateChange(pageUser?.id);
        });

        if (el) {
            const root = createRoot(el);
            root.render(<App {...props} />);
        }
    },
    progress: {
        color: '#0d9488',
        showSpinner: true,
        delay: 100,
    },
});
