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

export function formatarMoeda(value) {
  return currencyFormatter.format(value)
}

export function formatarCompetencia(date) {
  return periodFormatter.format(date)
}

export function formatarNumero(value) {
  return numberFormatter.format(value)
}
