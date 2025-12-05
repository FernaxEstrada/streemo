/**
 * Formatea una fecha de la BD al formato DD/MM/YYYY HH:MM:SS
 * @param date - Fecha de la BD (Date, string ISO, o timestamp)
 * @returns Fecha formateada como DD/MM/YYYY HH:MM:SS
 */
export function formatDateToDDMMYYYY(
  date: Date | string | null | undefined
): string | null {
  if (!date) return null;

  try {
    let dateStr: string;

    if (typeof date === "string") {
      dateStr = date;
    } else {
      // Si es Date, convertir a ISO string
      dateStr = date.toISOString();
    }

    // Extraer fecha y hora del string ISO (formato: YYYY-MM-DDTHH:MM:SS.SSSZ)
    const match = dateStr.match(
      /(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})/
    );
    if (!match) {
      return null;
    }

    const year = match[1];
    const month = match[2];
    const day = match[3];
    const hour = match[4];
    const minute = match[5];
    const second = match[6];

    return `${day}/${month}/${year} ${hour}:${minute}:${second}`;
  } catch (error) {
    console.error("Error en formatDateToDDMMYYYY:", error, "date:", date);
    return null;
  }
}

/**
 * Formatea una fecha de la BD al formato DD/MM/YYYY
 * @param date - Fecha de la BD (Date, string ISO, o timestamp)
 * @returns Fecha formateada como DD/MM/YYYY
 */
export function formatDateToDD_MM_YYYY(
  date: Date | string | null | undefined
): string | null {
  if (!date) return null;

  try {
    let dateStr: string;

    if (typeof date === "string") {
      dateStr = date;
    } else {
      // Si es Date, convertir a ISO string
      dateStr = date.toISOString();
    }

    // Extraer la fecha del string ISO (formato: YYYY-MM-DD o YYYY-MM-DDTHH:MM:SS.SSSZ)
    const match = dateStr.match(/(\d{4})-(\d{2})-(\d{2})/);
    if (!match) {
      return null;
    }

    const year = match[1];
    const month = match[2];
    const day = match[3];

    return `${day}/${month}/${year}`;
  } catch (error) {
    console.error("Error en formatDateToDD_MM_YYYY:", error, "date:", date);
    return null;
  }
}
