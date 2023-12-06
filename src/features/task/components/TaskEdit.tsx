import { useEffect, useState } from "react";
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
} from "@chakra-ui/react";
import { TaskType } from "../domain/Task.schema";
import useTask from "../hooks/useTask";
import { MultiValue, Select } from "chakra-react-select";
import DeleteTask from "./DeleteTask";

type TaskEditProps = {
  task: TaskType;
  tasks: TaskType[];
  isOpen: boolean;
  onClose: () => void;
};

export default function TaskEdit(props: TaskEditProps) {
  const { task, isOpen, onClose, tasks } = props;
  const { updateTask, loading } = useTask();
  const [updatedTask, setUpdatedTask] = useState<TaskType>(task);
  const [selectedRelatedTo, setSelectedRelatedTo] =
    useState<MultiValue<{ label: string; value: string }>>();
  const [dropdownLoading, setDropdownLoading] = useState<boolean>(false);

  useEffect(() => {
    setDropdownLoading(true);
    setSelectedRelatedTo(
      tasks
        .filter((row) => task.relatedTo.includes(row.id))
        .map((row) => {
          return { value: row.id, label: row.title };
        })
    );
    setDropdownLoading(false);
    ` §§`;
  }, [task.relatedTo, tasks]);

  const onSave = async () => {
    // Mutate the relatedTo field to acknowledge the changes via the multi select
    updatedTask.relatedTo = selectedRelatedTo
      ? selectedRelatedTo.map((row) => row.value)
      : [];
    await updateTask(updatedTask);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalContent bg={"white"} opacity={0}>
        <ModalHeader bg={"gray.200"}>Edit Task</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl>
            <FormLabel>Title</FormLabel>
            <Input
              autoFocus
              name="title"
              variant={"outline"}
              value={updatedTask.title}
              onChange={(value) => {
                setUpdatedTask({ ...updatedTask, title: value.target.value });
              }}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Description</FormLabel>
            <Textarea
              variant={"outline"}
              name="body"
              value={updatedTask.body}
              onChange={(value) => {
                setUpdatedTask({ ...updatedTask, body: value.target.value });
              }}
            />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>Related To</FormLabel>
            <Select
              variant={"outline"}
              isLoading={dropdownLoading}
              name="relatedTo"
              value={selectedRelatedTo}
              onChange={(value) => {
                console.log(value);
                setSelectedRelatedTo(value);
              }}
              tagVariant="solid"
              colorScheme="blue"
              isMulti={true}
              hideSelectedOptions={true}
              closeMenuOnSelect={false}
              options={tasks
                .filter((row) => row.id !== task.id)
                .map((row) => {
                  return { value: row.id, label: row.title };
                })}
            />
          </FormControl>

          <DeleteTask task={task} />
        </ModalBody>
        <ModalFooter bg={"gray.100"}>
          <Button
            colorScheme="blue"
            mr={3}
            onClick={onSave}
            isLoading={loading}
            disabled={loading}
          >
            Save
          </Button>
          <Button onClick={onClose} disabled={loading}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
