import { useRef, useState } from "react";
import {
  Button,
  Modal,
  FormControl,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  Link,
  Text,
  useToast,
  ModalOverlay,
  ModalBody,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { TaskType } from "../domain/Task.schema";
import useTask from "../hooks/useTask";

type TaskEditProps = {
  task: TaskType;
};

export default function TaskEdit(props: TaskEditProps) {
  const [showModal, setShowModal] = useState<boolean>(false);
  const finalRef = useRef(null);
  const { deleteTask } = useTask();
  const [loading, setLoading] = useState<boolean>(false);
  const { task } = props;
  const toast = useToast();

  const onDelete = async () => {
    setLoading(true);
    await deleteTask(task.id);
    setLoading(false);
    setShowModal(false);

    toast({
      title: "Task deleted.",
      description: "Task has been deleted.",
      status: "success",
      duration: 4000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  return (
    <>
      <FormControl mt={10} ref={finalRef}>
        <Link onClick={() => setShowModal(true)} color="red.500">
          <Text textAlign="right">
            Delete this task <DeleteIcon />
          </Text>
        </Link>
      </FormControl>

      <Modal
        finalFocusRef={finalRef}
        size={"sm"}
        isOpen={showModal}
        onClose={() => setShowModal(false)}
      >
        <ModalOverlay />
        <ModalContent bg={"white"} opacity={0}>
          <ModalHeader bg={"gray.200"}>Delete Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </Text>
          </ModalBody>
          <ModalFooter bg={"gray.100"}>
            <Button
              colorScheme="red"
              mr={3}
              onClick={onDelete}
              isLoading={loading}
              disabled={loading}
            >
              Delete Task
            </Button>
            <Button onClick={() => setShowModal(false)} disabled={loading}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
