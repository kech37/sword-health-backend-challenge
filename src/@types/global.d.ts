export {};

interface UnitUUID {
  unit?: 'UUID';
}

interface UnitDateString {
  unit?: 'DateString';
}

declare global {
  /**
   * An UUID
   * @format uuid
   * @pattern ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$
   */
  type UUID = string & UnitUUID;

  /**
   * ISO 8601 date format
   * @format date
   * @pattern ^\d{4}(-\d\d(-\d\d(T\d\d:\d\d(:\d\d)?(\.\d+)?(([+-]\d\d:\d\d)|Z)?)?)?)?$
   */
  type DateString = string & UnitDateString;
}
