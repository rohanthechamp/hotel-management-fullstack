// import { useEffect } from "react";
import LogOut from "../features/authentication/LogOut";
import UpdatePasswordForm from "../features/authentication/UpdatePasswordForm";
import UpdateUserDataForm from "../features/authentication/UpdateUserDataForm";
import Heading from "../ui/Heading";
import Row from "../ui/Row";
import styled from "styled-components";

const Page = styled.main`
  max-width: 110rem;
  margin: 0 auto;
  padding: 3.2rem 2.4rem;

  display: flex;
  flex-direction: column;
  gap: 3.2rem;
`;

const SectionCard = styled.section`
  background-color: var(--color-grey-0);
  border-radius: 14px;
  padding: 2.4rem 2.8rem;

  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-grey-100);

  display: flex;
  flex-direction: column;
  gap: 1.6rem;
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;

  p {
    color: var(--color-grey-500);
    font-size: 1.4rem;
  }
`;

const SecurityCard = styled(SectionCard)`
  border-left: 4px solid var(--color-red-500);
`;

function Account() {
  return (
    <Page>
      <Heading as="h1">Account settings</Heading>

      {/* Profile / User Data */}
      <SectionCard>
        <SectionHeader>
          <Heading as="h3">Profile information</Heading>
          <p>
            Update your personal details. These will be visible across your
            account.
          </p>
        </SectionHeader>

        <UpdateUserDataForm />
      </SectionCard>

      {/* Security */}
      <SecurityCard>
        <SectionHeader>
          <Heading as="h3">Security</Heading>
          <p>
            Change your password regularly to keep your account secure.
          </p>
        </SectionHeader>

        <UpdatePasswordForm />
      </SecurityCard>
    </Page>
  );
}

export default Account;