import { useAuth } from '../context/AuthContext';

export default function DebugAuth() {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
        <strong>Debug:</strong> No user logged in
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded z-50 max-w-sm">
      <strong>Debug Auth:</strong>
      <br />
      <strong>Name:</strong> {user.fullName}
      <br />
      <strong>Email:</strong> {user.email}
      <br />
      <strong>isAdmin:</strong> {user.isAdmin ? 'YES' : 'NO'}
      <br />
      <strong>isVerified:</strong> {user.isVerified ? 'YES' : 'NO'}
    </div>
  );
}
