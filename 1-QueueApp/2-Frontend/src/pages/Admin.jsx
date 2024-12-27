import Card from '../components/Card'
import userImage from "../assets/user.jpeg";
import deskImage from "../assets/desk.jpg";

const Admin = ({users, desks, queues}) => {
    return (
    <div id='admin' className='page-container'>
      <section>
        <div className="box">
          <header className="section-header">
            <h2>Users</h2>
          </header>
          <div className="articles-container">
            {users.slice(0, 5).map((user) => ( // slice() from chatgpt
              <Card
                key={user.user_id}
                cardType="User"
                user={user}
                image={userImage}
              />
            ))}
          </div>
        </div>
      </section>
      <section>
        <div className="box">
          <header className="section-header">
            <h2>Desks</h2>
          </header>
          <div className="articles-container">
            {desks.slice(0, 5).map((desk) => (
              <Card
                key={desk.desk_id}
                cardType="Desk"
                desk = {desk}
                queue_name = {desk.queue_name}
                image={deskImage}
              />
            ))}
          </div>
        </div>
      </section>
      <section>
        <div className="box">
          <header className="section-header">
            <h2>Queues</h2>
          </header>
          <div className="articles-container">
            {queues.slice(0, 5).map((queue) => (
              <Card
                key={queue.queue_id}
                cardType="Queue"
                queue={queue}
                image={queue.qr_code}
              />
            ))}
          </div>
        </div>
      </section>
      <section>
        <div className="box">
          <header className="section-header">
            <h2>Customers</h2>
          </header>
        </div>
      </section>
      <section>
        <div className="box">
          <header className="section-header">
            <h2>Statistics</h2>
          </header>
        </div>
      </section>
    </div>
  )
}

export default Admin

