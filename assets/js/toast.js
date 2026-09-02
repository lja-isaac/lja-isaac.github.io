/**
 * Bootstrap toast helpers.
 *
 * Public API:
 *   ToastExt.showToast({ message: 'Saved.' });
 */

globalThis.ToastExt = (() => {
    const DEFAULT_CONTAINER_SELECTOR = '#toast-container';
    const DEFAULT_DELAY = 5000;
    const STACKING_CLASSES = [
        'd-flex',
        'flex-column',
        'align-items-end',
        'gap-2'
    ];

    /**
     * Change this template to customize the markup used for every toast.
     * Values are intentionally interpolated as HTML so callers can provide
     * markup in the title and message when needed.
     */
    const TOAST_TEMPLATE = ({
        id,
        title,
        message,
        variant = 'primary',
        closeButton = true
    }) => `
        <div id="${id}" class="toast text-bg-${variant} border-0" role="alert"
            aria-live="assertive" aria-atomic="true">
            <div class="d-flex">
                <div class="toast-body">
                    ${title ? `<strong class="me-2">${title}</strong>` : ''}
                    ${message}
                </div>
                ${closeButton ? `
                    <button type="button" class="btn-close btn-close-white me-2 m-auto"
                        data-bs-dismiss="toast" aria-label="Close"></button>
                ` : ''}
            </div>
        </div>
    `;

    function getContainer(container = DEFAULT_CONTAINER_SELECTOR) {
        const element = typeof container === 'string'
            ? document.querySelector(container)
            : container;

        if (!element) {
            throw new Error(`Toast container not found: ${container}`);
        }

        return element;
    }

    function configureContainer(element) {
        element.classList.add(...STACKING_CLASSES);
        return element;
    }

    function getBootstrapToast() {
        if (!globalThis.bootstrap?.Toast) {
            throw new Error(
                'Bootstrap Toast is unavailable. Load bootstrap.bundle.min.js before using toast.js.'
            );
        }

        return globalThis.bootstrap.Toast;
    }

    function createId() {
        return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }

    /**
     * Create and append a Bootstrap toast without showing it.
     *
     * @param {Object} options
     * @param {string} options.message
     * @param {string} [options.title]
     * @param {string} [options.variant='primary'] Bootstrap contextual color
     * @param {number} [options.delay=5000] Auto-hide delay in milliseconds
     * @param {boolean} [options.autohide=true]
     * @param {boolean} [options.closeButton=true]
     * @param {Element|string} [options.container='#toast-container']
     * @param {Function} [options.template=TOAST_TEMPLATE]
     * @returns {Element} The created toast element
     */
    function createToast({
        message = '',
        title = '',
        variant = 'primary',
        delay = DEFAULT_DELAY,
        autohide = true,
        closeButton = true,
        container = DEFAULT_CONTAINER_SELECTOR,
        template = TOAST_TEMPLATE
    } = {}) {
        const toast = document.createElement('template');
        const toastContainer = configureContainer(getContainer(container));

        toast.innerHTML = template({
            id: createId(),
            title,
            message,
            variant,
            closeButton
        }).trim();

        const element = toast.content.firstElementChild;
        if (!element) {
            throw new Error('Toast template must return a toast element.');
        }

        element.addEventListener('hidden.bs.toast', () => element.remove(), {
            once: true
        });
        toastContainer.append(element);
        element.dataset.toastDelay = String(delay);
        element.dataset.toastAutohide = String(autohide);

        return element;
    }

    /**
     * Create and display a Bootstrap toast.
     *
     * @returns {import('bootstrap').Toast} The Bootstrap toast instance
     */
    function showToast(options = {}) {
        const element = createToast(options);
        const Toast = getBootstrapToast();
        const instance = Toast.getOrCreateInstance(element, {
            autohide: options.autohide ?? true,
            delay: options.delay ?? DEFAULT_DELAY
        });

        instance.show();
        return instance;
    }

    /**
     * Hide a toast instance or toast element.
     */
    function hideToast(toast) {
        const Toast = getBootstrapToast();
        const instance = toast instanceof Toast
            ? toast
            : Toast.getInstance(toast);

        if (!instance) {
            throw new Error('Cannot hide a toast that has not been initialized.');
        }

        instance.hide();
    }

    /**
     * Remove a toast instance or toast element immediately.
     */
    function disposeToast(toast) {
        const Toast = getBootstrapToast();
        const element = toast instanceof Toast ? toast._element : toast;
        const instance = Toast.getInstance(element);

        instance?.dispose();
        element?.remove();
    }

    return {
        TOAST_TEMPLATE,
        createToast,
        showToast,
        hideToast,
        disposeToast
    };
})();