import styled from "styled-components";
import InviteStaff from "../features/authentication/InviteStaff";
import LogOut from "../features/authentication/LogOut";
import UpdatePasswordForm from "../features/authentication/UpdatePasswordForm";
import UpdateUserDataForm from "../features/authentication/UpdateUserDataForm";
import HotelInvites from "../features/authentication/HotelInvites";
import useAuth from "../hooks/useAuth";
import Heading from "../ui/Heading";
import { useGetAllinvites } from "../features/authentication/useGetAllinvites";
import { useCurrentUser } from "../features/authentication/useCurrentUser";

const Page = styled.main`
  max-width: 120rem;
  margin: 0 auto;
  padding: 4rem 2.4rem;

  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.8rem;

  & > h1 {
    grid-column: 1 / -1;
    margin-bottom: 1rem;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const SectionCard = styled.section`
  background: linear-gradient(
    145deg,
    var(--color-grey-0),
    var(--color-grey-50)
  );

  border-radius: 18px;
  padding: 2.8rem;
  border: 1px solid var(--color-grey-100);

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.05);
  transition: all 0.25s ease;

  display: flex;
  flex-direction: column;
  gap: 1.8rem;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);
  }
`;

const SectionHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;

  p {
    color: var(--color-grey-500);
    font-size: 1.35rem;
    line-height: 1.5;
  }
`;

const SecurityCard = styled(SectionCard)`
  border-left: 5px solid var(--color-red-500);
`;

const AdminCard = styled(SectionCard)`
  border-left: 5px solid var(--color-blue-500);
`;

const InviteCard = styled(SectionCard)`
  grid-column: 1 / -1;
  border-left: 5px solid #7c3aed; /* purple accent */
`;

function Account() {
  const { auth } = useAuth();
  const isAdmin = auth?.userRole === "Admin";
  const { isLoading, HotelInvitesData, error } = useGetAllinvites();
  const { isLoading1, UserData, error1 } = useCurrentUser();
  return (
    <Page>
      <Heading as="h1">Account settings</Heading>

      {/* Profile */}
      <SectionCard>
        <SectionHeader>
          <Heading as="h3">Profile</Heading>
          <p>Keep your personal information up to date.</p>
        </SectionHeader>
        <UpdateUserDataForm UserData={UserData}
          isLoading1={isLoading1}
          error1={error1} />
      </SectionCard>

      {/* Security */}
      <SecurityCard>
        <SectionHeader>
          <Heading as="h3">Security</Heading>
          <p>Update your password and secure your account.</p>
        </SectionHeader>
        <UpdatePasswordForm />
      </SecurityCard>

      {/* Admin */}
      {isAdmin && (
        <AdminCard>
          <SectionHeader>
            <Heading as="h3">Team Management</Heading>
            <p>Invite and manage staff members efficiently.</p>
          </SectionHeader>
          <InviteStaff />
        </AdminCard>
      )}

      {/* 🔥 NEW: Invites Dashboard */}
      {isAdmin && (
        <InviteCard>
          <SectionHeader>
            <Heading as="h3">Invites Dashboard</Heading>
            <p>Track pending, joined, and expired invites across your team.</p>
          </SectionHeader>

          <HotelInvites
            HotelInvitesData={HotelInvitesData}
            isLoading={isLoading}
            error={error}
          />
        </InviteCard>
      )}

      {/* Session */}
      <SectionCard>
        <SectionHeader>
          <Heading as="h3">Session</Heading>
          <p>Log out securely from your account.</p>
        </SectionHeader>
        <LogOut />
      </SectionCard>
    </Page>
  );
}

export default Account;
