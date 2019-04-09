export const name = /^[A-Za-z\s'-.]*[A-Za-z]+[A-Za-z\s'-.]*$/;
export const mobile = /^\d{7,13}$/;
export const phoneNumber = /^(([\d]+\s)?[\d]{6,20},)*(([\d]+\s)?[\d]{6,20})$/;
export const email = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,6}$/;

export const gstNumber = /^[0-9a-zA-Z]{1,20}$/;
export const gstName = /^[A-Za-z\d\-.\s]{1,200}$/;
export const gstPhone = /^[0-9]{10,20}$/;

export const passport = /^[a-zA-Z0-9]{5,17}$/;
export const UPI = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@[A-Za-z\d]+/;

export const BankCardAddSpace = /((?<=)\d{4})/g;
