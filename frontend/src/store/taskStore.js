import { create } from 'zustand';

export const useTaskStore = create((set) => ({
  selectedTask: null,
  isTaskModalOpen: false,
  searchResults: [],
  isSearching: false,

  setSelectedTask: (task) => set({ selectedTask: task }),

  openTaskModal: (task) => set({
    selectedTask: task,
    isTaskModalOpen: true,
  }),

  closeTaskModal: () => set({
    selectedTask: null,
    isTaskModalOpen: false,
  }),

  updateSelectedTask: (updates) => set((state) => ({
    selectedTask: state.selectedTask
      ? { ...state.selectedTask, ...updates }
      : null,
  })),

  setSearchResults: (results) => set({ searchResults: results }),

  setSearching: (isSearching) => set({ isSearching }),

  clearSearch: () => set({ searchResults: [], isSearching: false }),
}));
