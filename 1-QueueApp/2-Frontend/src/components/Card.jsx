import Button from './Button'
import {Link} from 'react-router-dom'
import  handlePrint  from '../utils/printHelper';

const Card = ({
    cardType,
    user,
    desk,
    queue,
    image,

    }) => {

    switch(cardType){
        case 'User':
            return(
                <Link to={`/admin/users/${user.user_id}`}>
                    <article className="card bg-light">
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
                    <article className="card bg-secondary">
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
            return(
                <Link to={`/admin/queues/${queue.queue_id}`}>
                    <article className="card bg-light">
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
                    <article className="card bg-light">
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
    }
}

export default Card