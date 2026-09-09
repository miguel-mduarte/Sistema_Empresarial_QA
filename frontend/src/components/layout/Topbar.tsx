function Topbar({ currentPage }: { currentPage: string }) {
  return (
    <header className="topbar">
      <span>Meu escritório <i>/</i> <strong>{currentPage}</strong></span>
      <small>GESTÃO DE PAGAMENTOS</small>
    </header>
  )
}

export default Topbar
