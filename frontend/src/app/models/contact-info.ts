export interface ContactInfo {
  name: string;
  phone: {
    countryCode: string;
    dialCode: string;
    e164Number: string;
    internationalNumber: string;
    nationalNumber: string;
    number: string;
  };
  email: string;
  language: string;
  contactOption: string;
}
