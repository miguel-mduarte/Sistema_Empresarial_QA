import colaboradoresIniciais from '../data/colaboradores.json'

const STORAGE_KEY = 'folha-clara:colaboradores'

export function listarColaboradores() {
  const storedValue = window.localStorage.getItem(STORAGE_KEY)

  if (!storedValue) return [...colaboradoresIniciais]

  try {
    const employees = JSON.parse(storedValue)
    return Array.isArray(employees) ? employees : [...colaboradoresIniciais]
  } catch {
    return [...colaboradoresIniciais]
  }
}

export function cadastrarColaborador(employee) {
  const employees = listarColaboradores()
  const registrationAlreadyExists = employees.some(
    ({ matricula }) => matricula.toLocaleLowerCase('pt-BR') === employee.matricula.toLocaleLowerCase('pt-BR'),
  )

  if (registrationAlreadyExists) {
    throw new Error('Já existe um colaborador com essa matrícula.')
  }

  const newEmployee = {
    ...employee,
    id: crypto.randomUUID(),
    salarioFinal: employee.salarioBase,
    criadoEm: new Date().toISOString(),
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...employees, newEmployee]))
  return newEmployee
}
