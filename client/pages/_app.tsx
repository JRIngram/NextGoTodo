import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/globals.css";
import NavigationBar from '../components/NavigationBar';
import Container from "react-bootstrap/Container";

const AppWrapper = ({ Component, pageProps }) => {
    return (
        <>  
            <NavigationBar />
            <Container>
                <Component {...pageProps} />
            </Container>
        </>
    )
}

export default AppWrapper;