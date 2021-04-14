import {Container, Row, Col } from 'react-bootstrap';

const Footer = (props) => {

    const authenticated = false;

    return (
        <div className={"footer-container"}>
            <Container>
                <Row>
                    <Col xs={12} sm={12} md={12} lg={6}>
                        <h2>InArtNFT</h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={1}>
                    </Col>
                    <Col xs={12} sm={12} md={12} lg={5}>
                        <Row>
                            <Col xs={6} >
                                <h3>Useful Links</h3>
                                <ul id={"footerLinks"}>
                                    <li><a href="/#">How to get started</a></li>
                                    <li><a href="/#">What is Blockchain?</a></li>
                                    <li><a href="/#">What is an NFT?</a></li>
                                    <li><a href="/#">Company</a></li>
                                </ul>
                            </Col>
                            <Col xs={6} >
                                <h3>Galleries</h3>
                                <ul id={"footerLinks"}>
                                    <li><a href="/#">AuctionGallery</a></li>
                                    <li><a href="/#">Frilli Gallery</a></li>
                                    <li><a href="/#">Orion Consulting</a></li>
                                    <li><a href="/#">ArtVise</a></li>
                                </ul>
                            </Col>

                        </Row>
                    </Col>
                </Row>
            </Container>
        </div>
    )
}

export default Footer;