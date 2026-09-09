function PagePlaceholder({ description, eyebrow, id, message, title }: { description: string; eyebrow: string; id: string; message: string; title: string }) {
  return (
    <main id={id}>
      <section className="page-heading" aria-labelledby={`${id}-title`}>
        <div>
          <p className="eyebrow">{eyebrow}</p>
          <h1 id={`${id}-title`}>{title}</h1>
          <p className="subtitle">{description}</p>
        </div>
      </section>

      <section className="empty-state-card" aria-label={`Estado da página ${title}`}>
        <span className="empty-state-mark" aria-hidden="true">f.</span>
        <div>
          <p className="card-label">PÁGINA PREPARADA</p>
          <h2>{message}</h2>
          <p>Este espaço já possui uma rota própria e poderá receber sua funcionalidade futuramente.</p>
        </div>
      </section>
    </main>
  )
}

export default PagePlaceholder
