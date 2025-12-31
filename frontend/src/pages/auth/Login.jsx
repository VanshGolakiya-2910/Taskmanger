import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/auth.context'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)

  const submit = async (e) => {
    e.preventDefault()
    try {
      await login(form)
      navigate('/dashboard')
    } catch {
      setError('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <form
        onSubmit={submit}
        className="bg-white p-6 rounded-xl shadow-sm border w-full max-w-sm space-y-4"
      >
        <h1 className="text-xl font-semibold">Login</h1>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <input
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <input
          type="password"
          className="w-full px-4 py-2 border rounded-lg"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <button className="w-full bg-slate-900 text-white py-2 rounded-lg">
          Sign in
        </button>
      </form>
    </div>
  )
}
