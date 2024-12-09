import { useState } from "react"
import Input from "../components/Input"
import Button from "../components/Button"


const Queues = () => {
    const [queues, setQueues] = useState('')
    const [queueName, setQueueName] = useState('')
    const [deskNumber, setDeskNumber] = useState('')
    const [maxOfCustomer, setMaxOfCustomer] = useState('')

    const handleQueues =(event) => {
        console.log('Queue added with', queueName, deskNumber, maxOfCustomer)
        event.preventDefault();
        setQueueName('')
        setDeskNumber('')
        setMaxOfCustomer('')
    }

    return (
        <div>
            <h1>Queues</h1>
            <h2>Add new queue</h2>
            <form onSubmit={handleQueues}>
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
            <h2>All queues</h2>
        </div>
    )
}
export default Queues