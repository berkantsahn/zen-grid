// Modelleri ve arayüzleri dışa aktar
export * from './core/interfaces';
export * from './core/models';
export * from './core/utils';

// ZenGrid bileşenlerini içe aktar
import { ZenGrid } from './components/zen-grid';
import { ZenGridToolbar } from './components/zen-grid-toolbar';

// ZenGrid ve ZenGridToolbar bileşenlerini dışa aktar
export { ZenGrid, ZenGridToolbar };

// Toolbar öğelerini dışa aktar
export * from './components/toolbar-items';

// Angular, React ve Vue entegrasyonlarını içe aktar
import './adapters/angular';
import './adapters/react';
import './adapters/vue';

// Web bileşenlerini kaydet
if (!customElements.get('zen-grid')) {
  customElements.define('zen-grid', ZenGrid);
}

if (!customElements.get('zen-grid-toolbar')) {
  customElements.define('zen-grid-toolbar', ZenGridToolbar);
}

// Varsayılan export
export default { ZenGrid, ZenGridToolbar }; 