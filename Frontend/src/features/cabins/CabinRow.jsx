/* CabinRow.jsx */
import styled from "styled-components";
import { formatCurrency } from "../../utils/helpers";
import CreateCabinForm from "./CreateCabinForm";
import { useDeleteCabins } from "./useDeleteCabins";
import Spinner from "../../ui/Spinner";
import { useCreateCabin } from "./useCreateCabin";
import { HiPencil, HiSquare2Stack, HiTrash } from "react-icons/hi2";
import Modal from "../../ui/Modal";
import ConfirmDelete from "../../ui/ConfirmDelete";
import Menus from "../../ui/Menus";
import Table from "../../ui/Table";

const Img = styled.img`
  display: block;
  width: 100%;
  height: 6.4rem; /* keeps consistent aspect */
  object-fit: cover;
  object-position: center;
  border-radius: 6px;
  /* removed transform that previously caused overflow/shift */
`;

const Cabin = styled.div`
  font-size: 1.6rem;
  font-weight: 600;
  color: var(--color-grey-600);
  font-family: sans-serif;
`;

const 
Price = styled.div`
  font-family: sans-serif;
  font-weight: 600;
`;

const Size = styled.div`
  font-family: sans-serif;
  font-weight: 600;
`;

const Discount = styled.div`
  font-family: sans-serif;
  font-weight: 500;
  color: var(--color-green-700);
`;

const Ops = styled.div`
  display: flex;
  gap: 0.6rem;
  align-items: center;
`;

/* component */
const CabinRow = ({ cabin }) => {
  const { isDeleting, deleteCabin } = useDeleteCabins();
  const { isCreating, createCabin } = useCreateCabin();

  if (!cabin) return null;

  const { id, name, maxCapacity, regularPrice, discount, image } = cabin;
  function handleDuplicate() {
    createCabin({
      name: `Copy of ${name}`,
      maxCapacity,
      regularPrice,
      discount,
      image,
    });
  }

  console.log('CAbin data ',cabin);

  if (isCreating || isDeleting) return <Spinner />;

  return (
    <Table.Row role="row">
      <div role="cell">{id}</div>
      <Cabin role="cell">{name}</Cabin>
      <Size role="cell">{maxCapacity}</Size>
      <Price role="cell">{formatCurrency(regularPrice)}</Price>
      <Discount role="cell">{formatCurrency(discount)}</Discount>
      <div role="cell">
        <Img src={image || 'src/data/img/default-cabin.jpg' } alt={`Cabin ${name}`} />
      </div>
      <Ops role="cell">
        <Modal>``
          <Modal.Open opens="edit-window">
            <button>
              <HiPencil />
            </button>
          </Modal.Open>
          <Modal.Window name="edit-window">
            <CreateCabinForm cabinData={cabin} />
          </Modal.Window>

          <Modal.Open opens="delete-window">
            <button>
              <HiTrash />
            </button>
          </Modal.Open>
          <Modal.Window name="delete-window">
            <ConfirmDelete
              /* The commented out code block you provided is part of the JSX code within the `CabinRow` component.
Let's break down what it is doing: */
              resourceName={name + " cabin"}
              onConfirm={() => deleteCabin(id)}
              disabled={isDeleting}
            />
          </Modal.Window>

          <button onClick={handleDuplicate}>
            <HiSquare2Stack />
          </button>
        </Modal>

        <Modal>
          <Menus.Menu>
            <Menus.Toggle cabinId={id} />
            <Menus.List cabinId={id}>
              <Menus.Button icon={<HiSquare2Stack />} handler={handleDuplicate}>
                Copy
              </Menus.Button>

              <Modal.Open opens="edit-window">
                <Menus.Button icon={<HiPencil />}>Edit</Menus.Button>
              </Modal.Open>

              <Modal.Open opens="delete-window">
                <Menus.Button icon={<HiTrash />}>Delete</Menus.Button>
              </Modal.Open>
            </Menus.List>

            <Modal.Window name="edit-window">
              <CreateCabinForm cabinData={cabin} />
            </Modal.Window>

            <Modal.Window name="delete-window">
              <ConfirmDelete
                resourceName={name}
                onConfirm={() => deleteCabin(id)}
                disabled={isDeleting}
              />
            </Modal.Window>
          </Menus.Menu>
        </Modal>
      </Ops>
    </Table.Row>
  );
};

export default CabinRow;
