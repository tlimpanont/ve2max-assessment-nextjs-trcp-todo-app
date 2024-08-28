import create from 'zustand';

type Task = {
    id: number;
    title: string;
    completed: boolean;
};

type TasksStore = {
    tasks: Task[];
    addTask: (task: Task) => void;
    updateTask: (id: number, completed: boolean) => void;
    deleteTask: (id: number) => void;
    setTasks: (tasks: Task[]) => void;
};

export const useTasksStore = create<TasksStore>((set) => ({
    tasks: [],
    setTasks: (tasks) =>
        set(() => ({
            tasks,
        })),
    addTask: (task) =>
        set((state) => {
            // Prevent adding duplicate tasks by ID
            if (state.tasks.some((t) => t.id === task.id)) {
                return state;
            }
            return {
                tasks: [...state.tasks, task],
            };
        }),
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
