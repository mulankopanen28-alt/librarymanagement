import { useState } from 'react'
import { clean } from './data'

export default function Users({ users, setUsers, currentUser }) {
  const [name, setName] = useState('')
  const [membershipId, setMembershipId] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('Member')
  const [approved, setApproved] = useState('true')
  const [msg, setMsg] = useState(null)

  const addUser = (e) => {
    e.preventDefault()
    const n = clean(name)
    const mid = clean(membershipId)
    const pw = password
    const r = role
    const ok = approved === 'true'

    if (users.some((u) => u.membershipId.toLowerCase() === mid.toLowerCase())) {
      setMsg({ text: 'Membership ID already exists.', good: false })
      return
    }

    setUsers([
      ...users,
      { name: n, membershipId: mid, password: pw, role: r, approved: ok },
    ])
    setName('')
    setMembershipId('')
    setPassword('')
    setRole('Member')
    setApproved('true')
    setMsg({ text: 'User added successfully.', good: true })
  }

  const updateUser = (index) => {
    const u = users[index]
    const n = prompt('Name:', u.name)
    if (n === null) return
    const mid = prompt('Membership ID:', u.membershipId)
    if (mid === null) return
    const pw = prompt('Password:', u.password)
    if (pw === null) return
    const r = prompt('Role: Member, Librarian or Admin', u.role)
    if (r === null) return
    const ok = confirm('OK = approved, Cancel = pending.')

    if (!['Member', 'Librarian', 'Admin'].includes(r)) {
      alert('Invalid role.')
      return
    }
    if (
      users.some(
        (x, k) =>
          k !== index &&
          x.membershipId.toLowerCase() === clean(mid).toLowerCase()
      )
    ) {
      alert('Membership ID already exists.')
      return
    }

    setUsers(
      users.map((x, k) =>
        k === index
          ? {
              name: clean(n),
              membershipId: clean(mid),
              password: pw,
              role: r,
              approved: ok,
            }
          : x
      )
    )
  }

  const deleteUser = (index) => {
    if (!confirm(`Delete ${users[index].name}?`)) return
    setUsers(users.filter((_, k) => k !== index))
  }

  return (
    <>
      <h2>User Management</h2>
      <div className="card">
        <h3>Add User</h3>
        <form onSubmit={addUser}>
          <input
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            placeholder="Membership ID"
            value={membershipId}
            onChange={(e) => setMembershipId(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option>Member</option>
            <option>Librarian</option>
            <option>Admin</option>
          </select>
          <select value={approved} onChange={(e) => setApproved(e.target.value)}>
            <option value="true">Approved</option>
            <option value="false">Pending approval</option>
          </select>
          <button type="submit">Add User</button>
          {msg && (
            <div className={`message ${msg.good ? 'good' : 'bad'}`}>{msg.text}</div>
          )}
        </form>
      </div>

      <div className="card">
        <h3>Accounts</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>ID</th>
                <th>Role</th>
                <th>Approval</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u, i) => (
                <tr key={u.membershipId}>
                  <td>{u.name}</td>
                  <td>{u.membershipId}</td>
                  <td>{u.role}</td>
                  <td>{u.approved === false ? 'Pending' : 'Approved'}</td>
                  <td className="actions">
                    <button type="button" onClick={() => updateUser(i)}>
                      Update
                    </button>
                    {u.membershipId !== currentUser.membershipId && (
                      <button
                        type="button"
                        className="danger"
                        onClick={() => deleteUser(i)}
                      >
                        Delete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}