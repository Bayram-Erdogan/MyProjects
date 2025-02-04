import Button from './Button'
import {Link} from 'react-router-dom'
import  handlePrint  from '../utils/printHelper'

const Card = ({
    cardType,
    user,
    desk,
    queue,
    image,
    customer

    }) => {

    switch(cardType){
        case 'CustomerDesk':
            return(
                <Link to={`/customerDesks/${desk.desk_id}`}>
                    <article className="card">
                        <img src={image}/>
                        <div className='card-body'>
                            <h3> {desk.desk_number} </h3>
                        </div>
                    </article>
                </Link>
            )
        case 'CustomerQueue':
            return(
                <Link to={`/customerQueues/${queue.queue_id}`}>
                    <article className="card">
                        <img src={image}/>
                        <div className='card-body'>
                            <h3> {queue.queue_name} </h3>
                        </div>
                    </article>
                </Link>
            )
        case 'User':
            return(
                <Link to={`/admin/users/${user.user_id}`}>
                    <article className="card">
                        <img src={image}/>
                        <div className='card-body'>
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
                        <div className='card-body'>
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
                        <div className='card-body'>
                            <h3> {queue.queue_name} </h3>
                            <p><strong>Attached desk :</strong> {queue.attached_desk}</p>
                            <p><strong>Max of customer:</strong> {queue.max_of_customer}</p>
                            <Button style={"btn"} text={"Print"} onClick={() => handlePrint(image)} />
                        </div>
                    </article>
                </Link>
            )
        case 'Queue__home':
            return(
                <Link to={`/admin/queues/${queue.queue_id}`} >
                    <article className="card">
                        <img src={image} alt="qr_code" />
                        <div className='card-body'>
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
                <div className='card-body'>
                    <h3> Customer Id </h3>
                    <p> {customer.customer_id} </p>
                    <p>{customer.attached_queue?.queue_name || "Loading..."}</p>
                </div>
              </article>

            </Link>
          );
    }
}

export default Card