export class FormValidator {
  validateData(data) {
    return [
      this.checkName(data.full_name),
      this.checkEmail(data.email),
      this.checkPhoneNumber(data.phone_number),
    ];
  }

  checkName(nameStr) {
    const MAX_NAME_LENGTH = 50;

    if (nameStr.length <= 0) {
      return { valid: false, error: "Full name cannot be empty." };
    }

    if (!/^[A-Za-z\s]+$/.test(nameStr)) {
      return { valid: false, error: "Name contains invalid characters. Only alphabetic characters and spaces are allowed." };
    }

    if (nameStr.length > MAX_NAME_LENGTH) {
      return { valid: false, error: `Name is too long. Maximum length is ${MAX_NAME_LENGTH} characters.` };
    }

    return { valid: true, error: null };
  }

  checkEmail(emailStr) {
    const MAX_EMAIL_LENGTH = 320;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (emailStr.length <= 0) {
      return { valid: false, error: "Email cannot be empty." };
    }

    if (!emailRegex.test(emailStr)) {
      return { valid: false, error: "Invalid email format." };
    }

    if (emailStr.length > MAX_EMAIL_LENGTH) {
      return { valid: false, error: `Email is too long. Maximum length is ${MAX_EMAIL_LENGTH} characters.` };
    }

    return { valid: true, error: null };
  }

  checkPhoneNumber(numStr) {
    const phoneRegex = /^[0-9]{10}$/;

    if (numStr.length <= 0) {
      return { valid: false, error: "Phone number cannot be empty." };
    }

    if (!phoneRegex.test(numStr)) {
      return { valid: false, error: "Phone number must be exactly 10 digits, with no additional characters." };
    }

    return { valid: true, error: null };
  }

  checkTag(tagStr) {
    const MAX_TAG_LENGTH = 15;

    const tagRegex = /^[a-zA-Z0-9_-]+$/;

    if (tagStr.length <= 0) {
      return { valid: false, error: "Tag name cannot be empty." };
    }

    if (!tagRegex.test(tagStr)) {
      return { valid: false, error: "Tag name contains invalid characters. Only alphanumeric characters, underscores, and dashes are allowed." };
    }

    if (tagStr.length > MAX_TAG_LENGTH) {
      return { valid: false, error: `Tag name is too long. Maximum length is ${MAX_TAG_LENGTH} characters.` };
    }

    return { valid: true, error: null };
  }

  checkErrors(validatorResults) {
    let errors = [];

    validatorResults.forEach(result => {
      if (!result.valid) {
        errors.push(result.error);
      }
    });

    return errors;
  }
}