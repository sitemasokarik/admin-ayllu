import DataTable from 'datatables.net-dt';

export interface DataTableOptions {
  pageLength?: number;
  lengthMenu?: number[] | [number[], string[]];
  columnDefs?: Array<{ orderable: boolean; targets: number | number[] }>;
}

export interface DataTableSyncState {
  page: number;
  search: string;
  pageLength: number;
}

const defaultLanguage = {
  search: 'Buscar:',
  lengthMenu: 'Mostrar _MENU_ registros',
  info: '_START_–_END_ de _TOTAL_',
  infoEmpty: '0 registros',
  infoFiltered: '(filtrado de _MAX_)',
  paginate: { next: '›', previous: '‹', first: '«', last: '»' },
  emptyTable: 'Sin registros',
  zeroRecords: 'No se encontraron coincidencias',
};

type DataTableApi = InstanceType<typeof DataTable> & {
  page: {
    (page?: number): number;
    len: (length?: number) => number;
  };
  search: (term?: string) => string;
  draw: (resetPaging?: boolean) => DataTableApi;
};

function getTableElement(selector: string): HTMLTableElement | null {
  return document.querySelector(selector) as HTMLTableElement | null;
}

function destroyExistingTable(table: HTMLTableElement): void {
  if (!DataTable.isDataTable(table)) {
    return;
  }

  try {
    new DataTable.Api(table).destroy();
  } catch {
    // ignore
  }
}

export function destroyDataTable(instance: unknown, selector = '#dataTable'): null {
  const table = getTableElement(selector);

  if (instance && typeof (instance as { destroy?: () => void }).destroy === 'function') {
    try {
      (instance as { destroy: () => void }).destroy();
    } catch {
      // ignore
    }
  }

  if (table) {
    destroyExistingTable(table);
  }

  return null;
}

export function captureDataTableState(instance: unknown): DataTableSyncState {
  const api = instance as DataTableApi | null;
  const state: DataTableSyncState = { page: 0, search: '', pageLength: 10 };

  if (!api || typeof api.page !== 'function') {
    return state;
  }

  try {
    state.page = api.page();
    const currentSearch = api.search();
    state.search = typeof currentSearch === 'string' ? currentSearch : '';
    if (typeof api.page.len === 'function') {
      state.pageLength = api.page.len();
    }
  } catch {
    // ignore
  }

  return state;
}

export function applyDataTableState(
  instance: InstanceType<typeof DataTable> | null,
  state: DataTableSyncState
): InstanceType<typeof DataTable> | null {
  const api = instance as DataTableApi | null;
  if (!api) {
    return null;
  }

  try {
    if (state.pageLength > 0 && typeof api.page.len === 'function') {
      api.page.len(state.pageLength);
    }
    if (state.search) {
      api.search(state.search);
    }
    api.page(state.page);
    api.draw(false);
  } catch {
    // ignore
  }

  return instance;
}

export function initDataTable(
  selector: string,
  options: DataTableOptions = {}
): InstanceType<typeof DataTable> | null {
  const el = getTableElement(selector);
  if (!el) {
    return null;
  }

  destroyExistingTable(el);

  return new DataTable(el, {
    pageLength: options.pageLength ?? 10,
    lengthMenu: options.lengthMenu ?? [10, 25, 50, 100],
    language: defaultLanguage,
    layout: {
      topStart: 'pageLength',
      topEnd: 'search',
      bottomStart: 'info',
      bottomEnd: 'paging',
    },
    columnDefs: options.columnDefs ?? [{ orderable: false, targets: -1 }],
  });
}

export function scheduleDataTableInit(
  initFn: () => InstanceType<typeof DataTable> | null | void,
  delayMs = 180,
  maxAttempts = 12
): void {
  const attempt = (tryCount = 0): void => {
    const result = initFn();
    if (result === null && tryCount < maxAttempts) {
      setTimeout(() => attempt(tryCount + 1), 100);
    }
  };

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      setTimeout(() => attempt(0), delayMs);
    });
  });
}

export function reinitDataTable(
  instance: unknown,
  selector = '#dataTable',
  options: DataTableOptions = {}
): InstanceType<typeof DataTable> | null {
  destroyDataTable(instance, selector);
  return initDataTable(selector, options);
}

/**
 * Angular + DataTables: al destruir DT se pierden los bindings de *ngFor.
 * Oculta la tabla (rebuildDom hide), vuelve a mostrarla (rebuildDom show) e init con estado previo.
 */
export function reloadAngularDataTable(
  instance: unknown,
  rebuildDom: { hide: () => void; show: () => void },
  onReady: (dt: InstanceType<typeof DataTable> | null) => void,
  selector = '#dataTable',
  options: DataTableOptions = {},
  preserve: { search?: boolean; page?: boolean; pageLength?: boolean } = {
    search: true,
    page: true,
    pageLength: true,
  }
): void {
  const state = captureDataTableState(instance);
  if (!preserve.search) {
    state.search = '';
  }
  if (!preserve.page) {
    state.page = 0;
  }
  if (!preserve.pageLength) {
    state.pageLength = options.pageLength ?? 10;
  }

  destroyDataTable(instance, selector);

  rebuildDom.hide();

  requestAnimationFrame(() => {
    rebuildDom.show();
    scheduleDataTableInit(() => {
      onReady(applyDataTableState(initDataTable(selector, options), state));
    });
  });
}

export function refreshDataTablePreserveState(
  instance: unknown,
  selector = '#dataTable',
  options: DataTableOptions = {},
  afterDestroy?: () => void
): InstanceType<typeof DataTable> | null {
  const state = captureDataTableState(instance);

  destroyDataTable(instance, selector);
  afterDestroy?.();

  return applyDataTableState(initDataTable(selector, options), state);
}
