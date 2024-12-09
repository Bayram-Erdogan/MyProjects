import { useState } from "react"
import Input from "../components/Input"
import Button from "../components/Button"

const Desks = () => {
    const [desks, setDesks] = useState('')
    const [deskNumber, setDeskNumber] = useState('')

    const handleDesks =(event) => {
        console.log('Desk added with', deskNumber)
        event.preventDefault();
        setDeskNumber('')
    }

    return (
        <div>
            <h1>Desks</h1>
            <h2>Add new desk</h2>
            <form onSubmit={handleDesks}>
                <Input
                    type = {"text"}
                    placeholder = {"Desk number"}
                    name = {"desk_number"}
                    value={deskNumber}
                    onChange={({target}) => setDeskNumber(target.value)}
                />

                <Button text = {"Create new desk"}/>
            </form>
            <h2>All desks</h2>
        </div>
    )
}

export default Desks