const Notification = ({ message }) => {

    const errorStyle = {
        color: 'red',
        fontSize: '20px',
        padding: '5px',
        marginBottom: '10px',
        maxWidth: '400px',
        width: 'auto',
        display: 'inline-block',
        wordWrap: 'break-word',
    }

    const successStyle = {
      color: 'green',
      fontSize: '20px',
      padding: '5px',
      marginBottom: '10px',
      maxWidth: '400px',
      width: 'auto',
      display: 'inline-block',
      wordWrap: 'break-word',
  }
    if (message === null) {
      return null
    }

    if (message.includes('successfully')) {
      return (
        <div style={successStyle}>
          {message}
        </div>
      )
    }

    return (
      <div style={errorStyle}>
        {message}
      </div>
    )
  }

  export default Notification