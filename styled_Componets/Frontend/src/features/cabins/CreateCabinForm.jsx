import { useEffect, useState } from "react";
import styled from "styled-components";
import Input from "../../ui/Input";
import Form from "../../ui/Form";
import Button from "../../ui/Button";
import FileInput from "../../ui/FileInput";
import Textarea, { ImageInput, ImagePreview } from "../../ui/Textarea";
import { useForm } from "react-hook-form";
import Spinner from "../../ui/Spinner";
import { useCreateCabin } from "./useCreateCabin";
import { useEditCabin } from "./useEditCabin";
import { formDataHandel } from "../../utils/helpers";
const FormRow = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 24rem 1fr 1.2fr;
  gap: 2.4rem;
  padding: 1.2rem 0;

  &:first-child {
    padding-top: 0;
  }
  &:last-child {
    padding-bottom: 0;
  }
  &:not(:last-child) {
    border-bottom: 1px solid var(--color-grey-100);
  }
  &:has(button) {
    display: flex;
    justify-content: flex-end;
    gap: 1.2rem;
  }
`;

const Label = styled.label`
  font-weight: 500;
`;

const ErrorStyle = styled.span`
  font-size: 1.4rem;
  color: var(--color-red-700);
`;

function CreateCabinForm({ cabinData = {}, resetOpenModel }) {
  // console.log("Cabin data in cabin form - ", cabinData, typeof cabinData);
  // const [isSubmit, setIsSubmit] = useState(false);
  const [preview, setPreview] = useState(null);
  useEffect(() => {
    if (isEditId) {
      setPreview(cabinData?.image);
    }
  }, [isEditId, cabinData]);
  // if (isEditId) console.log("data in edit form", EditId);
  const { id: EditId, ...otherData } = cabinData;
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm({ defaultValues: isEditId ? otherData : {} });

  /// create cabin logic
  const { isCreating, createCabin } = useCreateCabin();
  /// Edit cabin logic
  const { isEditing, updateMutate } = useEditCabin();

  if (!cabinData) return <Spinner />;

  // console.log("OTHERDATA", otherData);

  const isEditId = Boolean(EditId);

  const isWorking = isEditing || isCreating;
  const imageRegister = register("image", {
    required: !isEditId && "This field is required",
  });

  function handleImageChange(e) {
    console.log("running handleImageChange after selecting the image ");
    const file = e.target.files[0];
    console.log("here is the image -", file);
    if (!file) return console.log("NOT a file!");
    const fileURL = URL.createObjectURL(file);
    console.log("here is the image url -", fileURL);
    setPreview(fileURL);
    console.log("here image is set");
  }
  const onSubmit = (data) => {
    // choose file if selected, else keep existing DB url (otherData.image)
    // setIsSubmit(true);

    console.log("Create Cabin DAta -", data);

    const newCabinformData = formDataHandel(data);

    if (isEditId) {
      updateMutate(
        { data: newCabinformData, id: EditId },
        {
          onSuccess: () => {
            reset();
            resetOpenModel?.();
          },
        }
      );
    } else {
      createCabin(newCabinformData, {
        onSuccess: () => {
          reset();
          resetOpenModel?.();
        },
      });
    }
  };

  return (
    <>
      {/* {isSubmit && <Spinne/>r />} */}
      <Form onSubmit={handleSubmit(onSubmit)}>
        <FormRow>
          <Label htmlFor="name">Cabin name</Label>
          <Input
            type="text"
            id="name"
            {...register("name", { required: "Cabin name is required" })}
            aria-invalid={errors.name ? true : false}
            disabled={isWorking}
          />
          {errors.name && <ErrorStyle>{errors.name.message}</ErrorStyle>}
        </FormRow>

        <FormRow>
          <Label htmlFor="maxCapacity">Maximum capacity</Label>
          <Input
            type="number"
            id="maxCapacity"
            {...register("maxCapacity", {
              required: "Max capacity is required",
              max: 8,
            })}
            aria-invalid={errors.maxCapacity ? true : false}
            disabled={isWorking}
          />
          {errors.maxCapacity && (
            <ErrorStyle>{errors.maxCapacity.message}</ErrorStyle>
          )}
        </FormRow>

        <FormRow>
          <Label htmlFor="regularPrice">Regular price</Label>
          <Input
            type="number"
            id="regularPrice"
            {...register("regularPrice")}
            disabled={isWorking}
          />
        </FormRow>

        <FormRow>
          <Label htmlFor="discount">Discount</Label>
          <Input
            type="number"
            id="discount"
            defaultValue={0}
            {...register("discount")}
            disabled={isWorking}
          />
        </FormRow>

        <FormRow>
          <Label htmlFor="observations">Description for website</Label>
          <Textarea
            id="observations"
            defaultValue=""
            {...register("observations", {
              required: "Description is required",
            })}
            aria-invalid={errors.observations ? true : false}
            disabled={isWorking}
          />
          {errors.observations && (
            <ErrorStyle>{errors.observations.message}</ErrorStyle>
          )}
        </FormRow>
        {/* 
        <FormRow>
          <Label htmlFor="image">Cabin image </Label>
          <ImageInput
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={isWorking}
          />

          {preview && (
            <ImagePreview>
              <img src={preview} alt="Preview" />
            </ImagePreview>
          )}
          {errors.observations && (
            <ErrorStyle>{errors.observations.message}</ErrorStyle>
          )}
        </FormRow> */}

        {/* <FormRow>
          <Label htmlFor="image">Cabin photo</Label>
          <FileInput id="image" accept="image/*" {...register("image")} />
        </FormRow> */}

        <ImagePreview>
          {preview && <img src={preview} alt="Preview" />}
        </ImagePreview>

        <FormRow label="Cabin photo">
          <FileInput
            id="image"
            accept="image/*"
            {...imageRegister}
            onChange={(e) => {
              imageRegister.onChange(e); // RHF update
              handleImageChange(e); // preview logic
            }}
            disabled={isWorking}
          />
        </FormRow>
        {/* } */}

        <FormRow>
          <Button
            variation="secondary"
            type="reset"
            onClick={() =>
              resetOpenModel ? resetOpenModel((prev) => !prev) : ""
            }
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isWorking}>
            {isEditId ? "Edit Cabin" : "Add Cabin"}
          </Button>
        </FormRow>
      </Form>
    </>
  );
}

export default CreateCabinForm;
