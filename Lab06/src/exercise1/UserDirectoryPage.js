import { useEffect, useState } from 'react';
import Controls from './Controls';
import sampleUsers from './sampleUsers';
import UserList from './UserList';

const USERS_API_URL = process.env.REACT_APP_USERS_API_URL || 'http://localhost:3001/users_api';

function UserDirectoryPage() {
  const [users, setUsers] = useState([]);
  const [sortBy, setSortBy] = useState('id');
  const [viewMode, setViewMode] = useState('grid');

  useEffect(() => {
    async function fetchUsers() {
      try {
        const response = await fetch(USERS_API_URL);

        if (!response.ok) {
          throw new Error('Could not fetch users from the API.');
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error(error.message);
        setUsers(sampleUsers);
      }
    }

    fetchUsers();
  }, []);

  async function handleDeleteClick(userId) {
    const trimmedId = String(userId).trim();

    if (!trimmedId) {
      return;
    }

    try {
      const response = await fetch(`${USERS_API_URL}/${trimmedId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Could not delete the selected user.');
      }
    } catch (error) {
      console.error(error.message);
    }

    setUsers((currentUsers) =>
      currentUsers.filter((user) => String(user.id) !== trimmedId)
    );
  }

  function handleSortByGroupClick() {
    const sortedUsers = [...users].sort((a, b) => {
      if (a.user_group !== b.user_group) {
        return a.user_group - b.user_group;
      }

      return Number(a.id) - Number(b.id);
    });

    setUsers(sortedUsers);
    setSortBy('group');
  }

  function handleSortByIdClick() {
    const sortedUsers = [...users].sort((a, b) => Number(a.id) - Number(b.id));

    setUsers(sortedUsers);
    setSortBy('id');
  }

  function handleViewToggleClick() {
    setViewMode((currentMode) => (currentMode === 'grid' ? 'list' : 'grid'));
  }

  return (
    <>
      <section className="panel">
        <h1>User Directory</h1>
        <p className="page-intro">
          Current sort: {sortBy === 'group' ? 'Group' : 'ID'} | View: {viewMode}
        </p>
      </section>

      <section className="panel">
        <h2>Controls</h2>
        <Controls
          onDeleteClick={handleDeleteClick}
          onSortByGroupClick={handleSortByGroupClick}
          onSortByIdClick={handleSortByIdClick}
          onViewToggleClick={handleViewToggleClick}
        />
      </section>

      <section className="panel">
        <h2>All Users</h2>
        <UserList users={users} viewMode={viewMode} />
      </section>
    </>
  );
}

export default UserDirectoryPage;
