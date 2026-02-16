import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndContext, DragOverlay, closestCorners, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { Plus, Activity } from 'lucide-react';
import Button from '../components/common/Button';
import BoardHeader from '../components/board/BoardHeader';
import List from '../components/list/List';
import CreateListModal from '../components/list/CreateListModal';
import CreateTaskModal from '../components/task/CreateTaskModal';
import TaskModal from '../components/task/TaskModal';
import TaskCard from '../components/task/TaskCard';
import ActivityFeed from '../components/activity/ActivityFeed';
import { useBoardStore } from '../store/boardStore';
import { useTaskStore } from '../store/taskStore';
import { boardAPI, listAPI, taskAPI } from '../services/api';
import { useSocket } from '../hooks/useSocket';
import { useToast } from '../hooks/useToast';
import ToastContainer from '../components/common/Toast';


const BoardView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeBoard, setActiveBoard, clearActiveBoard, lists, addList, updateList, deleteList, addTask, updateTask, deleteTask, moveTask, deleteBoard } = useBoardStore();
  const { closeTaskModal, updateSelectedTask } = useTaskStore();
  const { joinBoard, leaveBoard, setupBoardListeners, cleanupBoardListeners } = useSocket();
  const { toasts, removeToast, success, error } = useToast();


  const [showCreateList, setShowCreateList] = useState(false);
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [selectedListId, setSelectedListId] = useState(null);
  const [showActivity, setShowActivity] = useState(false);
  const [activeId, setActiveId] = useState(null);
  const [loading, setLoading] = useState(true);


  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );


  useEffect(() => {
    loadBoard();
    setupBoardListeners();
    joinBoard(parseInt(id));


    return () => {
      cleanupBoardListeners();
      leaveBoard(parseInt(id));
      clearActiveBoard();
    };
  }, [id]);


  const loadBoard = async () => {
    try {
      setLoading(true);
      const response = await boardAPI.getById(id);
      setActiveBoard(response.data.board);
    } catch (err) {
      console.error('Failed to load board:', err);
      error(err.response?.data?.error || 'Failed to load board');
      setTimeout(() => navigate('/dashboard'), 2000);
    } finally {
      setLoading(false);
    }
  };


  const handleCreateList = async (title) => {
    try {
      const response = await listAPI.create(id, { title });
      addList(response.data.list);
      setShowCreateList(false);
      success('List created!');
    } catch (err) {
      error('Failed to create list');
    }
  };


  const handleUpdateList = async (listId, updates) => {
    try {
      await listAPI.update(listId, updates);
      updateList(listId, updates);
      success('List updated!');
    } catch (err) {
      error('Failed to update list');
    }
  };


  const handleDeleteList = async (listId) => {
    if (!window.confirm('Delete this list and all its tasks?')) return;
    
    try {
      await listAPI.delete(listId);
      deleteList(listId);
      success('List deleted!');
    } catch (err) {
      error('Failed to delete list');
    }
  };


  const handleDeleteBoard = async (boardId) => {
    try {
      await boardAPI.delete(boardId);
      deleteBoard(boardId);
      success('Board deleted successfully!');
      navigate('/dashboard');
    } catch (err) {
      error(err.response?.data?.error || 'Failed to delete board');
    }
  };


  const handleCreateTask = async (formData) => {
    try {
      const response = await taskAPI.create(selectedListId, formData);
      addTask(selectedListId, response.data.task);
      setShowCreateTask(false);
      success('Task created!');
    } catch (err) {
      error('Failed to create task');
    }
  };


  const handleUpdateTask = async (taskId, updates) => {
    try {
      const response = await taskAPI.update(taskId, updates);
      updateTask(taskId, response.data.task);
      updateSelectedTask(response.data.task);
      success('Task updated!');
    } catch (err) {
      error('Failed to update task');
    }
  };


  const handleDeleteTask = async (taskId) => {
    try {
      await taskAPI.delete(taskId);
      deleteTask(taskId);
      closeTaskModal();
      success('Task deleted!');
    } catch (err) {
      error('Failed to delete task');
    }
  };


  const handleAssignUser = async (taskId, userId) => {
    try {
      const response = await taskAPI.assign(taskId, userId);
      updateTask(taskId, response.data.task);
      updateSelectedTask(response.data.task);
      success('User assigned!');
    } catch (err) {
      error(err.response?.data?.error || 'Failed to assign user');
    }
  };


  const handleUnassignUser = async (taskId, userId) => {
    try {
      const response = await taskAPI.unassign(taskId, userId);
      updateTask(taskId, response.data.task);
      updateSelectedTask(response.data.task);
      success('User unassigned!');
    } catch (err) {
      error('Failed to unassign user');
    }
  };


  const handleAddMember = async (email) => {
    try {
      await boardAPI.addMember(id, email);
      await loadBoard();
      success('Member added!');
    } catch (err) {
      error(err.response?.data?.error || 'Failed to add member');
    }
  };


  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };


  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);


    if (!over) return;


    const activeTaskId = parseInt(active.id.toString().replace('task-', ''));
    const overListId = parseInt(over.id.toString().replace('list-', ''));


    // Find the task and its current list
    let currentTask = null;
    let currentListId = null;


    for (const list of lists) {
      const task = list.tasks?.find((t) => t.id === activeTaskId);
      if (task) {
        currentTask = task;
        currentListId = list.id;
        break;
      }
    }


    if (!currentTask || currentListId === overListId) return;


    // Calculate new position (add to end of list)
    const targetList = lists.find((l) => l.id === overListId);
    const newPosition = targetList?.tasks?.length || 0;


    try {
      // Optimistic update
      moveTask(activeTaskId, overListId, newPosition);


      // API call
      await taskAPI.move(activeTaskId, {
        newListId: overListId,
        newPosition,
      });


      success('Task moved!');
    } catch (err) {
      error('Failed to move task');
      // Revert on error
      await loadBoard();
    }
  };


  if (loading || !activeBoard) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading board...</p>
        </div>
      </div>
    );
  }


  const activeTask = lists
    .flatMap((list) => list.tasks || [])
    .find((task) => `task-${task.id}` === activeId);


  return (
    <div className="h-full">
      <ToastContainer toasts={toasts} onClose={removeToast} />


      <BoardHeader
        board={activeBoard}
        onAddMember={handleAddMember}
        onDelete={handleDeleteBoard}
      />


      {/* Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-0 mb-6">
        <Button
          variant="primary"
          onClick={() => setShowCreateList(true)}
          leftIcon={<Plus size={18} />}
          className="w-full sm:w-auto"
        >
          Add List
        </Button>


        <Button
          variant="outline"
          onClick={() => setShowActivity(!showActivity)}
          leftIcon={<Activity size={18} />}
          className="w-full sm:w-auto"
        >
          Activity
        </Button>
      </div>


      <div className="flex flex-col lg:flex-row gap-6">
        {/* Lists */}
        <div className="flex-1 overflow-x-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 pb-4 min-w-min">
              {lists.map((list) => (
                <List
                  key={list.id}
                  list={list}
                  onAddTask={(listId) => {
                    setSelectedListId(listId);
                    setShowCreateTask(true);
                  }}
                  onUpdateList={handleUpdateList}
                  onDeleteList={handleDeleteList}
                />
              ))}
            </div>


            <DragOverlay>
              {activeTask && <TaskCard task={activeTask} />}
            </DragOverlay>
          </DndContext>
        </div>


        {/* Activity Sidebar */}
        {showActivity && (
          <div className="w-full lg:w-80 bg-white dark:bg-dark-card rounded-xl p-4 shadow-lg max-h-96 lg:max-h-[calc(100vh-20rem)] overflow-y-auto custom-scrollbar">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Activity Feed
            </h3>
            <ActivityFeed boardId={parseInt(id)} />
          </div>
        )}
      </div>


      {/* Modals */}
      <CreateListModal
        isOpen={showCreateList}
        onClose={() => setShowCreateList(false)}
        onSubmit={handleCreateList}
      />


      <CreateTaskModal
        isOpen={showCreateTask}
        onClose={() => setShowCreateTask(false)}
        onSubmit={handleCreateTask}
      />


      <TaskModal
        onUpdate={handleUpdateTask}
        onDelete={handleDeleteTask}
        onAssign={handleAssignUser}
        onUnassign={handleUnassignUser}
      />
    </div>
  );
};


export default BoardView;
