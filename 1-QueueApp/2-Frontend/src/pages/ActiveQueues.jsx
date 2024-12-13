import { useState , useEffect } from "react"
import queuesServices from "../services/queuesServices"
import Card from "../components/Card"

const ActiveQueues = () => {
    const [queues, setQueues] = useState([])

        useEffect(() => {
          queuesServices
            .getActive()
            .then(initialQueues => {
                setQueues(initialQueues)
            })
        }, []);
    return (
        <div>
            <h1>Active Queues</h1>
            <div className="container">
                <h2>All queues</h2>
                <div className="articles-container">
                    {queues.map((queue) => (
                        <Card
                            key={queue.queue_id}
                            cardType = "Active_Queue"
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

export default ActiveQueues