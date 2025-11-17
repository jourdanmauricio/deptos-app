const ones = ['', 'UNO', 'DOS', 'TRES', 'CUATRO', 'CINCO', 'SEIS', 'SIETE', 'OCHO', 'NUEVE'];

const teens = [
  'DIEZ',
  'ONCE',
  'DOCE',
  'TRECE',
  'CATORCE',
  'QUINCE',
  'DIECISÉIS',
  'DIECISIETE',
  'DIECIOCHO',
  'DIECINUEVE',
];

const tens = [
  '',
  '',
  'VEINTE',
  'TREINTA',
  'CUARENTA',
  'CINCUENTA',
  'SESENTA',
  'SETENTA',
  'OCHENTA',
  'NOVENTA',
];

const scales = ['', 'MIL', 'MILLÓN', 'MIL MILLONES', 'BILLÓN'];

function convertIntegerToText(num: number): string {
  if (num === 0) return '';

  let result = '';
  let scaleIndex = 0;

  while (num > 0) {
    const group = num % 1000;

    if (group !== 0) {
      let groupText = '';

      // Centenas
      const hundreds = Math.floor(group / 100);
      if (hundreds > 0) {
        if (hundreds === 1) {
          groupText = 'CIENTO';
        } else {
          groupText = [
            '',
            'CIENTO',
            'DOSCIENTOS',
            'TRESCIENTOS',
            'CUATROCIENTOS',
            'QUINIENTOS',
            'SEISCIENTOS',
            'SETECIENTOS',
            'OCHOCIENTOS',
            'NOVECIENTOS',
          ][hundreds];
        }
      }

      // Decenas y unidades
      const remainder = group % 100;
      if (remainder >= 10 && remainder < 20) {
        if (groupText) groupText += ' ';
        groupText += teens[remainder - 10];
      } else {
        const tensDigit = Math.floor(remainder / 10);
        const onesDigit = remainder % 10;

        if (tensDigit === 2 && onesDigit > 0) {
          // Números 21-29: VEINTIUNO, VEINTIDÓS, VEINTICUATRO, etc.
          if (groupText) groupText += ' ';
          groupText += 'VEINTI' + ones[onesDigit];
        } else if (tensDigit > 0) {
          if (groupText) groupText += ' ';
          groupText += tens[tensDigit];

          if (onesDigit > 0) {
            groupText += ' Y ' + ones[onesDigit];
          }
        } else if (onesDigit > 0) {
          if (groupText) groupText += ' ';
          groupText += ones[onesDigit];
        }
      }

      if (scaleIndex > 0 && group > 0) {
        groupText += ' ' + scales[scaleIndex];
      }

      if (result) {
        result = groupText + ' ' + result;
      } else {
        result = groupText;
      }
    }

    num = Math.floor(num / 1000);
    scaleIndex++;
  }

  return result.trim();
}

export function numberToText(num: number): string {
  // Manejar decimales
  const decimalPart = num % 1;
  if (decimalPart !== 0) {
    const integerPart = Math.floor(num);
    const integerText = convertIntegerToText(integerPart);

    // Redondear a 2 decimales para comparar
    const rounded = Math.round(decimalPart * 100) / 100;

    if (Math.abs(rounded - 0.5) < 0.01) {
      return integerText ? `${integerText} Y MEDIO` : 'MEDIO';
    } else if (Math.abs(rounded - 0.25) < 0.01) {
      return integerText ? `${integerText} Y CUARTO` : 'CUARTO';
    } else if (Math.abs(rounded - 0.75) < 0.01) {
      return integerText ? `${integerText} Y TRES CUARTOS` : 'TRES CUARTOS';
    }
  }

  if (num === 0) return 'CERO';

  return convertIntegerToText(num);
}
