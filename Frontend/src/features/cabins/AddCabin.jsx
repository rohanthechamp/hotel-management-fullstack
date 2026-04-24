import CreateCabinForm from "./CreateCabinForm";
import Modal from "../../ui/Modal";
import Button from "../../ui/Button";

function AddCabin() {
  return (
    <div>
      <Modal>
        <Modal.Open opens="cabin-form">
          <Button>Add New Cabin</Button>
        </Modal.Open>
        <Modal.Window name="cabin-form">
          <CreateCabinForm />
        </Modal.Window>
      </Modal>
    </div>
  );
}



































// function AddCabin() {
//     const [isOpenModal, setIsOpenModal] = useState(false);

//     return (
//       <>
//         <button onClick={() => setIsOpenModal((prev) => !prev)}>
//           Add Cabins
//         </button>
//         {isOpenModal && (
//           <Modal resetOpenModel={setIsOpenModal}>
//             <CreateCabinForm resetOpenModel={setIsOpenModal} />
//           </Modal>
//         )}
//       </>
//     );
// }

// function AddCabin() {

//   return (
//     <Modal>
//       <Modal.Open opens="cabin-form">
//         <Button>Add New Cabin</Button>

//       </Modal.Open>
//       <Modal.Window name="cabin-form">
//         <CreateCabinForm />
//       </Modal.Window>
// {/*
//       <Modal.Open opens="table">
//         <Button>Show Table</Button>
//       </Modal.Open>
//       <Modal.Window name="table">
//         <CreateCabinForm />
//       </Modal.Window> */}
//     </Modal>
//   );

// }

export default AddCabin;
