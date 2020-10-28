import isEmail from "validator/lib/isEmail";

export function validEmail(value) {
  return value && !isEmail(value.trim()) ? "Invalid email" : null;
}

function isDirty(value) {
  return value || value === 0;
}

export function required(requiredFields, values) {
  return requiredFields.reduce(
    (fields, field) => ({
      ...fields,
      ...(isDirty(values[field]) ? undefined : {[field]: "Required"})
    }),
    {}
  );
}
