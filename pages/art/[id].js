/*
 AUTHOR: Federico G. De Faveri
 DATE: April 8th, 2021
 PURPOSE: This is the Art product detail page of the InArt NFT platform.
*/


//dependencies
import React, {useState} from 'react';
import {Container, Row, Col, Card, Button, Modal} from 'react-bootstrap';
import {Grid, TextField} from '@material-ui/core';
// import {Link} from 'react-router-dom';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

//hooks
import { useEffect } from 'react';
import { useEthers, account } from '@usedapp/core';

// library components
import {Avatar, Accordion, AccordionSummary, Typography, AccordionDetails} from '@material-ui/core';

// custom components
import Header from '../../components/Header';
import Footer from '../../components/Footer';

//assets and icons
import styles from '../../styles/ArtProductDetailPage.module.css'
import ExpandMore from '@material-ui/icons/ExpandMore';
import MenuBook from '@material-ui/icons/MenuBook';
import TheatersIcon from '@material-ui/icons/Theaters';
import DescriptionIcon from '@material-ui/icons/Description';
import InfoIcon from '@material-ui/icons/Info';
import ContactsIcon from '@material-ui/icons/Contacts';
import httpClient from '../../utilities/http-client';
import Layout from '../../components/Layout';

//variables

// COMPONENT STARTS HERE
function ArtProductDetailPage(props) {

  const { product } = props;
  console.log("PROPPI.product", product)

  const { activate, account } = useEthers();

  let authenticated = true

  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
      setSelectedDate(date);
  };



  //functions ---

  //render functions

  //render
  return (
    <Layout title="Opera">
        <div id="product-detail-container">
            <Container>
                <Row>
                    <Col xs={12} lg={6} >
                        <img id="product-detail-img" src={product.urlImageVideoPresentation} />
                        
                        <div className="product-detail-expandable-section">
                            <Accordion expanded={true}>
                                <AccordionSummary
                                expandIcon={false}
                                aria-controls="panel1a-content"
                                id="panel1a-header3"
                                >
                                <span className={"product-detail-box-title"}> <InfoIcon />Details</span>
                                </AccordionSummary>
                                <AccordionDetails id="product-details-content-container">
                                    <Typography>
                                    {product.describtion}
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </div>
    
                        <div className="product-detail-expandable-section">
                            <Accordion>
                                <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel1a-content"
                                id="panel1a-header4"
                                >
                                <span className={"product-detail-box-title"}> <DescriptionIcon />Documents</span>
                                </AccordionSummary>
                                <AccordionDetails id="product-documents-content-container">
                                <Container fluid>
                                    <Row>
                                        <Col xs={6}>
                                            <img src={"/img/document1.png"} />
                                            <span className="product-docs-section-title">Scientific Lab Tests</span>
                                            <p>Lab analyses and reflectographic examinations are included.</p>
                                        </Col>
                                        <Col xs={6}>
                                            <img src={"/img/document2.png"} />
                                            <span className="product-docs-section-title">Condition report</span>
                                            <p>“Atelier Arte” - Genève: Good conditions</p>
                                        </Col>
                                    </Row>
                                    </Container> 
                                </AccordionDetails>
                            </Accordion>
                        </div>
    
                        <div className="product-detail-expandable-section">
                            <Accordion>
                                <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel1a-content"
                                id="panel1a-header7"
                                >
                                <span className={"product-detail-box-title"}> <ContactsIcon />Gallery Info</span>
                                </AccordionSummary>
                                <AccordionDetails id="product-gallery-content-container">
                                    <Typography>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                        sit amet blandit leo lobortis eget.
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                        sit amet blandit leo lobortis eget.
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                                    </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </div>
    
                    </Col>
                    <Col xs={12} lg={6} >
                        <h1 id="product-detail-main-title">{product.title.toUpperCase()}</h1>
                        <Card id={"product-details-price-box"} >
                            <h2 id="price-title-attribute">Current Price:</h2>
                            <div className="pricetag-wrapper-div">
                                <span id="product-pricetag-eth">3999.0279 Ξ</span> <span id="product-pricetag-usd">($8,664,733.74)</span>
                            </div>
                            <div className="button-group-cta-two">
                                <Button id="product-buy-now-button">Buy Now</Button>
                                <Button variant="success" onClick={() => setCalendarModalOpen(true)} id="product-book-meeting-button">Schedule a Meeting</Button>
                            </div>
                        </Card>
    
                        <div id="product-description-container">
                            <Accordion>
                                <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel1a-content"
                                id="panel1a-header"
                                >
                                <span className={"product-detail-box-title"}> <MenuBook />Storia Dell'Opera</span>
                                </AccordionSummary>
                                <AccordionDetails id="product-details-content-container">
                                <Typography>
                                    {product.history}
                                </Typography>
                                </AccordionDetails>
                            </Accordion>
                        </div>
    
                        <div className="product-detail-expandable-section">
                            <Accordion>
                                <AccordionSummary
                                expandIcon={<ExpandMore />}
                                aria-controls="panel1a-content"
                                id="panel1a-header2"
                                >
                                <span className={"product-detail-box-title"}> <TheatersIcon />Video</span>
                                </AccordionSummary>
                                <AccordionDetails id="product-video-content-container">
                                    <iframe width="560" height="315" src="https://www.youtube.com/embed/e3YS6uZ87Ec" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
                                </AccordionDetails>
                            </Accordion>
                        </div>
    
    
                    </Col>
    
                </Row>
            </Container>
    
            <Modal
                show={calendarModalOpen}
                onHide={() => setCalendarModalOpen(false)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                <Modal.Title>Modal title</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                <p>Pick a date and a time</p>
                <div>
                <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <Grid container justify="space-around" className={"datepickers-container"}>
                        <KeyboardDatePicker
                        margin="normal"
                        id="date-picker-dialog"
                        label="Date picker dialog"
                        format="MM/dd/yyyy"
                        value={selectedDate}
                        onChange={() => handleDateChange()}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                        />
                        <KeyboardTimePicker
                        margin="normal"
                        id="time-picker"
                        label="Time picker"
                        value={selectedDate}
                        onChange={() => handleDateChange()}
                        KeyboardButtonProps={{
                            'aria-label': 'change time',
                        }}
                        />
                    </Grid>
    
                </MuiPickersUtilsProvider>
                </div>
                <form className={"text-field-wrapper"} noValidate autoComplete="off">
                <TextField id="email-textfield-modal" label="Email" />
                </form>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setCalendarModalOpen(false)}>
                    Close
                </Button>
                <Button variant="primary">OK</Button>
                </Modal.Footer>
            </Modal>
            
        </div>
    </Layout>    
  );
}


export async function getStaticProps(context) {
  console.log("CONTEXT", context.params.id)
  const artId = context.params.id;
//   const product = await httpClient.get("/PublicProduct");
//   if (!product) {
//     return {
//       notFound: true,
//     }
//   }

// FAKE API CALL

const prodotto = {
    "userId": null,
    "contract_mappingId": 0,
    "contract_ethAddressOwner": null,
    "contract_descriptProduct": "This iconic painting represents the synthesis between suprematism, given by the abstract composition, and the socialist doctrine that imposed realism, given by the two portraits.",
    "contract_tokenUri": null,
    "contract_isSelled": false,
    "contract_price" : 100.000000000000000001,
    "urlImageVideoPresentation": "/img/example/Malevich.jpg",
    "author": "Kazimir Severinovic Malevic",
    "title": "Stalin and Lenin",
    "describtion": "Kazimir Severinovic Malevic (Kiev 23 February 1879 - Leningrad, 15 May 1935), was a pioneer of geometric abstractionism, Russian avant-gardes and futurism. He studied in Moscow, where he met and influenced many important artists, including Kandinsky. He has always maintained a strong link with Paris, Berlin and Europe. Abstract painting came to light shortly before the Bolshevik revolution of 1917, following which it obtained important public positions in the field of education and art. However, due to his acquaintances around Europe and in particular in Germany, he was arrested in 1930 and many of his notes and artworks were destroyed. His theories resulted in supremacism: for Malevich, nature had no interest and nothing was more relevant than sensitivity in art. In fact, he said that with supremacism art arrives at pure expression without representation. About seventy paintings and seventy drawings prior to 1927 remained in Berlin before returning to Moscow.",
    "history": "Absolutely out of the ordinary is the portrait in the foreground of a young Stalin, as successor of Lenin, depicted in a very patriotic way, in compliance with the propaganda ideology of Russia in the 1930s, which until his incarceration, before denying him, had favored the artist, who had enthusiastically joined the post-revolutionary regime. It is therefore evident that despite the forcings of the Soviet regime, Malevich never abandoned his artistic conception and that in the last years of his life he tried to reconcile his creed with what was required."
}

  return {
    props: { product: prodotto }, // will be passed to the page component as props
  }
}

export const getStaticPaths = async (slug) => {

    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: 'blocking' //indicates the type of fallback
    }
}


export default ArtProductDetailPage;