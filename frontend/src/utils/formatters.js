const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
})

const periodFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
})

export function formatarMoeda(value) {
  return currencyFormatter.format(value)
}

export function formatarCompetencia(date) {
  return periodFormatter.format(date)
}
