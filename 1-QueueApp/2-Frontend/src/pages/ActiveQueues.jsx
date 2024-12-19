import { useState , useEffect } from "react"
import queuesServices from "../services/queuesServices"

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
            <table className="active-queues-table">
                <thead>
                    <tr>
                        <th rowSpan={3}>QR Code</th>
                        <th>Information</th>
                        <th>Values</th>
                    </tr>
                </thead>
                <tbody>
                    {queues.map((queue) => (
                        <>
                            <tr>
                                <td rowSpan={3}>
                                    <img
                                        src={queue.qr_code}
                                        alt={`QR for queue ${queue.queue_id}`}
                                        className="qr-code"
                                    />
                                </td>
                                <td>Queue Name:</td>
                                <td>{queue.queue_name}</td>
                            </tr>
                            <tr>
                                <td>Number of Customers Waiting:</td>
                                <td>{queue.waiting_customer}</td>
                            </tr>
                            <tr>
                                <td>Average Wait Time:</td>
                                <td>{queue.average_waiting_time}</td>
                            </tr>
                        </>
                    ))}
                </tbody>
            </table>
        </div>
    </div>


    )
}

export default ActiveQueues