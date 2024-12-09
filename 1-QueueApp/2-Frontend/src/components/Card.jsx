import Button from "./Button"

const Card = ({
    cardType,
    title,
    user,
    desk_number,
    queue_name,
    text_1,
    text_2}) => {

        switch(cardType){
            case 'User':
                return(
                    <div>
                        {/* <img class="card-image img-fluid" src="Ders_08_poster-3.jpeg" alt=""> */}
                        <div >
                            <h3>{title}</h3>
                            <p>{`${text_1} : ${desk_number}`} </p>
                            <p>{`${text_2} : ${queue_name}`}</p>
                            <p>
                                <Button text={'Details from Component'}/>
                            </p>
                        </div>
                    </div>
                )
            case 'Desk':
                return(
                    <div>
                        {/* <img class="card-image img-fluid" src="Ders_08_poster-3.jpeg" alt=""> */}
                        <h3> Card will be in here</h3>
                        <div >
                            <h3>{title}</h3>
                            <p>{`${text_1} : ${user}`} </p>
                            <p>{`${text_2} : ${queue_name}`}</p>
                            <p>
                                <button >Details</button>
                            </p>
                        </div>
                    </div>
                )
            case 'Queue':
                return(
                    <div>
                        {/* <img class="card-image img-fluid" src="Ders_08_poster-3.jpeg" alt=""> */}
                        <h3> Card will be in here</h3>
                        <div >
                            <h3>{title}</h3>
                            <p>{`${text_1} : ${user}`} </p>
                            <p>{`${text_2} : ${desk_number}`}</p>
                            <p>
                                <button >Details</button>
                            </p>
                        </div>
                    </div>
                )
        }
}

export default Card