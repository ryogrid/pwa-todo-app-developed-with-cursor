let db;

const initDb = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('TodoDB', 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => {
      db = request.result;
      resolve(db);
    };

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains('todos')) {
        db.createObjectStore('todos', { keyPath: 'id', autoIncrement: true });
      }
    };
  });
};

export const TodoDb = {
  async getAllTodos() {
    if (!db) await initDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['todos'], 'readonly');
      const store = transaction.objectStore('todos');
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async addTodo(todo) {
    if (!db) await initDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['todos'], 'readwrite');
      const store = transaction.objectStore('todos');
      const request = store.add(todo);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async updateTodo(todo) {
    if (!db) await initDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['todos'], 'readwrite');
      const store = transaction.objectStore('todos');
      const request = store.put(todo);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  },

  async deleteTodo(id) {
    if (!db) await initDb();
    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['todos'], 'readwrite');
      const store = transaction.objectStore('todos');
      const request = store.delete(id);

      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }
}; 