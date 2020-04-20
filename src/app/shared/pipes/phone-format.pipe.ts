import { Pipe, PipeTransform } from '@angular/core';
import {
  REGEX_PHONE_CHARACTERS,
  LENGTH_PHONE_WITHOUT_DDD,
  LENGTH_PHONE_WITH_CELLPHONE_DIGIT,
  LENGTH_PHONE_WITH_DDD,
  LENGTH_PHONE_WITH_DDD_AND_CELLPHONE_DIGIT,
  LENGTH_PHONE_COMPLETE_WITHOUT_CELL_PHONE_DIGIT,
  LENGTH_PHONE_COMPLETE_WITH_CELL_PHONE_DIGIT,
} from '../constants/phone.constant';
import { treatNumericValueToString } from '../constants/auxiliar-functions.constant';

@Pipe({ name: 'phoneFormat' })
export class PhoneFormatPipe implements PipeTransform {
  transform(value: string, addDefaultDDD: boolean = false): string {
    value = treatNumericValueToString(value);

    if (!value) {
      return;
    }

    let phoneString = this.removeCharacters(value);

    const completeNumber =
      phoneString.length > LENGTH_PHONE_WITH_DDD_AND_CELLPHONE_DIGIT;

    const withCellPhoneDigit =
      phoneString.length !== LENGTH_PHONE_WITHOUT_DDD &&
      phoneString.length !== LENGTH_PHONE_WITH_DDD &&
      phoneString.length !== LENGTH_PHONE_COMPLETE_WITHOUT_CELL_PHONE_DIGIT;

    const withCountryCode = this.formatWithCountryCode(phoneString);

    const baseNumber = phoneString.length === LENGTH_PHONE_WITHOUT_DDD;
    const cellPhoneNumber =
      phoneString.length === LENGTH_PHONE_WITH_CELLPHONE_DIGIT;

    if (addDefaultDDD && !completeNumber) {
      phoneString = ''.concat(
        '55',
        baseNumber || cellPhoneNumber ? '62' : '',
        phoneString
      );
    }

    if (phoneString.length <= LENGTH_PHONE_WITHOUT_DDD) {
      return this.formatNumberWithoutDDD(phoneString);
    }

    const digitsCellPhone = withCellPhoneDigit ? 1 : 0;
    const digitsCountryCode = withCountryCode
      ? this.getCountryCodeDigits(phoneString, digitsCellPhone)
      : 0;

    const digitsDDD =
      phoneString.length -
      LENGTH_PHONE_WITHOUT_DDD -
      digitsCellPhone -
      digitsCountryCode;

    const countryCodeDigits = phoneString.substr(0, digitsCountryCode);
    phoneString = phoneString.substr(digitsCountryCode);

    const DDD = phoneString.substr(0, digitsDDD);
    phoneString = phoneString.substr(digitsDDD);

    const cellPhoneDigit = phoneString.substr(0, digitsCellPhone);
    phoneString = phoneString.substr(digitsCellPhone);

    const baseNumbers = this.formatNumberWithoutDDD(phoneString);

    const formatedPhone = ''.concat(
      withCountryCode ? `+${countryCodeDigits} ` : '',
      `(${DDD}) `,
      withCellPhoneDigit ? `${cellPhoneDigit} ` : '',
      baseNumbers
    );

    return formatedPhone;
  }

  removeCharacters(phone: string): string {
    phone = treatNumericValueToString(phone);
    return phone.replace(REGEX_PHONE_CHARACTERS, '');
  }

  formatNumberWithoutDDD(phoneString: string): string {
    const digits = 4;
    if (phoneString.length <= digits) {
      return phoneString;
    }

    const firstGroupOfDigits = phoneString.substr(0, digits);
    phoneString = phoneString.substr(digits);

    return `${firstGroupOfDigits}-${phoneString}`;
  }

  formatWithCountryCode(phone: string): boolean {
    return phone.length > LENGTH_PHONE_WITH_DDD_AND_CELLPHONE_DIGIT;
  }

  getCountryCodeDigits(phone: string, digitCellPhone: number): number {
    return phone.length - (LENGTH_PHONE_WITH_DDD + digitCellPhone);
  }
}
