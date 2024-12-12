import { useState , useEffect } from "react"
import Input from "../components/Input"
import Button from "../components/Button"
import queuesServices from "../services/queuesServices"
import Card from "../components/Card"
import Notification from "../components/Notification"

const Queues = () => {
    const [queues, setQueues] = useState([])
    const [queueName, setQueueName] = useState('')
    const [deskNumber, setDeskNumber] = useState('')
    const [maxOfCustomer, setMaxOfCustomer] = useState('')
    const [successMessage, setSuccessMessage] =useState(null)

    useEffect(() => {
      queuesServices
        .getAll()
        .then(initialQueues => {
            setQueues(initialQueues)
        })
    }, []);

    const addQueue = (event) => {
        event.preventDefault()

        const queueObject = {
            queue_name: queueName,
            desk_number: deskNumber,
            max_of_customer: maxOfCustomer
        }

        queuesServices
          .create(queueObject)
          .then(returnedQueue => {
            setQueues(queues.concat(returnedQueue))
            setQueueName('')
            setDeskNumber('')
            setMaxOfCustomer('')
            setSuccessMessage('Queue added successfully')
            setTimeout(() => {
                setSuccessMessage(null)
            }, 5000)
          })
    }

    return (
        <div>
            <h1>Queues</h1>
            <h2>Add new queue</h2>
            <form onSubmit={addQueue}>
                <Input
                    type = {"text"}
                    placeholder = {"Queue name"}
                    name = {"queue_name"}
                    value={queueName}
                    onChange={({target}) => setQueueName(target.value)}
                />

                <Input
                    type = {"text"}
                    placeholder = {"Desk number"}
                    name = {"desk_number"}
                    value={deskNumber}
                    onChange={({target}) => setDeskNumber(target.value)}
                />

                <Input
                    type = {"text"}
                    placeholder = {"Max of customer"}
                    name = {"max_of_customer"}
                    value={maxOfCustomer}
                    onChange={({target}) => setMaxOfCustomer(target.value)}
                />

                <Button text = {"Create new queue"}/>
            </form>
            <Notification message={successMessage}/>
            <div className="container">
                <h2>All Queues</h2>
                <div className="articles-container">
                    {queues.map((queue) => (
                        <Card
                            key={queue.queue_id}
                            cardType = "Queue"
                            title = {queue.queue_name}
                            attached_desk = {queue.attached_desk}
                            max_of_customer = {queue.max_of_customer}
                            image={queue.qr_code}
                        />)
                    )}
                </div>

            </div>
        </div>
    )
}
export default Queues