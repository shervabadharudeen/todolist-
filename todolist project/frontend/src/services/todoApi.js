/**
 * ZenTask Frontend REST API Service
 * Communicates with the Node.js / Express / MongoDB backend
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Helper to execute fetch with timeout
 */
const fetchWithTimeout = async (url, options = {}, timeoutMs = 4000) => {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
};

/**
 * Check if backend server is online
 */
export const checkBackendHealth = async () => {
  try {
    const rootUrl = API_BASE_URL.replace(/\/api$/, '');
    const res = await fetchWithTimeout(`${rootUrl}/`, { method: 'GET' }, 2000);
    if (!res.ok) return false;
    const data = await res.json();
    return data.success === true;
  } catch {
    return false;
  }
};

/**
 * GET /api/todos - Fetch todos with search, status, priority, and sorting
 */
export const fetchTodos = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.status && filters.status !== 'all') params.append('status', filters.status);
  if (filters.priority && filters.priority !== 'all') params.append('priority', filters.priority);
  if (filters.category && filters.category !== 'all') params.append('category', filters.category);
  if (filters.search && filters.search.trim()) params.append('search', filters.search.trim());
  if (filters.sortBy) params.append('sortBy', filters.sortBy);

  const queryString = params.toString() ? `?${params.toString()}` : '';
  const response = await fetchWithTimeout(`${API_BASE_URL}/todos${queryString}`, {
    method: 'GET'
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch todos');
  }

  return result.data?.todos || [];
};

/**
 * GET /api/todos/:id - Fetch single todo by ID
 */
export const fetchTodoById = async (id) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/todos/${id}`, {
    method: 'GET'
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to fetch todo');
  }

  return result.data?.todo;
};

/**
 * POST /api/todos - Create new todo
 */
export const createTodo = async (todoData) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/todos`, {
    method: 'POST',
    body: JSON.stringify(todoData)
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to create todo');
  }

  return result.data?.todo;
};

/**
 * PUT /api/todos/:id - Update existing todo
 */
export const updateTodo = async (id, todoData) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/todos/${id}`, {
    method: 'PUT',
    body: JSON.stringify(todoData)
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to update todo');
  }

  return result.data?.todo;
};

/**
 * PATCH /api/todos/:id/status - Toggle or set completion status
 */
export const updateTodoStatus = async (id, statusOrCompleted) => {
  const body = typeof statusOrCompleted === 'boolean'
    ? { completed: statusOrCompleted, status: statusOrCompleted ? 'Completed' : 'Pending' }
    : { status: statusOrCompleted, completed: statusOrCompleted.toLowerCase() === 'completed' };

  const response = await fetchWithTimeout(`${API_BASE_URL}/todos/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(body)
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to update todo status');
  }

  return result.data?.todo;
};

/**
 * DELETE /api/todos/:id - Delete a todo
 */
export const deleteTodo = async (id) => {
  const response = await fetchWithTimeout(`${API_BASE_URL}/todos/${id}`, {
    method: 'DELETE'
  });

  const result = await response.json();
  if (!response.ok) {
    throw new Error(result.message || 'Failed to delete todo');
  }

  return result.data?.id || id;
};
