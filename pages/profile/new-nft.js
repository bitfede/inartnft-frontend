/*
 AUTHOR: Federico G. De Faveri
 DATE: April 26th, 2021
 PURPOSE: This is the page where users can create NFTs.
*/


//dependencies
import React, {useState} from 'react';
import httpClient from '../../utilities/http-client';

//hooks
import { useEffect } from 'react';
import { useEthers, account } from '@usedapp/core';

//my hooks
import { useAuth } from '../../hooks/auth';

//my components
import Layout from '../../components/Layout';


//library components
import {Container, Row, Col, Image, Button, Form, Modal, Spinner} from 'react-bootstrap';
import {Stepper, Step, StepLabel, CardMedia, CardContent, CardActions, Typography, AccordionDetails} from '@material-ui/core';


//assets and icons
import styles from '../../styles/NewNftPage.module.css';

//variables

// COMPONENT STARTS HERE
function NewNftPage(props) {
    const { authToken } = useAuth();
    // console.log("PROPPI", props)

    const { activate, account } = useEthers();

    //state
    const [activeStep, setActiveStep] = useState(0);
    const [newNftTitle, setNewNftTitle] = useState(null);
    const [newNftId, setNewNftId] = useState(null);
    const [newNftAuthor, setNewNftAuthor] = useState(null);
    const [newNftPrice, setNewNftPrice] = useState(null);
    const [newNftDescription, setNewNftDescription] = useState(null);
    const [newNftHistory, setNewNftHistory] = useState(null);
    const [newNftMainImage, setNewNftMainImage] = useState(null);
    const [mainImgModalOpen, setMainImgModalOpen] = useState(false);
    const [mainImgToUpload, setMainImgToUpload] = useState(null);
    const [mainImgToUploadPreview, setMainImgToUploadPreview] = useState(null);
    const [isMainImgUploading, setIsMainImgUploading] = useState(false)


    useEffect( async () => {

        console.log("PAGE LOADED! LETS MAKE NFTs")

    }, []);

    useEffect ( async () => {

        if (!mainImgToUpload) return

        const fileSrc = URL.createObjectURL(mainImgToUpload);

        setMainImgToUploadPreview(fileSrc)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)

    }, [mainImgToUpload])

    const progressSteps = [ "NFT Title", "Add info", "Upload multimedia", "Finalize" ];


    //functions ---
    const _handleNextStep = async () => {


        if (activeStep === 0) {
            const payload = JSON.stringify(newNftTitle);

            const res = await httpClient.post("/InsertProducts/InsertNewProduct", payload);

            console.log("res", res)

            const { id } = res.data;

            setNewNftId(id)
        }


        if (activeStep === 1) {
            //here as payload put object with id, avatar url, descr, etc
            const payload = {
                id: newNftId,
                urlImageVideoPresentation: newNftMainImage,
                author: newNftAuthor,
                contract_price: newNftPrice,
                title: newNftTitle,
                describtion: newNftDescription,
                history: newNftHistory
            }


            const res = await httpClient.post("/InsertProducts/Update", payload);
            //TODO Handle all statuses, 200, 400 etc

            console.log("POST PROD INFO", res)
        }

        let currentStep = activeStep;
        setActiveStep(currentStep + 1)
    }

    const _handleNewNftMainImg = (e) => {

        const fileUploaded = e.target.files[0];

        console.log(fileUploaded, "<><>")

        setMainImgModalOpen(true);
        setMainImgToUpload(fileUploaded);

        return
    }

    const _handleCloseImgPreviewModal = () => {

        setMainImgToUpload(null);
        setMainImgToUploadPreview(null);
        setMainImgModalOpen(false);
        

    }

    const _handleResetImg = (e) => {
        //empty the FileList every time you click on choose file
        e.target.value = "";
    }

    const _handleFinalizeMainImgUpload = async () => {
        console.log("DAI MONA, ADESSO MANDA l'IMG AL SERVER")
        
        setIsMainImgUploading(true)
        const formData = new FormData();
        formData.append('image', mainImgToUpload)
        formData.append('tag', newNftTitle)
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        
        const responseUpload = await httpClient.post("/Upload/UploadImage", formData, config); 
        //CHECK HTTP STATUSES!!!!! TO-DO

        console.log("UPL MAIN IMG", responseUpload)

        const uploadedImgUrl = responseUpload.data.url
        setIsMainImgUploading(false)
        setNewNftMainImage(uploadedImgUrl)
        setMainImgModalOpen(false);
        setMainImgToUploadPreview(null)

    }

    //render functions
    const renderNewArtInputs = () => {


        if (activeStep === 0) {
            return (
                <div>
                    <h5>Insert the title of the art piece</h5>
                    <Form>
                        <Form.Group controlId="formTitle">
                            <Form.Label>Title of the NFT</Form.Label>
                            <Form.Control value={ newNftTitle ? newNftTitle : "" } onChange={(e) => {setNewNftTitle(e.target.value)}} type="email" placeholder="Enter the title" />
                            <Form.Text className="text-muted">
                                (This will be the main title of the NFT)
                            </Form.Text>
                        </Form.Group>
                    </Form>
                </div>
            )
        }


        if (activeStep === 1) {
            return (
                <div>
                    <h5>Insert additional data about the art piece</h5>
                    <Form>
                        <Form.Group controlId="formAuthor">
                            <Form.Label>Author</Form.Label>
                            <Form.Control value={newNftAuthor ? newNftAuthor : "" } onChange={(e) => setNewNftAuthor(e.target.value)} placeholder="Enter the author" />
                            <Form.Text className="text-muted">
                                (The author of the art piece)
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formPrice">
                            <Form.Label>Price</Form.Label>
                            <Form.Control onChange={(e) => setNewNftPrice(e.target.value)} as="input" placeholder="110" />
                            <Form.Text className="text-muted">
                                (The price of the art piece in ETH)
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formDescription">
                            <Form.Label>Description</Form.Label>
                            <Form.Control onChange={(e) => setNewNftDescription(e.target.value)} as="textarea" placeholder="Write your description here...." />
                            <Form.Text className="text-muted">
                                (The description of the art piece)
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formHistory">
                            <Form.Label>History</Form.Label>
                            <Form.Control onChange={(e) => setNewNftHistory(e.target.value)} as="textarea" placeholder="Write the history of the NFT here...." />
                            <Form.Text className="text-muted">
                                (The history of the art piece)
                            </Form.Text>
                        </Form.Group>

                        <Form.Group controlId="formHistory">
                            <Form.File onClick={(e) => _handleResetImg(e)} onChange={ (e) => _handleNewNftMainImg(e)} id="exampleFormControlFile1" label="NFT Image" />
                            <Form.Text className="text-muted">
                                (The main image of the art piece)
                            </Form.Text>
                            {
                                newNftMainImage ? (<Image src={newNftMainImage} id={styles.mainImgThumbnailPreview} />) : ""
                            }
                        </Form.Group>


                    </Form>
                </div>
            )


        }



        return (
            <p>Diocane!!!</p>
        )
    }

    const renderMainImgModalBody = () => {

        

        return (
            <div id={styles.mainImgModalBodyContainer}>
                <Image id={styles.mainImgModalPreview} src={mainImgToUploadPreview} />
            </div>
        )
    }

    //render
    return (

        <Layout title="Create New NFT">
            <Container id={styles.createNftPageContainer}>
                <Typography id={styles.profileInfoTitle} variant="h4">Create a new NFT</Typography>

                <div className={styles.stepperContainer}>
                    <Stepper activeStep={activeStep} alternativeLabel>
                        {progressSteps.map((label) => (
                            <Step key={label}>
                                <StepLabel>{label}</StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </div>

                <Col>
                    <Row className={styles.inputAreaRow}>
                        {renderNewArtInputs()}
                    </Row>
                    <Row>
                        <Button onClick={() => _handleNextStep()}>Next</Button>
                    </Row>
                </Col>
            </Container>

            
            <Modal
                show={mainImgModalOpen}
                onHide={() => _handleCloseImgPreviewModal()}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                            Do you want to upload this image?
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        { renderMainImgModalBody() }
                    </Modal.Body>
                    <Modal.Footer>
                        { <Button onClick={() => _handleFinalizeMainImgUpload()} variant="success">Yes</Button> }
                        <Button onClick={() => _handleCloseImgPreviewModal()} variant="danger" >No</Button>
                    </Modal.Footer>
                </Modal>

        </Layout>
    );
}

export default NewNftPage;