'use client'

export default function PageSection({ children, className = '' }) {
  return (
    <div className={`bg-dark border border-border rounded-md p-6 overflow-visible ${className}`}>
      {children}
    </div>
  )
}
