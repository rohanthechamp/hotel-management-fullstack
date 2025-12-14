
import styled from "styled-components";

const Textarea = styled.textarea`
  padding: 0.8rem 1.2rem;
  border: 1px solid var(--color-grey-300);
  border-radius: 5px;
  background-color: var(--color-grey-0);
  box-shadow: var(--shadow-sm);
  width: 100%;
  height: 8rem;
`;

export const ImageInput = styled.input`
  margin-top: 0.8rem;
`;

export const ImagePreview = styled.div`
  margin-top: 1rem;
  width: 100%;
  height: 120px;
  border: 1px dashed var(--color-grey-400);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-grey-50);

  img {
    max-height: 100%;
    max-width: 100%;
    object-fit: cover;
    border-radius: 4px;
  }
`;

export default Textarea