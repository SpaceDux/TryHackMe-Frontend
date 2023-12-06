import { useState } from "react";
import {
  Button,
  Modal,
  FormControl,
  FormLabel,
  Input,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Textarea,
  Select as ChakraSelect,
} from "@chakra-ui/react";
import { TaskType } from "../domain/Task.schema";
import useTask from "../hooks/useTask";
import { MultiValue, Select } from "chakra-react-select";
import { TaskStatus } from "../../../libs/enums/TaskStatus.enum";

type TaskEditProps = {
  tasks: TaskType[];
};

export default function CreateTask(props: TaskEditProps) {
  const { tasks } = props;
  const initialTaskValues: TaskType = {
    title: "",
    body: "",
    status: TaskStatus.PENDING,
    relatedTo: [],
    id: "",
    archived: false,
    createdAt: "",
    updatedAt: "",
    archivedAt: null,
  };
  const { createTask, loading } = useTask();
  const [task, setTask] = useState<TaskType>(initialTaskValues);
  const [selectedRelatedTo, setSelectedRelatedTo] =
    useState<MultiValue<{ label: string; value: string }>>();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onSave = async () => {
    // Mutate the relatedTo field to acknowledge the changes via the multi select
    task.relatedTo = selectedRelatedTo
      ? selectedRelatedTo.map((row) => row.value)
      : [];

    await createTask(task);

    setIsOpen(false);
  };

  const onClose = () => {
    setIsOpen(false);
    setTask(initialTaskValues);
  };

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>Create New Task</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalContent bg={"white"} opacity={0}>
          <ModalHeader bg={"gray.200"}>New Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel>Title</FormLabel>
              <Input
                required
                autoFocus
                name="title"
                variant={"outline"}
                value={task.title}
                onChange={(value) => {
                  setTask({ ...task, title: value.target.value });
                }}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Description</FormLabel>
              <Textarea
                variant={"outline"}
                name="body"
                value={task.body}
                onChange={(value) => {
                  setTask({ ...task, body: value.target.value });
                }}
              />
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Column</FormLabel>
              <ChakraSelect
                placeholder="Select option"
                onChange={(value) => {
                  setTask({
                    ...task,
                    status: value.target.value as TaskStatus,
                  });
                }}
              >
                <option value={TaskStatus.PENDING}>To-do</option>
                <option value={TaskStatus.ACTIVE}>Active</option>
                <option value={TaskStatus.COMPLETED}>Complete</option>
              </ChakraSelect>
            </FormControl>
            <FormControl mt={4}>
              <FormLabel>Related To</FormLabel>
              <Select
                variant={"outline"}
                name="relatedTo"
                value={selectedRelatedTo}
                onChange={(value) => {
                  setSelectedRelatedTo(value);
                }}
                tagVariant="solid"
                colorScheme="blue"
                isMulti={true}
                hideSelectedOptions={true}
                closeMenuOnSelect={false}
                options={tasks.map((row) => {
                  return { value: row.id, label: row.title };
                })}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter bg={"gray.100"} mt={4}>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={onSave}
              isLoading={loading}
              disabled={loading}
            >
              Save
            </Button>
            <Button onClick={() => onClose()} disabled={loading}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
