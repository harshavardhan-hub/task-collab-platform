import { create } from 'zustand';

export const useBoardStore = create((set, get) => ({
  boards: [],
  activeBoard: null,
  lists: [],
  isLoading: false,
  error: null,

  setBoards: (boards) => set({ boards }),

  addBoard: (board) => set((state) => ({
    boards: [board, ...state.boards],
  })),

  updateBoard: (boardId, updates) => set((state) => ({
    boards: state.boards.map((board) =>
      board.id === boardId ? { ...board, ...updates } : board
    ),
    activeBoard: state.activeBoard?.id === boardId
      ? { ...state.activeBoard, ...updates }
      : state.activeBoard,
  })),

  deleteBoard: (boardId) => set((state) => ({
    boards: state.boards.filter((board) => board.id !== boardId),
    activeBoard: state.activeBoard?.id === boardId ? null : state.activeBoard,
  })),

  setActiveBoard: (board) => set({
    activeBoard: board,
    lists: board?.lists || [],
  }),

  clearActiveBoard: () => set({
    activeBoard: null,
    lists: [],
  }),

  // List operations - FIXED: Check for duplicates
  addList: (list) => set((state) => {
    // Check if list already exists
    const existingList = state.lists.find(l => l.id === list.id);
    if (existingList) {
      return state; // Don't add duplicate
    }

    return {
      lists: [...state.lists, { ...list, tasks: [] }],
      activeBoard: state.activeBoard ? {
        ...state.activeBoard,
        lists: [...(state.activeBoard.lists || []), { ...list, tasks: [] }],
      } : null,
    };
  }),

  updateList: (listId, updates) => set((state) => ({
    lists: state.lists.map((list) =>
      list.id === listId ? { ...list, ...updates } : list
    ),
  })),

  deleteList: (listId) => set((state) => ({
    lists: state.lists.filter((list) => list.id !== listId),
  })),

  // Task operations within lists
  addTask: (listId, task) => set((state) => ({
    lists: state.lists.map((list) =>
      list.id === listId
        ? { ...list, tasks: [...(list.tasks || []), task] }
        : list
    ),
  })),

  updateTask: (taskId, updates) => set((state) => ({
    lists: state.lists.map((list) => ({
      ...list,
      tasks: (list.tasks || []).map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    })),
  })),

  deleteTask: (taskId) => set((state) => ({
    lists: state.lists.map((list) => ({
      ...list,
      tasks: (list.tasks || []).filter((task) => task.id !== taskId),
    })),
  })),

  moveTask: (taskId, newListId, newPosition) => set((state) => {
    let movedTask = null;
    
    // Remove task from old list
    const listsWithoutTask = state.lists.map((list) => ({
      ...list,
      tasks: (list.tasks || []).filter((task) => {
        if (task.id === taskId) {
          movedTask = task;
          return false;
        }
        return true;
      }),
    }));

    // Add task to new list at new position
    const updatedLists = listsWithoutTask.map((list) => {
      if (list.id === newListId && movedTask) {
        const tasks = [...(list.tasks || [])];
        tasks.splice(newPosition, 0, { ...movedTask, list_id: newListId, position: newPosition });
        return { ...list, tasks };
      }
      return list;
    });

    return { lists: updatedLists };
  }),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}));
