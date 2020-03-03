import { z } from "zod";

const NAME_PATTERN = /^[a-zA-ZÀ-ÿ\s'-]{2,50}$/;
const FLIGHT_PATTERN = /^[A-Z]{2,3}\d{1,4}[A-Z]?$/i;

export type FieldErrors = Record<string, string>;

function toFieldErrors(error: z.ZodError): FieldErrors {
  const errors: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0]?.toString() ?? "form";
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}

export function luhnCheck(cardNumber: string): boolean {
  const digits = cardNumber.replace(/\D/g, "");
  if (digits.length < 13 || digits.length > 19) return false;

  let sum = 0;
  let alternate = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alternate) {
      n *= 2;
      if (n > 9) n -= 9;
    }
    sum += n;
    alternate = !alternate;
  }
  return sum % 10 === 0;
}

function isExpiryValid(expiry: string): boolean {
  const match = expiry.match(/^(0[1-9]|1[0-2])\/(\d{2})$/);
  if (!match) return false;

  const month = parseInt(match[1], 10);
  const year = 2000 + parseInt(match[2], 10);
  const expiryEnd = new Date(year, month, 0, 23, 59, 59);
  const now = new Date();
  return expiryEnd >= now;
}

export const customerDetailsSchema = z.object({
  firstName: z
    .string()
    .trim()
    .min(2, "First name must be at least 2 characters")
    .max(50, "First name is too long")
    .regex(NAME_PATTERN, "First name can only contain letters"),
  lastName: z
    .string()
    .trim()
    .min(2, "Last name must be at least 2 characters")
    .max(50, "Last name is too long")
    .regex(NAME_PATTERN, "Last name can only contain letters"),
  email: z.string().trim().email("Enter a valid email address"),
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .refine((value) => {
      const digits = value.replace(/\D/g, "");
      return digits.length >= 10 && digits.length <= 15;
    }, "Enter a valid phone number (at least 10 digits)"),
  passengers: z
    .number({ invalid_type_error: "Enter a valid passenger count" })
    .int()
    .min(1, "At least 1 passenger required")
    .max(8, "Maximum 8 passengers"),
  luggage: z
    .number({ invalid_type_error: "Enter a valid luggage count" })
    .int()
    .min(0, "Luggage cannot be negative")
    .max(8, "Maximum 8 bags"),
  flightNumber: z
    .string()
    .trim()
    .optional()
    .default("")
    .refine(
      (value) => value === "" || FLIGHT_PATTERN.test(value.replace(/\s/g, "")),
      "Enter a valid flight number (e.g. BA123, EZY456)"
    ),
  notes: z.string().max(500, "Notes must be 500 characters or less").optional(),
});

export const paymentCardSchema = z.object({
  cardName: z
    .string()
    .trim()
    .min(2, "Name on card is required")
    .max(50, "Name on card is too long")
    .regex(NAME_PATTERN, "Enter the cardholder name as shown on the card"),
  cardNumber: z
    .string()
    .trim()
    .min(1, "Card number is required")
    .refine((value) => luhnCheck(value), "Enter a valid card number"),
  expiry: z
    .string()
    .trim()
    .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, "Use MM/YY format")
    .refine(isExpiryValid, "Card has expired"),
  cvc: z
    .string()
    .trim()
    .regex(/^\d{3,4}$/, "Enter a valid 3 or 4 digit CVC"),
});

export type CustomerDetailsInput = z.infer<typeof customerDetailsSchema>;
export type PaymentCardInput = z.infer<typeof paymentCardSchema>;

export function validateCustomerDetails(data: unknown) {
  const result = customerDetailsSchema.safeParse(data);
  if (!result.success) {
    return { ok: false as const, errors: toFieldErrors(result.error) };
  }
  return { ok: true as const, data: result.data };
}

export function validatePaymentCard(data: unknown) {
  const result = paymentCardSchema.safeParse(data);
  if (!result.success) {
    return { ok: false as const, errors: toFieldErrors(result.error) };
  }
  return { ok: true as const, data: result.data };
}

export function formatCardNumber(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 19);
  return digits.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
}

export function formatExpiry(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}
