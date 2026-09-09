const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const periodFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
})

const numberFormatter = new Intl.NumberFormat('pt-BR', {
  maximumFractionDigits: 2,
})

export function formatarMoeda(value: number) {
  return currencyFormatter.format(value)
}

export function formatarCompetencia(date: Date) {
  return periodFormatter.format(date)
}

export function formatarNumero(value: number) {
  return numberFormatter.format(value)
}
