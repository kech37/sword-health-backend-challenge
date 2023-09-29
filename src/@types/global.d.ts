export {};

interface UnitUUID {
  unit?: 'UUID';
}

declare global {
  /**
   * An UUID
   * @format uuid
   * @pattern ^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$
   */
  type UUID = string & UnitUUID;
}
