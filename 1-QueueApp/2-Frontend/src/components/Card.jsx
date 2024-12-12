const Card = ({
    cardType,
    title,
    user,
    attached_desk,
    max_of_customer,
    image}) => {

    switch(cardType){
        case 'User':
            return(
                <article className="card">
                    <img src={image} alt="" />
                    <div>
                        <h3> {title} </h3>
                        {/* <p><strong>Attached desk:</strong> {user.name}</p>
                        <p><strong>Attached queue:</strong> {user.email}</p> */}
                    </div>
                </article>
            )
        case 'Desk':
            return(
                <article className="card">
                    <img src={image} alt="" />
                    <div>
                        <h3> {title} </h3>
                        {/* <p><strong>Attached queue:</strong> </p>
                        <p><strong>Attached user:</strong> </p> */}
                    </div>
                </article>
            )
        case 'Queue':
            return(
                <article className="card">
                    <img src={image} alt="qr_code" />
                    <div>
                        <h3> {title} </h3>
                        <p><strong>Attached desk :</strong> {attached_desk}</p>
                        <p><strong>Max of customer:</strong> {max_of_customer}</p>
                        <p>{user}</p>
                    </div>
                </article>
            )
    }
}

export default Card