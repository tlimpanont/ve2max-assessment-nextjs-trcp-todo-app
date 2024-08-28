import {FormEvent, useState} from 'react';
import {
    Alert,
    AlertIcon,
    Box,
    Button,
    Center,
    Checkbox,
    Flex,
    Heading,
    HStack,
    IconButton,
    Input,
    Spinner,
    Text,
    useColorMode,
    useColorModeValue,
    VStack,
} from '@chakra-ui/react';
import {MoonIcon, RepeatIcon, SunIcon} from '@chakra-ui/icons';
import {trpc as task} from '@/utils/trpc';
import {useTasksStore} from '@/store/tasks';

export default function HomePage() {
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const tasks = useTasksStore((state) => state.tasks);
    const addTask = useTasksStore((state) => state.addTask);
    const setTasks = useTasksStore((state) => state.setTasks);
    const updateTaskInStore = useTasksStore((state) => state.updateTask);
    const deleteTaskInStore = useTasksStore((state) => state.deleteTask);

    // Fetch all tasks from the server and sync with Zustand store
    const {refetch, isLoading: tasksLoading, isError} = task.getAll.useQuery(undefined, {
        initialData: [],
        onSuccess: (data) => {
            setTasks(data); // Sync Zustand store with server data
        },
    });

    // Mutation hooks for CRUD actions with server sync
    const createTask = task.create.useMutation({
        onSuccess: () => {
            refetch(); // Sync with server after mutation
            setNewTaskTitle('');
            setIsLoading(false); // Stop loading after mutation success
        },
    });

    const updateTask = task.update.useMutation({
        onSuccess: () => refetch(),
    });

    const deleteTask = task.delete.useMutation({
        onSuccess: () => refetch(),
    });

    // Handlers for CRUD operations with optimistic UI (local state first)
    const handleAddTask = (e: FormEvent) => {
        e.preventDefault();
        if (newTaskTitle.trim() !== '') {
            const newTask = {id: Date.now(), title: newTaskTitle, completed: false};
            addTask(newTask); // Optimistically update the local state
            setIsLoading(true); // Start loading
            createTask.mutate({title: newTaskTitle}); // Sync with the server
        }
    };

    const handleToggleTask = (id: number, completed: boolean) => {
        updateTaskInStore(id, completed); // Optimistically update the local state
        updateTask.mutate({id, completed}); // Sync with the server
    };

    const handleDeleteTask = (id: number) => {
        deleteTaskInStore(id); // Optimistically update the local state
        deleteTask.mutate({id}); // Sync with the server
    };

    // Dark mode toggle
    const {colorMode, toggleColorMode} = useColorMode();
    const bg = useColorModeValue('gray.100', 'gray.900');

    return (
        <Box bg={bg} minH="100vh">
            {/* Toolbar */}
            <Flex
                as="header"
                width="100%"
                padding="4"
                alignItems="center"
                justifyContent="space-between"
                bg={useColorModeValue('white', 'gray.800')}
                boxShadow="md"
            >
                <Heading size="lg">Task Manager</Heading>
                <HStack>
                    <IconButton aria-label="Reload list of todos" icon={<RepeatIcon/>} onClick={() => refetch()}
                                isLoading={tasksLoading}>
                        Reload
                    </IconButton>
                    <IconButton
                        aria-label="Toggle Dark Mode"
                        icon={colorMode === 'light' ? <MoonIcon/> : <SunIcon/>}
                        onClick={toggleColorMode}
                    />
                </HStack>
            </Flex>

            {/* Main Content */}
            <VStack spacing={4} mt={8} px={8}>
                {/* Form to add tasks */}
                <form onSubmit={handleAddTask} style={{width: '100%'}}>
                    <HStack>
                        <Input
                            placeholder="New Task"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                            required
                            disabled={isLoading} // Disable input when loading
                        />
                        <Button
                            type="submit"
                            colorScheme="teal"
                            isLoading={isLoading} // Show spinner on button while loading
                            loadingText="Adding"
                            isDisabled={isLoading} // Disable button while loading
                        >
                            Add Task
                        </Button>
                    </HStack>
                </form>

                {/* Loading State */}
                {tasksLoading && (
                    <Center>
                        <Spinner size="xl"/>
                    </Center>
                )}

                {/* Error State */}
                {isError && (
                    <Alert status="error">
                        <AlertIcon/>
                        Failed to load tasks
                    </Alert>
                )}

                {/* Display Tasks */}
                {tasks?.map((task) => (
                    <HStack key={task.id} spacing={4} w="100%" justifyContent="space-between">
                        <Checkbox
                            isChecked={task.completed}
                            onChange={() => handleToggleTask(task.id, !task.completed)}
                        >
                            <Text as={task.completed ? 's' : undefined}>{task.title}</Text>
                        </Checkbox>
                        <Button onClick={() => handleDeleteTask(task.id)} colorScheme="red">
                            Delete
                        </Button>
                    </HStack>
                ))}
            </VStack>
        </Box>
    );
}
