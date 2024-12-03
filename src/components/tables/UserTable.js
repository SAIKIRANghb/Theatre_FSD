import React, { useState, useEffect } from 'react';

function UserTable() {
    const [users, setUsers] = useState([]);

    // Fetch users from backend
    useEffect(() => {
        fetch('/api/users')  // Adjust the API endpoint as needed
            .then(response => response.json())
            .then(data => setUsers(data))
            .catch(error => console.error('Error fetching users:', error));
    }, []);

    return (
        <div className="admin-users-panel">
            <h1>Users</h1>
            <table id="admin-users-table" className="admin-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map(user => (
                        <tr key={user._id}>
                            <td>{user.name}</td>
                            <td>{user.email}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default UserTable;
