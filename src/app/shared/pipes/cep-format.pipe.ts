import { Pipe, PipeTransform } from '@angular/core';
import {
  LENGTH_CEP_WITHOUT_FORMAT,
  REGEX_CEP_CHARACTERS,
} from '../constants/CEP.constant';

@Pipe({ name: 'cepFormat' })
export class CEPFormatPipe implements PipeTransform {
  transform(value: string, addZeros: boolean = false): string {
    if (!value) {
      return '';
    }

    let cepString = this.removeCharacters(value);

    if (addZeros && cepString.length < LENGTH_CEP_WITHOUT_FORMAT) {
      cepString =
        '0'.repeat(LENGTH_CEP_WITHOUT_FORMAT - cepString.length) + cepString;
    }

    let digits = 2;
    if (cepString.length <= digits) {
      return cepString;
    }

    const firstThreeDigitsGroup = cepString.substr(0, digits);
    cepString = cepString.substr(digits);

    digits = 3;
    if (cepString.length <= digits) {
      return `${firstThreeDigitsGroup}.${cepString}`;
    }

    const secondThreeDigitsGroup = cepString.substr(0, digits);
    cepString = cepString.substr(digits);

    return `${firstThreeDigitsGroup}.${secondThreeDigitsGroup}-${cepString}`;
  }

  removeCharacters(cep: string): string {
    return cep.replace(REGEX_CEP_CHARACTERS, '');
  }
}
