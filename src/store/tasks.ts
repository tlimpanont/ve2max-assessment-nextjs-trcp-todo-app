import create from 'zustand';

type Task = {
    id: number;
    title: string;
    completed: boolean;
};

type TasksStore = {
    tasks: Task[];
    addTask: (title: string) => void;
    updateTask: (id: number, completed: boolean) => void;
    deleteTask: (id: number) => void;
};

export const useTasksStore = create<TasksStore>((set) => ({
    tasks: [],
    addTask: (title) =>
        set((state) => ({
            tasks: [...state.tasks, { id: Date.now(), title, completed: false }],
        })),
    updateTask: (id, completed) =>
        set((state) => ({
            tasks: state.tasks.map((task) =>
                task.id === id ? { ...task, completed } : task
            ),
        })),
    deleteTask: (id) =>
        set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
        })),
}));
