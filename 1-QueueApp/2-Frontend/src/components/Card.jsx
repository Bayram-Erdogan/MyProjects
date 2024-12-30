import Button from './Button'
import {Link} from 'react-router-dom'
import  handlePrint  from '../utils/printHelper'
import { useNavigate } from "react-router-dom";

const Card = ({
    cardType,
    user,
    desk,
    queue,
    image,
    customer

    }) => {

    switch(cardType){
        case 'User':
            return(
                <Link to={`/admin/users/${user.user_id}`}>
                    <article className="card">
                        <img src={image}/>
                        <div>
                            <h3> {user.name} </h3>
                        </div>
                    </article>
                </Link>
            )
        case 'Desk':
            return(
                <Link to={`/admin/desks/${desk.desk_id}`}>
                    <article className="card">
                        <img src={image}/>
                        <div>
                            <h3> Desk : {desk.desk_number} </h3>
                        </div>
                    </article>
                </Link>
            )
        case 'Queue':
            return(
                <Link to={`/admin/queues/${queue.queue_id}`}>
                    <article className="card bg-light">
                        <img src={image} alt="qr_code" />
                        <div>
                            <h3> {queue.queue_name} </h3>
                            <p><strong>Attached desk :</strong> {queue.attached_desk}</p>
                            <p><strong>Max of customer:</strong> {queue.max_of_customer}</p>
                            <Button style={"btn"} text={"Print"} onClick={() => handlePrint(image)} />
                        </div>
                    </article>
                </Link>
            )
        case 'Queue__home':
            const navigate = useNavigate();
            const handleProtectedPageAccess = (e) => {
                if (!user) {
                  e.preventDefault();
                  if (window.confirm("You need to sign in to access this page.")) {
                    navigate('/signIn');
                  }
                }
              };
            return(
                <Link to={`/admin/queues/${queue.queue_id}`} onClick={handleProtectedPageAccess}>
                    <article className="card">
                        <img src={image} alt="qr_code" />
                        <div>
                            <h3> {queue.queue_name} </h3>
                        </div>
                    </article>
                </Link>
            )
        case 'Active_Queue':
            return(
                <Link to={`/admin/queues/${queue.queue_id}`}>
                    <article className="card">
                        <img src={image} alt="qr_code" />
                        <div>
                            <h3> {queue.queue_name} </h3>
                            <p><strong>Id :</strong> {queue.queue_id}</p>
                            <p><strong>Number of Waiting Customers :</strong> {queue.waiting_customer}</p>
                            <p><strong>Average Waiting Time :</strong> {queue.max_of_customer}</p>
                            <Button style={"btn btn-dark"} text= {"Print"} onClick={() => handlePrint(image)}/>
                        </div>
                    </article>
                </Link>
            )
        case 'Customer':
          return (
            <Link to={`/admin/customers/${customer.customer_id}`} key={customer.customer_id}>
              <article className="card">
                <img src={image} alt="Customer profile image" />
                <div>
                <p> {customer.customer_id} </p>
                </div>
              </article>
            </Link>
          );
    }
}

export default Card