import { useEffect, useState } from "react";
import Amplify from "aws-amplify";
import awsExports from "../aws-exports"; // adjust the path if needed
import type { Schema } from "../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

// Configure Amplify with the AWS exports
Amplify.configure(awsExports);

const client = generateClient<Schema>();

function App() {
  const [todos, setTodos] = useState<Array<Schema["Todo"]["type"]>>([]);

  useEffect(() => {
    // Subscribe to changes in Todo items
    const subscription = client.models.Todo.observeQuery().subscribe({
      next: (data) => setTodos([...data.items]),
    });
    // Cleanup subscription on unmount
    return () => subscription.unsubscribe();
  }, []);

  function createTodo() {
    const content = window.prompt("Todo content");
    if (content) {
      client.models.Todo.create({ content });
    }
  }

  function deleteTodo(id: string) {
    client.models.Todo.delete({ id });
  }

  return (
    <main>
      <h1>My todos</h1>
      <button onClick={createTodo}>+ new</button>
      <ul>
        {todos.map((todo) => (
          <li 
            key={todo.id}
            onClick={() => deleteTodo(todo.id)}
          >
            {todo.content}
          </li>
        ))}
      </ul>
      <div>
        🥳 App successfully hosted. Try creating a new todo.
        <br />
        <a href="https://docs.amplify.aws/react/start/quickstart/#make-frontend-updates">
          Review next step of this tutorial.
        </a>
      </div>
    </main>
  );
}

export default App;
