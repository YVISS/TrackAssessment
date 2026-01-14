'use client'
export default function TestPage() {
  async function createTodo() {
    await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Hello from fetch' })
    })
  }

  async function readTodos() {
    const res = await fetch('/api/todos')
    console.log(await res.json())
  }

  async function updateTodo(id: string) {
    await fetch(`/api/todos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: true })
    })
  }

  async function deleteTodo(id: string) {
    await fetch(`/api/todos/${id}`, {
      method: 'DELETE'
    })
  }

  return (
    <div style={{ padding: 20 }}>
      <button onClick={createTodo}>Create</button>
      <button onClick={readTodos}>Read (check console)</button>
    </div>
  )
}
