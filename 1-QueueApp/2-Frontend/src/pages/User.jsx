import { useParams } from 'react-router-dom';

const User = ({ users }) => {
  const { id } = useParams();
  const user = users.find((user) => user.user_id === id);

  return (
    <div>
      <h1>{user.name} Details</h1>
      <p><strong>User ID :</strong> {user.user_id}</p>
      <p><strong>Username :</strong> {user.name}</p>
      <p><strong>Email :</strong> {user.email}</p>
      <p><strong>Password :</strong> Buraya Password gelecek</p>
      <p><strong>Created :</strong> {user.createdTime.date} / {user.createdTime.hour}</p>
      <p><strong>Created by:</strong> Buraya olusturan kisi gelecek</p>
      <p><strong>Desk:</strong> Buraya bagli oldugu desk gelecek</p>
      <p><strong>Queue:</strong> Buraya bagli oldugu queue gelecek</p>

    </div>
  );
};

export default User;
