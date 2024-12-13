import {useParams } from 'react-router-dom'

const User = ({ users }) => {

    const id = useParams().id
    const user = users.find(u => u.id === Number(id))
    return (
      <div>
        <h2>{user.username}</h2>
        {/* <div>{note.user}</div>
        <div><strong>{note.important ? 'important' : ''}</strong></div> */}
      </div>
    )
  }

export default User