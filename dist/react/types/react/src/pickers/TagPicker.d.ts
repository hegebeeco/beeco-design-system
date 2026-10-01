import { type FieldProps } from '../field/Field';
import { type ComboOption } from './Combobox';
export type TagPickerProps = FieldProps & {
    options: ReadonlyArray<ComboOption>;
    value: string[];
    onChange: (v: string[]) => void;
    /** Legfeljebb ennyi címke választható */
    max?: number;
    /** Új címke létrehozása; visszaadja az értékét */
    onCreate?: (label: string) => string | Promise<string>;
    /** Eddig felhő, fölötte keresős legördülő (Javaslat 01 – 4A) */
    cloudLimit?: number;
};
/** TagPicker (molekula, 4A): ≤ 20 címkénél kattintható felhő, fölötte a Combobox többes módja – egy API. */
export declare function TagPicker({ options, value, onChange, max, onCreate, cloudLimit, ...field }: TagPickerProps): import("react").JSX.Element;
