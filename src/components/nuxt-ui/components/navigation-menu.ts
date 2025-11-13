export default {
  slots: {
    root: 'relative flex gap-1.5 [&>div]:min-w-0',
    list: 'isolate min-w-0',
    label: 'w-full flex items-center gap-1.5 font-semibold text-xs/5 text-highlighted px-2.5 py-1.5',
    item: 'min-w-0',
    link: 'group relative w-full flex items-center gap-1.5 my-1 font-medium text-base before:absolute before:z-[-1] before:rounded-md focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2',
    linkLeadingIcon: 'shrink-0 size-5',
    linkLeadingAvatar: 'shrink-0',
    linkLeadingAvatarSize: '2xs',
    linkTrailing: 'group ms-auto inline-flex gap-1.5 items-center',
    linkTrailingBadge: 'shrink-0',
    linkTrailingBadgeSize: 'sm',
    linkTrailingIcon: 'size-5 transform shrink-0 group-data-[state=open]:rotate-180 transition-transform duration-200',
    linkLabel: 'truncate text-base pt-[2px]',
    linkLabelExternalIcon: 'inline-block size-3 align-top text-dimmed',
    childList: 'isolate',
    childLabel: 'text-xs text-highlighted',
    childItem: '',
    childLink: 'group relative size-full flex items-start text-start before:absolute before:z-[-1] before:rounded-md focus:outline-none focus-visible:outline-none dark:focus-visible:outline-none focus-visible:before:ring-inset focus-visible:before:ring-2',
    childLinkWrapper: 'min-w-0',
    childLinkIcon: 'size-5 shrink-0',
    childLinkLabel: 'truncate text-base pt-[2px]',
    childLinkLabelExternalIcon: 'inline-block size-3 align-top text-dimmed',
    childLinkDescription: 'text-muted',
    separator: 'px-2 h-px bg-border',
    viewportWrapper: 'absolute top-full left-0 flex w-full',
    viewport: 'relative overflow-hidden bg-default shadow-lg rounded-md ring ring-default h-(--reka-navigation-menu-viewport-height) w-full transition-[width,height,left] duration-200 origin-[top_center] data-[state=open]:animate-[scale-in_100ms_ease-out] data-[state=closed]:animate-[scale-out_100ms_ease-in] z-[1]',
    content: '',
    indicator: 'absolute data-[state=visible]:animate-[fade-in_100ms_ease-out] data-[state=hidden]:animate-[fade-out_100ms_ease-in] data-[state=hidden]:opacity-0 bottom-0 z-[2] w-(--reka-navigation-menu-indicator-size) translate-x-(--reka-navigation-menu-indicator-position) flex h-2.5 items-end justify-center overflow-hidden transition-[translate,width] duration-200',
    arrow: 'relative top-[50%] size-2.5 rotate-45 border border-default bg-default z-[1] rounded-xs',
  },
  variants: {
    color: {
      primary: {
        link: 'focus-visible:before:ring-slate',
        childLink: 'focus-visible:before:ring-primary',
      },
    },
    orientation: {
      vertical: {
        root: 'flex-col',
        link: 'flex-row px-2.5 text-sm! py-2 before:inset-y-px before:inset-x-0',
        childLabel: 'px-1.5 py-0.5 text-sm!',
        childLink: 'p-1.5 gap-1.5 text-sm! before:inset-y-px before:inset-x-0',
      },
    },
    contentOrientation: {
      vertical: {
        viewport: 'sm:w-(--reka-navigation-menu-viewport-width) left-(--reka-navigation-menu-viewport-left)',
      },
    },
    active: {
      true: {
        childLink: 'text-highlighted data-[state=closed]:!py-5',
        childLinkIcon: 'text-default data-[state=closed]:!py-5',
      },
      false: {
        link: 'text-muted',
        linkLeadingIcon: 'text-dimmed',
        childLink: ['text-default hover:text-highlighted', 'transition-colors before:transition-colors'],
        childLinkIcon: ['text-dimmed group-hover:text-default', 'transition-colors'],
      },
    },
    disabled: {
      true: {
        link: 'cursor-not-allowed opacity-75',
      },
    },
    highlight: {
      true: '',
    },
    level: {
      true: '',
    },
    collapsed: {
      true: '',
    },
  },
  compoundVariants: [
    {
      orientation: 'horizontal',
      contentOrientation: 'horizontal',
      class: {
        childList: 'grid-cols-2 gap-2',
      },
    },
    {
      orientation: 'horizontal',
      contentOrientation: 'vertical',
      class: {
        childList: 'gap-1',
        content: 'w-60',
      },
    },
    {
      orientation: 'vertical',
      collapsed: false,
      class: {
        childList: 'ms-5 border-s border-[#373737] dark:border-default',
        childItem: 'ps-1.5 -ms-px',
        content: 'data-[state=open]:animate-[collapsible-down_200ms_ease-out] data-[state=closed]:animate-[collapsible-up_200ms_ease-out] overflow-hidden',
      },
    },
    {
      orientation: 'vertical',
      collapsed: true,
      class: {
        link: 'px-1.5',
        content: 'shadow-sm rounded-sm min-h-6 p-1',
      },
    },
    {
      orientation: 'horizontal',
      highlight: true,
      class: {
        link: ['after:absolute after:-bottom-2 after:inset-x-2.5 after:block after:h-px after:rounded-full', 'after:transition-colors'],
      },
    },
    {
      orientation: 'vertical',
      highlight: true,
      level: true,
      class: {
        link: ['after:absolute after:-start-1.5 after:inset-y-0.5 after:block after:w-px after:rounded-full', 'after:transition-colors'],
      },
    },
    {
      disabled: false,
      active: false,
      variant: 'pill',
      class: {
        link: ['transition-colors before:transition-colors'],
        linkLeadingIcon: ['group-hover:text-neutral-300', 'transition-colors'],
      },
    },
    {
      disabled: false,
      active: false,
      variant: 'pill',
      orientation: 'horizontal',
      class: {
        link: 'data-[state=open]:text-highlighted',
        linkLeadingIcon: 'group-data-[state=open]:text-default',
      },
    },
    {
      disabled: false,
      variant: 'pill',
      highlight: true,
      orientation: 'horizontal',
      class: {
        link: '',
      },
    },
    {
      disabled: false,
      variant: 'pill',
      highlight: false,
      active: false,
      orientation: 'horizontal',
      class: {
        link: '',
      },
    },
    {
      color: 'primary',
      variant: 'pill',
      active: true,
      class: {
        link: 'text-gray-300',
        linkLeadingIcon: 'text-gray-300 group-data-[state=open]:text-primary',
      },
    },
    {
      color: 'neutral',
      variant: 'pill',
      active: true,
      class: {
        link: 'text-highlighted',
        linkLeadingIcon: 'text-highlighted group-data-[state=open]:text-highlighted',
      },
    },
    {
      variant: 'pill',
      active: true,
      highlight: false,
      class: {
        link: 'before:bg-primary-800',
      },
    },
    {
      variant: 'pill',
      active: true,
      highlight: true,
      disabled: false,
    },
    {
      disabled: false,
      active: false,
      variant: 'link',
      class: {
        link: ['hover:text-highlighted', 'transition-colors'],
        linkLeadingIcon: ['group-hover:text-default', 'transition-colors'],
      },
    },
    {
      disabled: false,
      active: false,
      variant: 'link',
      orientation: 'horizontal',
      class: {
        link: 'data-[state=open]:text-highlighted',
        linkLeadingIcon: 'group-data-[state=open]:text-default',
      },
    },
    {
      color: 'primary',
      variant: 'link',
      active: true,
    },
    {
      color: 'neutral',
      variant: 'link',
      active: true,
      class: {
        link: 'text-highlighted',
        linkLeadingIcon: 'text-highlighted group-data-[state=open]:text-highlighted',
      },
    },
    {
      highlightColor: 'primary',
      highlight: true,
      level: true,
      active: true,
      class: {
        link: 'after:bg-primary',
      },
    },
    {
      highlightColor: 'neutral',
      highlight: true,
      level: true,
      active: true,
      class: {
        link: 'after:bg-inverted',
      },
    },
  ],
  defaultVariants: {
    color: 'primary',
    highlightColor: 'primary',
    variant: 'pill',
  },
};
