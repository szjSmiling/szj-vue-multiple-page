import * as Reg from '@/constants/RegularConstants';

const rules = {
  'UPI': {
    getMessage: field => 'Please enter a valid VPA!',
    validate: (value, args) => {
      return Reg.UPI.test(value.trim())
    }
  }
}
export default rules;
