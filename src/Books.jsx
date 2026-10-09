import { useState } from 'react'
import { clean, positive } from './data'

export default function Books({ books, setBooks, orders, canManage }) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [genre, setGenre] = useState('')
  const [isbn, setIsbn] = useState('')
  const [qty, setQty] = useState('')
  const [msg, setMsg] = useState(null)

  const showMsg = (text, good = false) => setMsg({ text, good })

  // Member: view only
  if (!canManage) {
    return (
      <>
        <h2>Available Books</h2>
        <div className="card">
          <p>Members can view books here. Orders are placed in Transactions.</p>
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Genre</th>
                  <th>ISBN</th>
                  <th>Available</th>
                </tr>
              </thead>
              <tbody>
                {books.map((b) => (
                  <tr
                    key={b.isbn}
                    className={Number(b.quantity) < 2 ? 'low-stock' : ''}
                  >
                    <td>{b.title}</td>
                    <td>{b.author}</td>
                    <td>{b.genre}</td>
                    <td>{b.isbn}</td>
                    <td>{b.quantity}</td>
                  </tr>
                ))}
                {books.length === 0 && (
                  <tr>
                    <td colSpan={5}>No books available.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </>
    )
  }

  // Staff: add / manage
  const addBook = (e) => {
    e.preventDefault()
    const t = clean(title)
    const a = clean(author)
    const g = clean(genre)
    const i = clean(isbn)
    const q = positive(qty)

    if (!/^[0-9]+$/.test(i)) {
      showMsg('ISBN must contain numbers only.')
      return
    }
    if (!q) {
      showMsg('Quantity must be at least 1.')
      return
    }
    if (books.some((b) => b.isbn === i)) {
      showMsg('That ISBN already exists.')
      return
    }

    setBooks([...books, { title: t, author: a, genre: g, isbn: i, quantity: q }])
    setTitle('')
    setAuthor('')
    setGenre('')
    setIsbn('')
    setQty('')
    showMsg('Book added successfully.', true)
  }

  const updateBook = (index) => {
    const b = books[index]
    const t = prompt('Title:', b.title)
    if (t === null) return
    const a = prompt('Author:', b.author)
    if (a === null) return
    const g = prompt('Genre:', b.genre)
    if (g === null) return
    const isbnNew = prompt('ISBN numbers only:', b.isbn)
    if (isbnNew === null) return
    const q = prompt('Quantity:', b.quantity)
    if (q === null) return

    if (!/^[0-9]+$/.test(clean(isbnNew)) || !positive(q)) {
      alert('Enter a valid ISBN and quantity.')
      return
    }
    if (books.some((x, n) => n !== index && x.isbn === clean(isbnNew))) {
      alert('That ISBN already exists.')
      return
    }

    setBooks(
      books.map((x, n) =>
        n === index
          ? {
              title: clean(t),
              author: clean(a),
              genre: clean(g),
              isbn: clean(isbnNew),
              quantity: positive(q),
            }
          : x
      )
    )
  }

  const deleteBook = (index) => {
    const b = books[index]
    if (!confirm(`Delete "${b.title}"?`)) return
    if (
      orders.some(
        (o) =>
          o.bookIsbn === b.isbn &&
          ['Pending', 'Approved', 'Borrowed'].includes(o.status)
      )
    ) {
      alert('This book has an active order.')
      return
    }
    setBooks(books.filter((_, n) => n !== index))
  }

  return (
    <>
      <h2>Book Management</h2>
      <div className="card">
        <h3>Add Book</h3>
        <form onSubmit={addBook}>
          <input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <input
            placeholder="Author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            required
          />
          <input
            placeholder="Genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            required
          />
          <input
            placeholder="ISBN (numbers only)"
            inputMode="numeric"
            pattern="[0-9]+"
            value={isbn}
            onChange={(e) => setIsbn(e.target.value)}
            required
          />
          <input
            type="number"
            min="1"
            placeholder="Initial quantity"
            value={qty}
            onChange={(e) => setQty(e.target.value)}
            required
          />
          <button type="submit">Add Book</button>
          {msg && (
            <div className={`message ${msg.good ? 'good' : 'bad'}`}>{msg.text}</div>
          )}
        </form>
      </div>

      <div className="card">
        <h3>Manage Books</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Title</th>
                <th>Author</th>
                <th>Genre</th>
                <th>ISBN</th>
                <th>Quantity</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {books.map((b, i) => (
                <tr
                  key={b.isbn}
                  className={Number(b.quantity) < 2 ? 'low-stock' : ''}
                >
                  <td>{b.title}</td>
                  <td>{b.author}</td>
                  <td>{b.genre}</td>
                  <td>{b.isbn}</td>
                  <td>{b.quantity}</td>
                  <td className="actions">
                    <button type="button" onClick={() => updateBook(i)}>
                      Update
                    </button>
                    <button
                      type="button"
                      className="danger"
                      onClick={() => deleteBook(i)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {books.length === 0 && (
                <tr>
                  <td colSpan={6}>No books yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}