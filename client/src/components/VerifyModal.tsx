import {
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";

interface VerifyModalProps {
  isOpen: boolean;
  isChanged: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const VerifyModal: React.FC<VerifyModalProps> = ({
  isOpen,
  isChanged,
  onClose,
  onConfirm,
}) => {
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Data Verification</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isChanged ? (
              <p>Data has changed. Do you want to revert the change?</p>
            ) : (
              <p>Data has NOT changed!</p>
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              No
            </Button>
            {isChanged && (
              <Button colorScheme="red" mr={3} onClick={onConfirm}>
                Revert
              </Button>
            )}
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default VerifyModal;
