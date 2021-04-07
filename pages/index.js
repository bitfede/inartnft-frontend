/*
 AUTHOR: Federico G. De Faveri
 DATE: April 6th, 2021
 PURPOSE: This is the home page of the InArt NFT platform.
*/

//dependencies
import { InjectedConnector } from "@web3-react/injected-connector";

//hooks
import { useEffect } from 'react';
import { useEthers, account } from '@usedapp/core';

// library components
import Head from 'next/head'
import Link from 'next/link'
import {Container, Row, Col, Card, ListGroup, ListGroupItem} from 'react-bootstrap';
import {Avatar} from '@material-ui/core';

// custom components
import Header from '../components/Header';

//assets and icons
import styles from '../styles/Home.module.css'
import LiveHelpSharpIcon from '@material-ui/icons/LiveHelpSharp';
import ListAltSharpIcon from '@material-ui/icons/ListAltSharp';

//variables

// COMPONENT STARTS HERE
function Home(props) {

  const { products } = props;
  console.log(products)

  const { activate, account } = useEthers();

  //functions ---
  

  //render functions
  const renderProductCards = () => {
    return (
      <Col className="card-container">
        { products.map( (product, i) => {
          return (
            <Card className="nft-item-card" style={{ width: '18rem' }}>
              <Card.Img variant="top" src={"img/artgallery5.png"} />
              <Card.Body>
                  <Card.Title>{product.title}</Card.Title>
                  <Card.Text>
                    {product.describtion}
                  </Card.Text>
              </Card.Body>
              <ListGroup className="list-group-flush list-group-nftcard">
                  <ListGroupItem><span>AUTHOR:</span> {product.author}</ListGroupItem>
                  <ListGroupItem><span>PRICE:</span> 3,999.20 Ξ</ListGroupItem>
                  <ListGroupItem><span>OWNER:</span> {product.nameUser}</ListGroupItem>
              </ListGroup>
              <Card.Body>
                  <Link href={`/art/${product.id}`}>
                    <a className={"btn btn-success card-link"}> Buy Now</a>
                  </Link>
                  <Card.Link href={"#"}>Share</Card.Link>
              </Card.Body>
            </Card>
          )
        }) }
      </Col>
    )
  }

  //render
  return (
    <div className={styles.container}>
      <Head>
        <title>InArt NFT</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Header />

      <main className={styles.main}>
      <div id="homeContainer">
            <Container fluid>
                <Row>
                    <Col lg={4} id="home-sidemenu-container" className={"d-none d-lg-block"}>
                       <div className="title-section-sidemenu">
                           <LiveHelpSharpIcon /><span>TITLE</span>
                       </div>
                       <div className="paragraph-section-sidemenu">
                           <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
                       </div>
                       <div className="title-section-sidemenu">
                           <ListAltSharpIcon /><span>COLLECTIONS</span>
                       </div>
                       <div className="list-section-sidemenu">
                            <div className="list-container-sidemenu">
                                <Link href="#">
                                  <a>
                                    <div className="list-item-sidemenu">
                                        <Avatar className={"list-item-avatar-sidemenu"} src={"img/artgallery1.png"} /> <span>AuctionGallery</span>
                                    </div>
                                  </a>
                                </Link>
                                <Link href="#">
                                  <a>

                                    <div className="list-item-sidemenu">
                                        <Avatar className={"list-item-avatar-sidemenu"} src={"img/artgallery2.png"} /> <span>Frilli Gallery</span>
                                    </div>
                                  </a>
                                </Link>
                                <Link href="#">
                                  <a>
                                    <div className="list-item-sidemenu">
                                        <Avatar className={"list-item-avatar-sidemenu"} src={"img/artgallery3.png"} /> <span>Orion Consulting</span>
                                    </div>
                                  </a>
                                </Link>
                                <Link href="#">
                                  <a>
                                    <div className="list-item-sidemenu">
                                        <Avatar className={"list-item-avatar-sidemenu"} src={"img/artgallery4.png"} /> <span>ArtVise</span>
                                    </div>
                                  </a>
                                </Link>
                            </div>
                       </div>
                    </Col>
                    <Col xs={12} lg={8}>
                        <Row className="cards-wrapper">
                          { renderProductCards() }
                        </Row>
                    </Col>
                </Row>
            </Container>
            
        </div>
      </main>
    </div>
  )
}


export async function getStaticProps(context) {
  const res = await fetch(`http://79.143.177.8/api/PublicListProducts`)
  const products = await res.json()

  if (!products) {
    return {
      notFound: true,
    }
  }

  return {
    props: { products }, // will be passed to the page component as props
  }
}


export default Home;