import { useAuth0 } from "@auth0/auth0-react";

const LogoutButtom = () => {
    const { logout, isAuthenticated } = useAuth0()
    return (
        isAuthenticated && (
            <button onClick= {() => logout()}>
                Sign out
            </button>
        )
    )
}

export default LogoutButtom