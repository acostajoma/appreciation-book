import { formatNumberWithCommas } from "$lib/formatters/number";

export const invalid_type_error = 'Este campo ha sido rellenado con datos inválidos.';
export const invalid_type_select_from_list = 'Este campo ha sido rellenado con datos inválidos. Por favor, seleccione uno manualmente desde la lista.';
export const greater_than = (num: number, formatNumber = true) => `El campo debe ser mayor que ${formatNumber ? formatNumberWithCommas(num) : num}.`;
export const greater_or_equal_than = (num: number, formatNumber = true) =>
	`El campo debe ser mayor o igual que ${formatNumber ? formatNumberWithCommas(num) : num}.`;
export const less_than_error = (num: number, formatNumber = true) => `El campo debe ser menor que ${formatNumber ? formatNumberWithCommas(num) : num}.`;
export const less_or_equal_than = (num: number, formatNumber = true ) =>
	`El campo debe ser menor o igual que ${formatNumber ? formatNumberWithCommas(num) : num}.`;
export const max_length_error = (num: number) =>
	`El campo puede tener un máximo de ${num} caracteres.`;
export const min_length_error = (num: number) => `El campo debe tener al menos ${num} caracteres.`;
export const multiple_of_error = (num: number) => `El campo debe se múltiplo de ${num}.`;
export const must_be_integer_error = 'El valor debe ser un número entero.';
export const mismatching_passwords_error = 'Las contraseñas no coinciden.';
export const not_in_the_list_error = 'El valor debe ser alguno de los indicados en la lista.';
export const required_error = 'Este campo es requerido.';
export const invalid_format = (format: string) => `El formato es inválido: ${format}`;
export const exactly_length_error = (num: number) =>
	`El campo debe tener exactamente ${num} caracteres.`;
export const invalid_phone_number = 'Número de teléfono inválido.'