// Utility functions for formatting and masks

export function formatCPF(value: string | null | undefined): string {
  if (!value) return "-"
  const numbers = value.replace(/\D/g, "")
  if (numbers.length <= 11) {
    return numbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2")
  }
  return value
}

export function formatCNPJ(value: string | null | undefined): string {
  if (!value) return "-"
  const numbers = value.replace(/\D/g, "")
  return numbers
    .replace(/^(\d{2})(\d)/, "$1.$2")
    .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
    .replace(/\.(\d{3})(\d)/, ".$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
}

export function formatPhone(value: string | null | undefined): string {
  if (!value) return "-"
  const numbers = value.replace(/\D/g, "")
  if (numbers.length <= 10) {
    return numbers.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d)/, "$1-$2")
  }
  return numbers.replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2")
}

export function formatCEP(value: string | null | undefined): string {
  if (!value) return "-"
  const numbers = value.replace(/\D/g, "")
  return numbers.replace(/(\d{5})(\d)/, "$1-$2")
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value)
}

export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return "-"
  const dateObj = new Date(date)
  if (Number.isNaN(dateObj.getTime())) return "-"
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(dateObj)
}

export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return "-"
  const dateObj = new Date(date)
  if (Number.isNaN(dateObj.getTime())) return "-"
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(dateObj)
}

export function validateCPF(cpf: string): boolean {
  const numbers = cpf.replace(/\D/g, "")
  if (numbers.length !== 11) return false

  // Check for known invalid CPFs
  if (/^(\d)\1{10}$/.test(numbers)) return false

  // Validate check digits
  let sum = 0
  for (let i = 0; i < 9; i++) {
    sum += Number.parseInt(numbers.charAt(i)) * (10 - i)
  }
  let digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  if (digit !== Number.parseInt(numbers.charAt(9))) return false

  sum = 0
  for (let i = 0; i < 10; i++) {
    sum += Number.parseInt(numbers.charAt(i)) * (11 - i)
  }
  digit = 11 - (sum % 11)
  if (digit >= 10) digit = 0
  return digit === Number.parseInt(numbers.charAt(10))
}

export function validateCNPJ(cnpj: string): boolean {
  const numbers = cnpj.replace(/\D/g, "")
  if (numbers.length !== 14) return false
  if (/^(\d)\1{13}$/.test(numbers)) return false

  // Validate check digits
  let sum = 0
  let pos = 5
  for (let i = 0; i < 12; i++) {
    sum += Number.parseInt(numbers.charAt(i)) * pos
    pos = pos === 2 ? 9 : pos - 1
  }
  let digit = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  if (digit !== Number.parseInt(numbers.charAt(12))) return false

  sum = 0
  pos = 6
  for (let i = 0; i < 13; i++) {
    sum += Number.parseInt(numbers.charAt(i)) * pos
    pos = pos === 2 ? 9 : pos - 1
  }
  digit = sum % 11 < 2 ? 0 : 11 - (sum % 11)
  return digit === Number.parseInt(numbers.charAt(13))
}

export function validateEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}
