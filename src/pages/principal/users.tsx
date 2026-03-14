import { useState } from "react";

type PrincipalUser = {
    id: string;
    name: string;
    email: string;
    status: "Active" | "Inactive" | "Suspended";
};

const Users = () => {
    const [users, setUsers] = useState<PrincipalUser[]>([
        {
            id: "1",
            name: "John Doe",
            email: "john@example.com",
            status: "Active",
        },
        {
            id: "2",
            name: "Ada Smith",
            email: "ada@example.com",
            status: "Inactive",
        },
    ]);

    const [showForm, setShowForm] = useState(false);
    const [editingUserId, setEditingUserId] = useState<string | null>(null);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<"Active" | "Inactive" | "Suspended">(
        "Active"
    );

    const handleAddUser = (e: React.FormEvent) => {
        e.preventDefault();

        if (editingUserId) {
            setUsers(
                users.map((user) =>
                    user.id === editingUserId
                        ? { ...user, name, email, status }
                        : user
                )
            );
        } else {
            const newUser: PrincipalUser = {
                id: Date.now().toString(),
                name,
                email,
                status,
            };

            setUsers([...users, newUser]);
        }

        setName("");
        setEmail("");
        setStatus("Active");
        setEditingUserId(null);
        setShowForm(false);
    };
    const handleDeleteUser = (id: string) => {
        const confirmed = window.confirm("Are you sure you want to delete this principal user?");
        if (!confirmed) return;

        setUsers(users.filter((user) => user.id !== id));
    };
    const handleEditUser = (user: PrincipalUser) => {
        setName(user.name);
        setEmail(user.email);
        setStatus(user.status);
        setEditingUserId(user.id);
        setShowForm(true);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-2">Principal Users</h1>
            <p className="text-gray-500 mb-6">Manage principal account users</p>

            <div className="flex justify-between mb-4">
                <input
                    type="text"
                    placeholder="Search users..."
                    className="border px-4 py-2 rounded-lg w-72"
                />

                <button
                    onClick={() => setShowForm(true)}
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg"
                >
                    Add Principal User
                </button>
            </div>

            {showForm && (
                <form
                    onSubmit={handleAddUser}
                    className="border rounded-lg p-4 mb-6 bg-white space-y-4"
                >
                    <h2>
                        {editingUserId ? "Edit Principal User" : "Add Principal User"}
                    </h2>

                    <input
                        type="text"
                        placeholder="Full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="border px-4 py-2 rounded-lg w-full"
                        required
                    />

                    <input
                        type="email"
                        placeholder="Email address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="border px-4 py-2 rounded-lg w-full"
                        required
                    />

                    <label className="block text-sm font-medium">Status</label>

                    <select
                        title="User status"
                        value={status}
                        onChange={(e) =>
                            setStatus(e.target.value as "Active" | "Inactive" | "Suspended")
                        }
                        className="border px-4 py-2 rounded-lg w-full"
                    ></select>

                    <div className="flex gap-3">
                        <button
                            type="submit"
                            className={`text-white px-4 py-2 rounded-lg transition ${editingUserId
                                ? "bg-blue-600 hover:bg-blue-700"
                                : "bg-emerald-600 hover:bg-emerald-700"
                                }`}
                        >
                            {editingUserId ? "Update User" : "Save User"}
                        </button>

                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false)
                                setEditingUserId(null)
                                setName("")
                                setEmail("")
                                setStatus("Active")
                            }}
                            className="bg-gray-200 px-4 py-2 rounded-lg"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            )}

            <table className="w-full border rounded-lg overflow-hidden bg-white">
                <thead className="bg-gray-100">
                    <tr>
                        <th className="p-3 text-left">Name</th>
                        <th className="p-3 text-left">Email</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {users.map((user) => (
                        <tr key={user.id} className="border-t">
                            <td className="p-3">{user.name}</td>
                            <td className="p-3">{user.email}</td>
                            <td className="p-3">{user.status}</td>
                            <td className="p-3 flex gap-2">
                                <button
                                    onClick={() => handleEditUser(user)}
                                    className="bg-blue-100 text-blue-600 px-3 py-1 rounded"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="bg-red-100 text-red-600 px-3 py-1 rounded"
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}

                    {users.length === 0 && (
                        <tr>
                            <td colSpan={4} className="p-3 text-center text-gray-500">
                                No principal users found
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Users;