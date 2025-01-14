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
    try {
      if (!db) await initDb();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['todos'], 'readonly');
        const store = transaction.objectStore('todos');
        const request = store.getAll();

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error getting todos:', error);
      return []; // Return empty array if database is not available
    }
  },

  async addTodo(todo) {
    try {
      if (!db) await initDb();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(['todos'], 'readwrite');
        const store = transaction.objectStore('todos');
        
        // Add timestamp for offline sync
        const todoWithTimestamp = {
          ...todo,
          createdAt: Date.now(),
          syncStatus: 'pending'
        };
        
        const request = store.add(todoWithTimestamp);

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (error) {
      console.error('Error adding todo:', error);
      throw new Error('Failed to add todo in offline mode');
    }
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
  },

  // New method to check online status
  isOnline() {
    return navigator.onLine;
  },

  // New method to sync pending changes when back online
  async syncPendingChanges() {
    if (!this.isOnline()) return;

    try {
      const todos = await this.getAllTodos();
      const pendingTodos = todos.filter(todo => todo.syncStatus === 'pending');

      for (const todo of pendingTodos) {
        try {
          // Attempt to sync with server
          // Add your API call here
          
          // If successful, update sync status
          await this.updateTodo({
            ...todo,
            syncStatus: 'synced'
          });
        } catch (error) {
          console.error('Failed to sync todo:', todo.id);
        }
      }
    } catch (error) {
      console.error('Error syncing pending changes:', error);
    }
  }
};

// Add online/offline event listeners
window.addEventListener('online', () => {
  todoDb.syncPendingChanges();
}); 