import {
    Box,
    Button,
    FormControl,
    FormErrorMessage,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    useColorModeValue,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import {useForm} from "react-hook-form";
import {useParams} from "react-router-dom";
import axiosInstance from "../../services/axios";


export const AddUpdateTemplateModal = ({
                                           editable = false, onSuccess = () => {
    }, ...rest
                                       }) => {
    const {isOpen, onOpen, onClose} = useDisclosure();
    const toast = useToast();
    const {templateId} = useParams();
    const defaultValues = {
        title: "Default Title",
        description: "Default description",
        json_schema: "{}",
        ui_schema: "{}"
    }
    const {
        handleSubmit,
        register,
        control,
        formState: {errors, isSubmitting},
    } = useForm({
        defaultValues: {...defaultValues},
    });

    const onSubmit = async (values: any) => {
        console.log(values);
        values.json_schema = JSON.parse(values.json_schema)
        values.ui_schema = JSON.parse(values.ui_schema)

        console.log(values);
        try {
            if (editable) {
                await axiosInstance.put(`/templates/${templateId}`, values);
            } else {
                await axiosInstance.post(`/templates/create/`, values);
            }
            toast({
                title: editable ? "Template Updated" : "Template Added",
                status: "success",
                isClosable: true,
                duration: 1500,
            });
            onSuccess();
            onClose();
        } catch (err) {
            console.error(err);
            toast({
                title: "Something went wrong. Please try again.",
                status: "error",
                isClosable: true,
                duration: 1500,
            });
        }
    };

    return (
        <Box {...rest}>
            <Button w="100%" colorScheme="green" onClick={onOpen}>
                {editable ? "Update Template" : "ADD Template"}
            </Button>
            <Modal
                closeOnOverlayClick={false}
                size="xl"
                onClose={onClose}
                isOpen={isOpen}
                isCentered
            >
                <ModalOverlay/>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <ModalContent>
                        <ModalHeader>{editable ? "Update Template" : "ADD Template"}</ModalHeader>
                        <ModalCloseButton/>
                        <ModalBody>
                            <FormControl isInvalid={errors.title !== undefined}>
                                <Input
                                    placeholder="Template Title...."
                                    background={useColorModeValue("gray.300", "gray.600")}
                                    type="text"
                                    variant="filled"
                                    size="lg"
                                    mt={6}
                                    {...register("title", {
                                        required: "This is required field",
                                        minLength: {
                                            value: 5,
                                            message: "Title must be at least 5 characters",
                                        },
                                        maxLength: {
                                            value: 55,
                                            message: "Title must be at most 55 characters",
                                        },
                                    })}
                                />
                                <Input
                                    placeholder="Template Description...."
                                    background={useColorModeValue("gray.300", "gray.600")}
                                    type="text"
                                    variant="filled"
                                    size="lg"
                                    mt={6}
                                    {...register("description", {
                                        required: "This is required field",
                                        minLength: {
                                            value: 5,
                                            message: "Title must be at least 5 characters",
                                        },
                                        maxLength: {
                                            value: 55,
                                            message: "Title must be at most 55 characters",
                                        },
                                    })}
                                />
                                <Input
                                    placeholder="Template Json Schema...."
                                    background={useColorModeValue("gray.300", "gray.600")}
                                    type="text"
                                    variant="filled"
                                    size="lg"
                                    mt={6}
                                    {...register("json_schema", {
                                        required: "This is required field",
                                    })}
                                />
                                <Input
                                    placeholder="Template UI Schema...."
                                    background={useColorModeValue("gray.300", "gray.600")}
                                    type="text"
                                    variant="filled"
                                    size="lg"
                                    mt={6}
                                    {...register("ui_schema", {
                                        required: "This is required field",
                                    })}
                                />
                                <FormErrorMessage>
                                    {errors.title && errors.title.message}
                                </FormErrorMessage>
                            </FormControl>


                        </ModalBody>
                        <ModalFooter>
                            <Stack direction="row" spacing={4}>
                                <Button onClick={onClose} disabled={isSubmitting}>
                                    Close
                                </Button>
                                <Button
                                    colorScheme="green"
                                    type="submit"
                                    isLoading={isSubmitting}
                                    loadingText={editable ? "Updating" : "Creating"}
                                >
                                    {editable ? "Update" : "Create"}
                                </Button>
                            </Stack>
                        </ModalFooter>
                    </ModalContent>
                </form>
            </Modal>
        </Box>
    );
};