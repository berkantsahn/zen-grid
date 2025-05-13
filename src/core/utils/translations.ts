/**
 * Zen-Grid çeviri sistemi
 * 
 * Bu dosya çevirileri ve dil yönetimini sağlar
 */

// Çeviri anahtarlarını tanımla
export enum TranslationKey {
  SEARCH_PLACEHOLDER = 'search_placeholder',
  EXPORT_CSV = 'export_csv',
  EXPORT_JSON = 'export_json',
  EXPORT_PDF = 'export_pdf',
  EXPORT_EXCEL = 'export_excel',
  NO_DATA = 'no_data',
  TABLE_TITLE = 'table_title',
  PAGE_INFO = 'page_info'
}

// Çeviri arayüzü
export interface TranslationMap {
  [key: string]: string;
}

// Dil arayüzü
export interface LanguageMap {
  [key: string]: TranslationMap;
}

// Çeviriler
export const translations: LanguageMap = {
  'tr': {
    [TranslationKey.SEARCH_PLACEHOLDER]: 'Ara...',
    [TranslationKey.EXPORT_CSV]: 'CSV Olarak Dışa Aktar',
    [TranslationKey.EXPORT_JSON]: 'JSON Olarak Dışa Aktar',
    [TranslationKey.EXPORT_PDF]: 'PDF Olarak Dışa Aktar',
    [TranslationKey.EXPORT_EXCEL]: 'Excel Olarak Dışa Aktar',
    [TranslationKey.NO_DATA]: 'Görüntülenecek veri yok',
    [TranslationKey.TABLE_TITLE]: 'Veri Tablosu',
    [TranslationKey.PAGE_INFO]: '{start}-{end} / {total}'
  },
  'en': {
    [TranslationKey.SEARCH_PLACEHOLDER]: 'Search...',
    [TranslationKey.EXPORT_CSV]: 'Export as CSV',
    [TranslationKey.EXPORT_JSON]: 'Export as JSON',
    [TranslationKey.EXPORT_PDF]: 'Export as PDF',
    [TranslationKey.EXPORT_EXCEL]: 'Export as Excel',
    [TranslationKey.NO_DATA]: 'No data to display',
    [TranslationKey.TABLE_TITLE]: 'Data Table',
    [TranslationKey.PAGE_INFO]: '{start}-{end} of {total}'
  }
};

/**
 * Dil sınıfı 
 */
export class TranslationService {
  private static instance: TranslationService;
  private currentLanguage: string = 'tr';
  
  private constructor() {}
  
  /**
   * Singleton instance'ı alır
   */
  public static getInstance(): TranslationService {
    if (!TranslationService.instance) {
      TranslationService.instance = new TranslationService();
    }
    return TranslationService.instance;
  }
  
  /**
   * Aktif dili ayarlar
   */
  public setLanguage(language: string): void {
    if (!translations[language]) {
      console.warn(`Desteklenmeyen dil: ${language}, varsayılan 'tr' kullanılacak`);
      language = 'tr';
    }
    this.currentLanguage = language;
  }
  
  /**
   * Çeviriyi alır
   */
  public translate(key: TranslationKey, params?: Record<string, string | number>): string {
    // Çeviriyi al
    const translation = translations[this.currentLanguage]?.[key] || 
                        translations['tr'][key] || 
                        key;
    
    // Parametre değişimini yap
    if (params) {
      return Object.entries(params).reduce((result, [param, value]) => {
        return result.replace(`{${param}}`, value.toString());
      }, translation);
    }
    
    return translation;
  }
  
  /**
   * Aktif dili döndürür
   */
  public getLanguage(): string {
    return this.currentLanguage;
  }
} 