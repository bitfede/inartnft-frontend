/*
 AUTHOR: Federico G. De Faveri
 DATE: April 6th, 2021
 PURPOSE: This is the home page of the InArt NFT platform.
*/

//dependencies
// import { InjectedConnector } from "@web3-react/injected-connector";

//hooks
import React, { useEffect } from 'react';
import { useEthers, account } from '@usedapp/core';

// library components
import Head from 'next/head';
import Link from 'next/link';
import {Container, Row, Col, Card, ListGroup, ListGroupItem} from 'react-bootstrap';
import {Avatar} from '@material-ui/core';

// custom components

//assets and icons
import styles from '../styles/Home.module.css';
import LiveHelpSharpIcon from '@material-ui/icons/LiveHelpSharp';
import ListAltSharpIcon from '@material-ui/icons/ListAltSharp';
import httpClient from '../utilities/http-client';
import Layout from '../components/Layout';

//variables

// COMPONENT STARTS HERE
function Home(props) {

  const {products, apiCall} = props;

  console.log("proppi", props)

  // const { activate, account } = useEthers();

  //functions ---
  

  //render functions
  const renderProductCards = () => {
    return (
      <Col className="card-container">
        { products.map( (product, i) => {
          return (
            <Card key={`card-${i}`} className="nft-item-card" style={{ width: '18rem' }}>
              <Card.Img variant="top" src={product.urlImageVideoPresentation} />
              <Card.Body>
                  <Card.Title>{product.title}</Card.Title>
                  <Card.Text className={styles.cardArtDescription}>
                    {product.describtion}
                  </Card.Text>
              </Card.Body>
              <ListGroup className="list-group-flush list-group-nftcard">
                  <ListGroupItem><span>AUTHOR:</span> {product.author}</ListGroupItem>
                  <ListGroupItem><span>PRICE:</span> {product.price} Ξ</ListGroupItem>
                  <ListGroupItem><span>OWNER:</span> {product.nameUser ? product.nameUser : "Gallery"}</ListGroupItem>
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
		<Layout>
			<main className={styles.main}>
				<div id="homeContainer">
					<Container fluid>
						<Row>
							<Col lg={4} id="home-sidemenu-container" className={"d-none d-lg-block"}>
								<div className="title-section-sidemenu">
									<LiveHelpSharpIcon />
									<span>TITLE</span>
								</div>
								<div className="paragraph-section-sidemenu">
									<p>
										Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis
										et quasi architecto beatae vitae dicta sunt explicabo.
									</p>
								</div>
								<div className="title-section-sidemenu">
									<ListAltSharpIcon />
									<span>COLLECTIONS</span>
								</div>
								<div className="list-section-sidemenu">
									<div className="list-container-sidemenu">
										<Link href="#">
											<a>
												<div className="list-item-sidemenu">
													<Avatar className={"list-item-avatar-sidemenu"} src={"img/auction-gallery.png"} /> <span>AuctionGallery</span>
												</div>
											</a>
										</Link>
										<Link href="#">
											<a>
												<div className="list-item-sidemenu">
													<Avatar className={"list-item-avatar-sidemenu"} src={"img/frilli-gallery.jpg"} /> <span>Frilli Gallery</span>
												</div>
											</a>
										</Link>
										<Link href="#">
											<a>
												<div className="list-item-sidemenu">
													<Avatar className={"list-item-avatar-sidemenu"} src={"img/orion.png"} /> <span>Orion Consulting</span>
												</div>
											</a>
										</Link>
										<Link href="#">
											<a>
												<div className="list-item-sidemenu">
													<Avatar className={"list-item-avatar-sidemenu"} src={"img/artvise.jpg"} /> <span>ArtVise</span>
												</div>
											</a>
										</Link>
									</div>
								</div>
							</Col>
							<Col xs={12} lg={8}>
								<Row className="cards-wrapper">
                  { products.length > 0 ? renderProductCards() : (<p id={styles.noProductsText}>There are no art pieces available to purchase</p>)}
                </Row>
							</Col>
						</Row>
					</Container>
				</div>
			</main>
		</Layout>
	);
}


export async function getStaticProps(context) {
  
  const productsApiCall = await httpClient.post("/PublicListProducts", {
    "pagenumber": 0,
    "numberrecords": 5,
    "orderSelection": 0,
    "ascDesc": 0
  });

  //DA FARE: WRAP IN TRY CATCH AND MANAGE STATUSES (!!!)

  const productsData = productsApiCall.data;
 
  const products2 = [ 
    {
      "id": "76b32f75-d15d-4e0a-b60d-93e29dfa77cc",
      "userId": null,
      "contract_mappingId": 0,
      "contract_ethAddressOwner": null,
      "contract_descriptProduct": "quadro con donna che fa vedere la figa 4",
      "contract_tokenUri": null,
      "contract_isSelled": false,
      "contract_price" : 100.000000000000000001,
      "urlImageVideoPresentation": "img/example/Malevich.jpg",
      "author": "Kazimir Malevich",
      "title": "Portrait of Lenin and Stalin",
      "describtion": "This iconic painting represents the synthesis between suprematism, given by the abstract composition, and the socialist doctrine that imposed realism, given by the two portraits.",
      "history": "This iconic painting represents the synthesis between suprematism, given by the abstract composition, and the socialist doctrine that imposed realism, given by the two portraits.      Absolutely out of the ordinary is the portrait in the foreground of a young Stalin, as successor of Lenin, depicted in a very patriotic way, in compliance with the propaganda ideology of Russia in      the 1930s, which until his incarceration, before denying him, had favored the artist, who had enthusiastically joined the post-revolutionary regime."
  },
  {
    "id": "76b32f75-d15d-4e0a-b60d-93e29dfa77cz",
    "userId": null,
    "contract_mappingId": 0,
    "contract_ethAddressOwner": null,
    "contract_descriptProduct": "quadro con donna che fa vedere la figa 4",
    "contract_tokenUri": null,
    "contract_isSelled": false,
    "contract_price" : 100.000000000000000001,
    "urlImageVideoPresentation": "img/example/Canaletto.png",
    "author": "Giovanni Antonio Canal, detto Il Canaletto",
    "title": "Capriccio con colonnato e cortile di palazzo",
    "describtion": "The high portico, supported by elegant columns with finely decorated capitals, hosts various people dedicated to their activities, such as the woman sitting on a stool and the child behind the column trying to sell something to an elegant man.",
    "history": "Canaletto was a man of his time and in the midst of an Illuminist climate he sought a truth that was based on the same method of the new experimental science; for this reason he repeated the same view over and over again using the same drawing with some variations. What is important to know is that in 1765, two years after he was admitted to the Academia, he painted the “Capriccio” representing the courtyard and the colonnade of a Venetian palace."
  }
  ]

  return {
    props: {
      // products: products2, //use fake data
      products: productsData //use real data
     },
  }
}


export default Home;