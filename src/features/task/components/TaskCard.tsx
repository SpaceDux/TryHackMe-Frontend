import { Box, Card, Flex, Heading, Tag } from "@chakra-ui/react";
import { TaskType } from "../domain/Task.schema";
import TaskEdit from "./TaskEdit";
import { useState } from "react";

type Props = {
  task: TaskType;
  tasks: TaskType[];
  onTaskDelete?: () => void;
};

export default function TaskCard(props: Props) {
  const { task, tasks } = props;
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <>
      <Card
        bg="gray.200"
        p={4}
        borderRadius="md"
        boxShadow="md"
        mb={10}
        _hover={{
          bg: "gray.300",
          transition: "all 0.1s ease-in-out",
          cursor: "pointer",
        }}
        onClick={() => {
          setIsModalOpen(true);
        }}
      >
        <Heading as="h3" size="sm" mb={2}>
          {task.title}
        </Heading>
        {/* Description, snipped */}
        <Box bg="gray.100" p={2} borderRadius="md" fontSize={12} mb={2}>
          {task?.body}
        </Box>

        {/* Footer */}
        <Flex justifyContent="flex-start" alignItems="center" mt={4}>
          {task?.relatedTo?.length ? (
            <Tag colorScheme={"blue"} size="sm" mr={4}>
              {task?.relatedTo.length} Relations
            </Tag>
          ) : null}
          <Tag colorScheme={"green"} size="sm">
            {task?.status}
          </Tag>
        </Flex>
      </Card>

      {/* Modal to View/Edit */}
      <TaskEdit
        task={task}
        tasks={tasks}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
}
