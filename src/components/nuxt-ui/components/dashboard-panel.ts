export default {
  slots: {
    root: 'relative flex flex-col min-w-0 min-h-[calc(100vh-4rem)] lg:not-last:border-e lg:not-last:border-default max-w-8xl mx-auto shrink-0',
    body: 'flex flex-col gap-4 sm:gap-6 overflow-y-auto overflow-x-auto p-4 sm:p-6 sm:pt-6 sm:pb-2',
    handle: '',
  },
  variants: {
    size: {
      true: {
        root: 'w-full lg:w-(--width)',
      },
      false: {
        root: 'flex-1',
      },
    },
  },
};
