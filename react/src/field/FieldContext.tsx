import { createContext, useContext } from 'react';

/** A Field által a benne lévő mezőnek átadott azonosítók és állapot (aria-összekötés). */
export type FieldCtx = {
  id: string;
  describedBy: string | undefined;
  invalid: boolean;
  required: boolean;
  disabled: boolean;
};

export const FieldContext = createContext<FieldCtx | null>(null);
export const useFieldContext = () => useContext(FieldContext);
