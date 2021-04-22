//dependencies
import { Modal, Button, ListGroup, Image, Spinner, Form } from "react-bootstrap";
import { useEthers } from "@usedapp/core";



//assets
import styles from '../styles/LoginModal.module.css'

const LoginModal = (props) => {

    const {
            isLoginModalOpen,
            setIsLoginModalOpen,
            loginState,
            _handleSelectLoginProvider,
            _handleSubmitRegistration,
            isLoading,
            setNewUserEmail,
            setNewUsername,
            userData
        } = props;

    const { account } = useEthers();

    //UI render functions
    const renderLoginModalContent = () => {
    
        //first screen, select login provider (only metamask for now)
        if (loginState === null) {
            return (
                <div>
                    <h4>Select Web3 Provider</h4>
                    <ListGroup >
                        <ListGroup.Item action onClick={() => _handleSelectLoginProvider("metamask")}>
                            <Image id={styles.metamaskLogoIcon} src={"/img/metamask-logo.svg"} /> Login with Metamask
                        </ListGroup.Item>
                    </ListGroup>
                </div>
            )
        }

        // metamask selected as provider, but wallet not connected to webapp
        if (loginState.provider === "metamask" && !account) {
            // activateBrowserWallet()
            return (
                <div>
                    <h4>Connect your Metamask wallet</h4>
                    <Button onClick={() => activateBrowserWallet()}>Connect Metamask</Button>
                </div>
            )
        }

        //metamask selected as provider, and wallet is just connected to webapp
        if (loginState.provider === 'metamask' && account && !loginState.newUser) {
            return (
                <div>
                    <h4>Connect your Metamask wallet</h4>
                    <p>Retrieving user info for wallet <strong>{account}</strong></p>
                    { isLoading ? (<Spinner className={styles.loadingSpinner} animation="grow" />) : <p>Please sign the message</p>}
                </div>
            )
        }


        if (loginState.provider === 'metamask' && account && loginState.newUser === true) {
            
            if (userData.errormessage !== "CREATE_USER") {
                console.log("userdata", userData)
                return (
                    <div>
                        <h4>Register a new account</h4>
                        <p>wallet <strong>{account}</strong></p>
                        {	isLoading ? (<Spinner className={styles.loadingSpinner} animation="grow" />) :
                            (<p>Please sign the message in your metamask window</p>)}
                    </div>
                )
            }
            
            
            return (
                <div>
                    <h4>Register a new account</h4>
                    <p>Wallet ID: <strong>{account}</strong></p>
                    <Form.Group>
                        <Form.Label>Email address</Form.Label>
                        <Form.Control onChange={e => setNewUserEmail(e.target.value)} type="email" placeholder="name@example.com" />
                    </Form.Group>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control onChange={e => setNewUsername(e.target.value)} type="username" placeholder="username" />
                    </Form.Group>
                    {  isLoading ? (  <Button variant="primary" disabled> <Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true"/>Loading...</Button>) :
                        (<Button onClick={() => _handleSubmitRegistration()}>Log In</Button>)}
                </div>
            )			
        }

    }

    return (
        <Modal
            show={isLoginModalOpen}
            onHide={() => setIsLoginModalOpen(false)}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    LOGIN  
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className={styles.modalBodyBigContainer}>
                { renderLoginModalContent() }
            </Modal.Body>
            <Modal.Footer>
                <Button onClick={() => setIsLoginModalOpen(false)}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default LoginModal;