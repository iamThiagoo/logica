import { modalMap, MODALS_WITHOUT_QUERY } from '@/utils/types/map/modal-map';
import type { IModalState } from '@/utils/types/modal';
import type { ModalKey } from '@/utils/types/modal';
import { isObject } from '@/utils/helpers/shared/object';

const MODAL_EXTRA_QUERY_PARAMS: Partial<Record<ModalKey, string[]>> = {
  configuracoes: ['tab', 'user'],
};

const _useModalStore = () => {
  const route = useRoute();
  const router = useRouter();
  const modals = reactive<Record<ModalKey, IModalState>>({} as any);
  const modalData = reactive<Record<ModalKey, any>>({} as any);

  const buildQueryWithoutModalParams = (name: ModalKey) => {
    const query = { ...route.query } as Record<string, any>;
    delete query.m;

    const propKeys = Object.keys(modals[name]?.props ?? {});
    const dataKeys = isObject(modalData[name]) ? Object.keys(modalData[name]) : [];
    const extraKeys = MODAL_EXTRA_QUERY_PARAMS[name] ?? [];

    for (const key of new Set([...propKeys, ...dataKeys, ...extraKeys])) {
      delete query[key];
    }

    return query;
  };

  const openModal = (name: ModalKey, data: any = null) => {
    modalData[name] = data;
    modals[name] = {
      component: modalMap[name] ? markRaw(modalMap[name]) : null,
      props: isObject(data) ? data : {},
      open: true,
    };

    if (!MODALS_WITHOUT_QUERY.includes(name)) {
      router.replace({ query: { ...route.query, m: name } });
    }
  };

  const closeModal = (name: ModalKey) => {
    if (modals[name]) {
      modals[name]!.open = false;
      modals[name]!.props = {};
      modalData[name] = null;
    }

    if (!MODALS_WITHOUT_QUERY.includes(name)) {
      router.replace({ query: buildQueryWithoutModalParams(name) });
    }
  };

  const handleModal = (name: ModalKey, value: boolean) => {
    if (!modals[name]) return;
    modals[name]!.open = value;

    if (!MODALS_WITHOUT_QUERY.includes(name)) {
      if (value) router.replace({ query: { ...route.query, m: name } });
      else closeModal(name);
    }
  };

  const updateModalData = (name: ModalKey, data: any) => {
    if (!modals[name]) return;
    modalData[name] = data;
  };

  const updateModalParam = (name: ModalKey, key: string, value: any) => {
    if (!modals[name]) return;
    modals[name]!.props[key] = value;
    const query = { ...route.query, m: name } as Record<string, any>;
    if (value === undefined || value === null || value === '') {
      delete query[key];
    } else {
      query[key] = value;
    }
    router.replace({
      query,
    });
  };

  const getModalData = (name: ModalKey) => {
    return modalData[name];
  };

  watch(
    () => route.query.m,
    (modalName: any) => {
      if (!modalName) {
        Object.keys(modals).forEach((key) => {
          if (modals[key as ModalKey]) {
            modals[key as ModalKey]!.open = false;
          }
        });
        return;
      }

      const name = (Array.isArray(modalName) ? modalName[0] : modalName) as ModalKey;

      if (!modals[name] || !modals[name]!.open) {
        modals[name] = {
          component: modalMap[name] ? markRaw(modalMap[name]) : null,
          props: {},
          open: true,
        };
      }
    },
    { immediate: true }
  );

  return {
    modals,
    modalData,
    openModal,
    closeModal,
    handleModal,
    updateModalData,
    updateModalParam,
    getModalData,
  };
};

export const useModalStore = createSharedComposable(_useModalStore);
