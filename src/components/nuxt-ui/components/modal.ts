export default {
  slots: {
    overlay: 'fixed inset-0 bg-black/40! dark:bg-elevated/80!',
    content: 'fixed bg-default divide-y divide-default flex flex-col focus:outline-none left-[50%]',
    header: 'flex items-center gap-1.5 p-4 sm:px-6 min-h-16',
    wrapper: '',
    body: 'flex-1 overflow-y-auto p-4 sm:p-6 max-h-[80dvh]',
    footer: 'flex items-center gap-1.5 p-4 sm:px-6',
    title: 'text-highlighted font-semibold',
    description: 'mt-1 text-muted text-sm',
    close: 'absolute top-4 end-4',
  },
  variants: {
    transition: {
      true: {
        overlay: 'data-[state=open]:animate-[fade-in_200ms_ease-out] data-[state=closed]:animate-[fade-out_200ms_ease-in]',
        content: 'data-[state=open]:animate-[scale-in_200ms_ease-out] data-[state=closed]:animate-[scale-out_200ms_ease-in]',
      },
    },
    fullscreen: {
      true: {
        content: 'inset-0',
      },
      false: {
        content: ['top-1/2 left-[53%] -translate-x-1/2 -translate-y-1/2', 'w-[90vw] sm:w-[80vw] md:w-[70vw] lg:w-[60vw] xl:w-[50vw]', 'max-h-[calc(100dvh-2rem)] sm:max-h-[calc(100dvh-4rem)]', 'rounded-xl shadow-2xl ring ring-default overflow-hidden bg-default'].join(' '),
      },
    },
  },
};
