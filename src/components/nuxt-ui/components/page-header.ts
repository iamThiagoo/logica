export default {
  slots: {
    root: 'relative border-none pt-0! pb-6',
    container: '',
    wrapper: 'flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4',
    headline: 'mb-2.5 text-sm font-semibold text-primary flex items-center gap-1.5',
    title: '!text-3xl text-pretty mb-0 font-semibold text-highlighted',
    description: 'text-lg text-pretty text-muted',
    links: 'flex flex-wrap items-center gap-1.5',
  },
  variants: {
    title: {
      true: {
        description: 'text-base mt-0.5',
      },
    },
  },
};
