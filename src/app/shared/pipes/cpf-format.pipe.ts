import { Pipe, PipeTransform } from '@angular/core';
import {
  LENGTH_CPF_WITHOUT_FORMAT,
  REGEX_CPF_CHARACTERS,
} from '../constants/CPF.constant';

@Pipe({ name: 'cpfFormat' })
export class CPFFormatPipe implements PipeTransform {
  transform(value: string, addZeros: boolean = false): string {
    if (!value) {
      return '';
    }

    let cpfString = this.removeCharacters(value);

    if (addZeros && cpfString.length < LENGTH_CPF_WITHOUT_FORMAT) {
      cpfString =
        '0'.repeat(LENGTH_CPF_WITHOUT_FORMAT - cpfString.length) + cpfString;
    }

    const digits = 3;
    if (cpfString.length <= digits) {
      return cpfString;
    }

    const firstThreeDigitsGroup = cpfString.substr(0, digits);
    cpfString = cpfString.substr(digits);

    if (cpfString.length <= digits) {
      return `${firstThreeDigitsGroup}.${cpfString}`;
    }

    const secondThreeDigitsGroup = cpfString.substr(0, digits);
    cpfString = cpfString.substr(digits);

    if (cpfString.length <= digits) {
      return `${firstThreeDigitsGroup}.${secondThreeDigitsGroup}.${cpfString}`;
    }

    const thirdThreeDigitsGroup = cpfString.substr(0, digits);
    cpfString = cpfString.substr(digits);
    return `${firstThreeDigitsGroup}.${secondThreeDigitsGroup}.${thirdThreeDigitsGroup}-${cpfString}`;
  }

  removeCharacters(cpf: string): string {
    return cpf.replace(REGEX_CPF_CHARACTERS, '');
  }
}
