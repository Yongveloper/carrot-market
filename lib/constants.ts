export const PASSWORD_MIN_LENGTH = 4;

export const PASSWORD_REGEX = new RegExp(
  /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).+$/,
);

export const PASSWORD_REGEX_ERROR =
  'A password must have lowercase, UPPERCASE, a number and special characters.';
