export default {
  slots: {
    root: 'relative flex items-start',
    container: 'flex items-center',
    base: 'rounded-sm cursor-pointer! ring ring-inset ring-accented overflow-hidden focus-visible:outline-2 focus-visible:outline-offset-2',
    indicator: 'flex items-center justify-center size-full text-inverted',
    icon: 'shrink-0 size-full',
    wrapper: 'w-full',
    label: 'block font-medium text-default cursor-pointer!',
    description: 'text-muted',
  },
  variants: {
    color: {
      primary: {
        base: 'focus-visible:outline-primary',
        indicator: 'bg-primary',
      },
      secondary: {
        base: 'focus-visible:outline-secondary',
        indicator: 'bg-secondary',
      },
      success: {
        base: 'focus-visible:outline-success',
        indicator: 'bg-success',
      },
      info: {
        base: 'focus-visible:outline-info',
        indicator: 'bg-info',
      },
      warning: {
        base: 'focus-visible:outline-warning',
        indicator: 'bg-warning',
      },
      error: {
        base: 'focus-visible:outline-error',
        indicator: 'bg-error',
      },
      neutral: {
        base: 'focus-visible:outline-inverted',
        indicator: 'bg-inverted',
      },
    },
    variant: {
      list: {
        root: '',
      },
      card: {
        root: 'border border-muted rounded-lg',
      },
    },
    indicator: {
      start: {
        root: 'flex-row',
        wrapper: 'ms-2',
      },
      end: {
        root: 'flex-row-reverse',
        wrapper: 'me-2',
      },
      hidden: {
        base: 'sr-only',
        wrapper: 'text-center',
      },
    },
    size: {
      xs: {
        base: 'size-3',
        container: 'h-4',
        wrapper: 'text-xs',
      },
      sm: {
        base: 'size-3.5',
        container: 'h-4',
        wrapper: 'text-xs',
      },
      md: {
        base: 'size-4',
        container: 'h-5',
        wrapper: 'text-sm',
      },
      lg: {
        base: 'size-4.5',
        container: 'h-5',
        wrapper: 'text-sm',
      },
      xl: {
        base: 'size-5',
        container: 'h-6',
        wrapper: 'text-base',
      },
    },
    required: {
      true: {
        label: "after:content-['*'] after:ms-0.5 after:text-error",
      },
    },
    disabled: {
      true: {
        root: 'opacity-75',
        base: 'cursor-not-allowed',
        label: 'cursor-not-allowed',
        description: 'cursor-not-allowed',
      },
    },
    checked: {
      true: '',
    },
  },
  compoundVariants: [
    {
      size: 'xs',
      variant: 'card',
      class: {
        root: 'p-2.5',
      },
    },
    {
      size: 'sm',
      variant: 'card',
      class: {
        root: 'p-3',
      },
    },
    {
      size: 'md',
      variant: 'card',
      class: {
        root: 'p-3.5',
      },
    },
    {
      size: 'lg',
      variant: 'card',
      class: {
        root: 'p-4',
      },
    },
    {
      size: 'xl',
      variant: 'card',
      class: {
        root: 'p-4.5',
      },
    },
    {
      color: 'primary',
      variant: 'card',
      class: {
        root: 'has-data-[state=checked]:border-primary',
      },
    },
    {
      color: 'neutral',
      variant: 'card',
      class: {
        root: 'has-data-[state=checked]:border-inverted',
      },
    },
    {
      variant: 'card',
      disabled: true,
      class: {
        root: 'cursor-not-allowed',
      },
    },
  ],
  defaultVariants: {
    size: 'md',
    color: 'primary',
    variant: 'list',
    indicator: 'start',
  },
};
