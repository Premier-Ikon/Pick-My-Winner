'use client'

import { useEffect, useId, useState } from 'react'

const empty = {
  firstName: '',
  lastName: '',
  email: '',
  inquiry: '',
}

export default function ContactModal({ open, onClose }) {
  const titleId = useId()
  const [form, setForm] = useState(empty)
  const [status, setStatus] = useState('idle')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!open) return undefined
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const onKey = (event) => {
      if (event.key === 'Escape' && status !== 'sending') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, status])

  useEffect(() => {
    if (!open) {
      setForm(empty)
      setStatus('idle')
      setError('')
    }
  }, [open])

  if (!open) return null

  function update(field) {
    return (event) => {
      setForm((current) => ({ ...current, [field]: event.target.value }))
    }
  }

  async function submit(event) {
    event.preventDefault()
    if (status === 'sending') return
    setStatus('sending')
    setError('')
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const payload = await response.json().catch(() => ({}))
      if (!response.ok) throw new Error(payload.error || 'The message could not be sent.')
      setStatus('sent')
    } catch (submitError) {
      setStatus('idle')
      setError(submitError.message)
    }
  }

  return (
    <div className="modal-root" role="presentation" onClick={() => status !== 'sending' && onClose()}>
      <div
        className="modal-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        onClick={(event) => event.stopPropagation()}
      >
        {status === 'sent' ? (
          <>
            <p className="modal-kicker">Sent</p>
            <h2 id={titleId} className="modal-title">Thanks for reaching out.</h2>
            <p className="modal-copy">We’ll get back to you soon.</p>
            <button className="modal-submit" type="button" onClick={onClose}>
              Close
            </button>
          </>
        ) : (
          <>
            <p className="modal-kicker">Contact</p>
            <h2 id={titleId} className="modal-title">Get in touch</h2>
            <p className="modal-copy">Tell us a little about your giveaway and we’ll follow up.</p>
            <form className="modal-form" onSubmit={submit}>
              <div className="modal-row">
                <label>
                  <span>First name</span>
                  <input
                    name="firstName"
                    autoComplete="given-name"
                    value={form.firstName}
                    onChange={update('firstName')}
                    required
                  />
                </label>
                <label>
                  <span>Last name</span>
                  <input
                    name="lastName"
                    autoComplete="family-name"
                    value={form.lastName}
                    onChange={update('lastName')}
                    required
                  />
                </label>
              </div>
              <label>
                <span>Email</span>
                <input
                  type="email"
                  name="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={update('email')}
                  required
                />
              </label>
              <label>
                <span>Inquiry</span>
                <textarea
                  name="inquiry"
                  rows={5}
                  value={form.inquiry}
                  onChange={update('inquiry')}
                  required
                />
              </label>
              {error && <p className="modal-error">{error}</p>}
              <div className="modal-actions">
                <button className="modal-cancel" type="button" onClick={onClose} disabled={status === 'sending'}>
                  Cancel
                </button>
                <button className="modal-submit" type="submit" disabled={status === 'sending'}>
                  {status === 'sending' ? 'Sending…' : 'Send message'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  )
}
