// Modelleri ve arayüzleri dışa aktar
export * from './core/interfaces';
export * from './core/models';
export * from './core/utils';

// ZenGrid bileşenini içe aktar
import { ZenGrid } from './components/zen-grid';

// Angular, React ve Vue entegrasyonlarını içe aktar
import './adapters/angular';
import './adapters/react';
import './adapters/vue';

// Web bileşenini kaydet
if (!customElements.get('zen-grid')) {
  customElements.define('zen-grid', ZenGrid);
}

// ZenGrid'i varsayılan olarak dışa aktar
export default ZenGrid; 