import { DomUtils } from '../../core/utils';
import { ToolbarItemBase, IToolbarItemOptions } from './toolbar-item-base';

/**
 * Dışa Aktarma Türleri
 */
export enum ExportType {
  CSV = 'csv',
  PDF = 'pdf',
  EXCEL = 'excel',
  JSON = 'json'
}

/**
 * Dışa Aktarma Butonu Seçenekleri
 */
export interface IExportButtonOptions extends IToolbarItemOptions {
  exportType: ExportType;
  label?: string;
  icon?: string;
  fileName?: string;
  onExport?: (type: ExportType, data: any) => void;
}

/**
 * Dışa Aktarma Butonu Öğesi
 * 
 * Tablo verilerini farklı formatlarda dışa aktarmak için buton sağlar.
 */
export class ExportButtonItem extends ToolbarItemBase {
  private exportType: ExportType;
  private fileName: string;
  private onExportCallback?: (type: ExportType, data: any) => void;
  
  /**
   * Yapıcı metod
   */
  constructor(options: IExportButtonOptions) {
    super(options);
    
    this.exportType = options.exportType;
    this.fileName = options.fileName || `zen-grid-export-${Date.now()}`;
    this.onExportCallback = options.onExport;
    
    // Tıklama olayını ekle
    this.element.addEventListener('click', () => this.handleExport());
  }
  
  /**
   * Buton elementini oluşturur
   */
  protected createElement(): HTMLElement {
    let icon = '';
    let label = '';
    
    // Tür bazlı varsayılan değerler
    switch (this.exportType) {
      case ExportType.CSV:
        icon = '📄';
        label = 'CSV';
        break;
      case ExportType.PDF:
        icon = '📑';
        label = 'PDF';
        break;
      case ExportType.EXCEL:
        icon = '📊';
        label = 'Excel';
        break;
      case ExportType.JSON:
        icon = '{}';
        label = 'JSON';
        break;
    }
    
    const button = DomUtils.createElement('button', {
      class: `zen-grid-toolbar-button zen-grid-export-${this.exportType}`,
      title: `${label} Olarak Dışa Aktar`
    }, [`${icon} ${label}`]);
    
    return button;
  }
  
  /**
   * Dışa aktarma işlemi gerçekleştiğinde tetiklenir
   */
  private handleExport(): void {
    if (this.disabled) return;
    
    // Grid verilerini al
    const data = this.getGridData();
    
    // Callback tanımlanmışsa onu çağır
    if (this.onExportCallback) {
      this.onExportCallback(this.exportType, data);
      return;
    }
    
    // Aksi halde varsayılan dışa aktarma işlevini kullan
    this.performExport(data);
  }
  
  /**
   * Grid verilerini alır
   */
  private getGridData(): any {
    if (!this.grid) return null;
    
    // Grid üzerinden veri ve sütunları al
    try {
      // @ts-ignore: grid üzerindeki data ve columns özelliği
      const gridInstance = this.grid as any;
      
      return {
        data: gridInstance.data || [],
        columns: gridInstance.columns || []
      };
    } catch (error) {
      console.error('Grid verisi alınırken hata oluştu:', error);
      return null;
    }
  }
  
  /**
   * Dışa aktarma işlemini gerçekleştirir
   */
  private performExport(gridData: any): void {
    if (!gridData || !gridData.data || !gridData.columns) {
      console.error('Dışa aktarılacak veri bulunamadı.');
      return;
    }
    
    switch (this.exportType) {
      case ExportType.CSV:
        this.exportAsCSV(gridData);
        break;
      case ExportType.PDF:
        this.exportAsPDF(gridData);
        break;
      case ExportType.EXCEL:
        this.exportAsExcel(gridData);
        break;
      case ExportType.JSON:
        this.exportAsJSON(gridData);
        break;
    }
  }
  
  /**
   * CSV olarak dışa aktar
   */
  private exportAsCSV(gridData: any): void {
    const { data, columns } = gridData;
    
    // CSV başlık satırı
    let csvContent = "";
    const headers = columns.map((col: any) => col.header || col.field);
    csvContent += headers.join(',') + '\n';
    
    // Veri satırları
    data.forEach((row: any) => {
      const rowContent = columns.map((col: any) => {
        const value = row[col.field];
        // CSV'de virgül ve çift tırnakları kaçış karakteri ile işle
        return `"${String(value).replace(/"/g, '""')}"`;
      });
      csvContent += rowContent.join(',') + '\n';
    });
    
    // CSV dosyasını indir
    this.downloadFile(csvContent, 'text/csv;charset=utf-8;', `${this.fileName}.csv`);
  }
  
  /**
   * PDF olarak dışa aktar
   */
  private exportAsPDF(gridData: any): void {
    alert('PDF dışa aktarma özelliği yakında eklenecek!');
    // Not: PDF çıktısı için genellikle jsPDF gibi ilave kütüphaneler gereklidir
  }
  
  /**
   * Excel olarak dışa aktar
   */
  private exportAsExcel(gridData: any): void {
    alert('Excel dışa aktarma özelliği yakında eklenecek!');
    // Not: Excel çıktısı için genellikle SheetJS/xlsx gibi kütüphaneler gereklidir
  }
  
  /**
   * JSON olarak dışa aktar
   */
  private exportAsJSON(gridData: any): void {
    const { data } = gridData;
    const jsonContent = JSON.stringify(data, null, 2);
    
    // JSON dosyasını indir
    this.downloadFile(jsonContent, 'application/json;charset=utf-8;', `${this.fileName}.json`);
  }
  
  /**
   * Dosya indirme işlevi
   */
  private downloadFile(content: string, contentType: string, fileName: string): void {
    const blob = new Blob([content], { type: contentType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
} 