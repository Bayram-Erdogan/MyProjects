import { Link } from 'react-router-dom'

export const Navbar = () => {

    return (
        // <div>
        //     <Link style={padding} to="/">Home</Link>
        //     <Link style={padding} to="/signIn">Sign in</Link>
        // </div>
        <header className='main-header'>
            <div className='navbar'>
                <h1 className='brand'>
                    <Link to="/">Queue App</Link>
                </h1>
                <nav>
                    <Link to="/signIn">Sign in</Link>
                </nav>
            </div>
        </header>
    )
}

// export const AdminNavbar = () => {
//     const padding = {
//         padding: 5
//       }
//     return (
//         <div>
//             <Link style={padding} to="/">Home</Link>
//             <Link style={padding} to="/admin">Admin</Link>
//             <Link style={padding} to="/admin/users">Users</Link>
//             <Link style={padding} to="/admin/desks">Desks</Link>
//             <Link style={padding} to="/admin/queues">Queues</Link>
//             <Link style={padding} to="/admin/queues/actives">Active Queues</Link>
//             <Link style={padding} to="/admin/customers">Customers</Link>
//             <Link style={padding} to="/admin/statistics">Statistics</Link>
//         </div>
//     )
// }
