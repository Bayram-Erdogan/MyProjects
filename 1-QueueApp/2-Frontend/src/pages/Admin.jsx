import Card from '../components/Card'

const Admin = () =>{

return (
    <div>
        <h1>Admin Page</h1>
        <section >
          <h2 >Users </h2>
          <div >
            <Card
              cardType={'User'}
              title={'Heikki Kolmonen'}
              desk_number={1}
              queue_name={'Queue 1'}
              text_1={'Desk number'}
              text_2={'Queue name'}
            />
          </div>
        </section>
        <section >
            <h2 >Desks </h2>
            <div >
              <div >
                <div >
                  <div >
                  <Card
                    cardType={'Desk'}
                    title={'Desk 1'}
                    user={'Heikki Kolmonen'}
                    queue_name={'Queue 1'}
                    text_1={'User'}
                    text_2={'Queue name'}
                  />
                  </div>
                </div>
                <div >
                  <div >
                    <Card/>
                  </div>
                </div>
                <div >
                  <div >
                    <Card/>
                  </div>
                </div>
              </div>
            </div>
        </section>
        <section >
            <h2 >Queues </h2>
            <div >
              <div >
                <div >
                  <div >
                  <Card
                    cardType={'Queue'}
                    title={'Queue 1'}
                    user={'Heikki Kolmonen'}
                    desk_number={1}
                    text_1={'User'}
                    text_2={'Desk number'}
                  />
                  </div>
                </div>
                <div >
                  <div >
                    <Card/>
                  </div>
                </div>
                <div >
                  <div >
                    <Card/>
                  </div>
                </div>
              </div>
            </div>
        </section>
        <section >
            <h2 >Customers </h2>
            <div >
              <div >
                <div >
                  <div >
                    <Card/>
                  </div>
                </div>
                <div >
                  <div >
                    <Card/>
                  </div>
                </div>
                <div >
                  <div >
                    <Card/>
                  </div>
                </div>
              </div>
            </div>
        </section>
        <section >
            <h2 >Statistics </h2>
            <div >
              <div >
                <div >
                  <div >
                    <Card/>
                  </div>
                </div>
                <div >
                  <div >
                    <Card/>
                  </div>
                </div>
                <div >
                  <div >
                    <Card/>
                  </div>
                </div>
              </div>
            </div>
        </section>
    </div>
)

}

export default Admin
