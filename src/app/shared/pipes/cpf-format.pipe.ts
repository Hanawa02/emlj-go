import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'cpfFormat' })
export class CPFFormatPipe implements PipeTransform {
  transform(value: number): string {
    if (!value) {
      return '';
    }
    let cpfString = value.toString();

    if (cpfString.length < 9) {
      return cpfString;
    }

    const verifyingDigits = cpfString.substr(cpfString.length - 2, 2);
    cpfString = cpfString.substr(0, cpfString.length - 2);

    const thirdThreeDigits = cpfString.substr(cpfString.length - 3, 3);
    cpfString = cpfString.substr(0, cpfString.length - 3);

    const secondThreeDigits = cpfString.substr(cpfString.length - 3, 3);
    cpfString = cpfString.substr(0, cpfString.length - 3);

    const firstThreeDigits =
      cpfString.length === 3
        ? cpfString
        : cpfString.length === 2
        ? '0' + cpfString
        : '00' + cpfString;

    return `${firstThreeDigits}.${secondThreeDigits}.${thirdThreeDigits}-${verifyingDigits}`;
  }
}
