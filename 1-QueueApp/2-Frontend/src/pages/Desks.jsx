import { useState, useEffect } from "react"
import Input from "../components/Input"
import Button from "../components/Button"
import desksService from "../services/desksService"
import Card from "../components/Card"
import deskImage from "../assets/desk.jpg";


const Desks = () => {
    const [desks, setDesks] = useState([])
    const [deskNumber, setDeskNumber] = useState('')

    useEffect (() =>{
      desksService
        .getAll()
        .then(initialDesks => {
            setDesks(initialDesks)
        })
    },[])

    const addDesk = (event) =>{
        event.preventDefault()

        const deskObject = {
            desk_number :deskNumber
        }

    desksService
      .create(deskObject)
      .then(returnedDesk => {
        setDesks(desks.concat(returnedDesk))
        setDeskNumber('')
      })
    }


    return (
        <div>
            <h1>Desks</h1>
            <h2>Add new desk</h2>
            <form onSubmit={addDesk}>
                <Input
                    type = {"text"}
                    placeholder = {"Desk number"}
                    name = {"desk_number"}
                    value={deskNumber}
                    onChange={({target}) => setDeskNumber(target.value)}
                />

                <Button text = {"Create new desk"}/>
            </form>
            <div className="container">
                <h2>All Desks</h2>
                <div className="articles-container">
                    {desks.map((desk) => (
                        <Card
                            key={desk.desk_id}
                            cardType="Desk"
                            title={desk.desk_number}
                            image={deskImage}
                        />)
                    )}
                </div>
            </div>
        </div>
    )
}

export default Desks