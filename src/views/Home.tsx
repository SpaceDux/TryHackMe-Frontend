import { Box, Flex, Heading, SimpleGrid, useToast } from "@chakra-ui/react";
import useTask from "../features/task/hooks/useTask";
import { useEffect } from "react";
import { TaskStatus } from "../libs/enums/TaskStatus.enum";
import TaskCard from "../features/task/components/TaskCard";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";

const Home = () => {
  const { loading, state, updateTask, getTasks } = useTask();
  const toast = useToast();

  useEffect(() => {
    Promise.all([getTasks()]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDragDrop = async (id: string, destination: TaskStatus) => {
    // This does not handle drags tasks in the same column.
    // It only handles drag and drop between columns.

    const task = state.tasks.find((task) => task.id === id);

    if (task?.status === destination) return;

    await updateTask({ ...task, status: destination });

    toast({
      title: "Task updated.",
      description: `Task status has been updated to ${destination}.`,
      status: "success",
      duration: 4000,
      isClosable: true,
      position: "bottom-right",
    });

    return;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <DragDropContext
      onDragEnd={(value) => {
        handleDragDrop(
          value.draggableId,
          value.destination?.droppableId as TaskStatus
        );
      }}
    >
      <Box p={4}>
        <Heading as="h1" mb={4}>
          TryHackMe Task
        </Heading>
        <Flex>
          <SimpleGrid columns={1} flex={1} gap={4}>
            <Heading as="h2" size="md" mb={2} textAlign={"center"}>
              To Do
            </Heading>
            <Droppable droppableId={TaskStatus.PENDING}>
              {(provided) => (
                <Box
                  bg="gray.100"
                  p={4}
                  borderRadius="md"
                  marginX={10}
                  maxH={"70vh"}
                  minH={"70vh"}
                  overflow={"scroll"}
                  overflowX={"hidden"}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {state.tasks
                    ?.filter((task) => task.status === TaskStatus.PENDING)
                    .map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                          >
                            <TaskCard task={task} tasks={state.tasks} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </SimpleGrid>
          <SimpleGrid columns={1} flex={1} gap={4}>
            <Heading as="h2" size="md" mb={2} textAlign={"center"}>
              Active
            </Heading>
            <Droppable droppableId={TaskStatus.ACTIVE}>
              {(provided) => (
                <Box
                  bg="gray.100"
                  p={4}
                  borderRadius="md"
                  marginX={10}
                  maxH={"70vh"}
                  minH={"70vh"}
                  overflow={"scroll"}
                  overflowX={"hidden"}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {state.tasks
                    ?.filter((task) => task.status === TaskStatus.ACTIVE)
                    .map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                          >
                            <TaskCard task={task} tasks={state.tasks} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </SimpleGrid>
          <SimpleGrid columns={1} flex={1} gap={4}>
            <Heading as="h2" size="md" mb={2} textAlign={"center"}>
              Complete
            </Heading>
            <Droppable droppableId={TaskStatus.COMPLETED}>
              {(provided) => (
                <Box
                  bg="gray.100"
                  p={4}
                  borderRadius="md"
                  marginX={10}
                  maxH={"70vh"}
                  minH={"70vh"}
                  overflow={"scroll"}
                  overflowX={"hidden"}
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {state.tasks
                    ?.filter((task) => task.status === TaskStatus.COMPLETED)
                    .map((task, index) => (
                      <Draggable
                        key={task.id}
                        draggableId={task.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            ref={provided.innerRef}
                          >
                            <TaskCard task={task} tasks={state.tasks} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </SimpleGrid>
        </Flex>
      </Box>
    </DragDropContext>
  );
};

export default Home;
