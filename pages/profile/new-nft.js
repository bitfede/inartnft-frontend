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
import { ContactSupportOutlined } from '@material-ui/icons';
import { set } from 'date-fns';

//variables

// COMPONENT STARTS HERE
function NewNftPage(props) {
    const { authToken } = useAuth();
    // console.log("PROPPI", props)

    const { activate, account } = useEthers();

    //state
    //step 1
    const [activeStep, setActiveStep] = useState(0);
    const [newNftTitle, setNewNftTitle] = useState(null);
    //step 2
    const [newNftId, setNewNftId] = useState(null);
    const [newNftAuthor, setNewNftAuthor] = useState(null);
    const [newNftPrice, setNewNftPrice] = useState(null);
    const [newNftDescription, setNewNftDescription] = useState(null);
    const [newNftHistory, setNewNftHistory] = useState(null);
    const [newNftMainImage, setNewNftMainImage] = useState(null);
    const [imgModalOpen, setImgModalOpen] = useState(false);
    const [imgToUpload, setImgToUpload] = useState(null);
    const [imgDestination, setImgDestination] = useState(null);
    const [imgToUploadPreview, setImgToUploadPreview] = useState(null);
    const [isImgUploading, setIsImgUploading] = useState(false);
    //step 3
    const [encryptedDocs, setEncryptedDocs] = useState([]);
    const [additionalImage, setAdditionalImage] = useState(null);
    const [additionalImageTitle, setAdditionalImageTitle] = useState(null);
    const [additionalImageDesc, setAdditionalImageDesc] = useState(null)
    const [newNftVideo, setNewNftVideo] = useState(null);
    const [newNftVideoTitle, setNewNftVideoTitle] = useState(null);
    const [newNftVideoDesc, setNewNftVideoDesc] = useState(null);

    useEffect( async () => {

        console.log("PAGE LOADED! LETS MAKE NFTs")

    }, []);

    useEffect ( async () => {

        if (!imgToUpload) return

        console.log(1111, imgToUpload.type)

        const fileSrc = URL.createObjectURL(imgToUpload);

        console.log(2222, fileSrc)


        setImgToUploadPreview(fileSrc)

        // free memory when ever this component is unmounted
        return () => URL.revokeObjectURL(objectUrl)

    }, [imgToUpload])

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

        if (activeStep === 2) {

            //upload docs
     
            const formData = new FormData();

            encryptedDocs.map( (doc, i) => {
                console.log(i, doc)
                formData.append('documentsImagesVideosMusic', doc)
            })
            
            formData.append('productsId', newNftId);
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            }
            
            const step3DocsRes = await httpClient.post(`/InsertProducts/InsertElementsForEncypt`, formData, config); 
            //CHECK HTTP STATUSES!!!!! TO-DO
    
            console.log("UPL DOCS", step3DocsRes)
    
            // const uploadedImgUrl = responseUpload.data.url
            
            //upload img
            console.log(additionalImage, "ready")

            const payloadImg = {
                "productsId" : newNftId,
                "titleImage" : additionalImageTitle, 
                "descriptionImage" : additionalImageDesc,
                "url" : additionalImage,
                "tag" : newNftTitle
            }

            const step3ImgRes = await httpClient.post("/InsertProducts/InsertUpdateImage", payloadImg);
            //TODO Handle all statuses, 200, 400 etc

            console.log("UPL IMG", step3ImgRes)


            //upload video
            console.log(newNftVideo, "video ready")

            const payloadVideo = {
                "productsId" : newNftId,
                "titleVideo" : newNftVideoTitle, 
                "descriptionVideo" : newNftVideoDesc,
                "url" : newNftVideo,
                "tag" : newNftTitle
            }

            const step3VideoRes = await httpClient.post("/InsertProducts/InsertUpdateVideo", payloadVideo);
            //TODO Handle all statuses, 200, 400 etc

            console.log("UPL VID", step3VideoRes)

            // do not continue, return here if there were problems  
        }

        let currentStep = activeStep;
        setActiveStep(currentStep + 1)
    }

    const _handleNewImg = (e, imageType) => {

        const fileUploaded = e.target.files[0];


        setImgToUpload(fileUploaded);
        setImgDestination(imageType)

        setImgModalOpen(true);


        return
    }

    const _handleCloseImgPreviewModal = () => {

        setImgToUpload(null);
        setImgToUploadPreview(null);
        setImgModalOpen(false);
        

    }

    const _handleResetImg = (e) => {
        //empty the FileList every time you click on choose file
        e.target.value = "";
    }

    const _handleFinalizeImgUpload = async () => {
        console.log("DAI MONA, ADESSO MANDA l'IMG AL SERVER")

        setIsImgUploading(true)

        let apiPath = "UploadImage";
        console.log("TESTIN", imgToUpload.type.split("/")[0], "=", "video")
        if (imgToUpload.type.split("/")[0] === "video") {
            apiPath = "UploadVideo"
        }
 
        const formData = new FormData();
        formData.append('image', imgToUpload)
        formData.append('tag', newNftTitle)
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        
        const responseUpload = await httpClient.post(`/Upload/${apiPath}`, formData, config); 
        //CHECK HTTP STATUSES!!!!! TO-DO

        console.log("UPL IMG", responseUpload)

        const uploadedImgUrl = responseUpload.data.url


        if (imgDestination === "profile_main_image") {
            setNewNftMainImage(uploadedImgUrl)
        }

        if (imgDestination === "additional_image") {
            setAdditionalImage(uploadedImgUrl)
        }

        if (imgDestination === "main_video") {
            setNewNftVideo(uploadedImgUrl)
            console.log("VIDEO UPL:", uploadedImgUrl)
        }

        setIsImgUploading(false)
        setImgModalOpen(false);
        setImgToUploadPreview(null);

    }

    const _handleAddEncryptedDocs = (e) => {
        const docAdded = e.target.files[0];
        let encryptedDocsClone = encryptedDocs;
        encryptedDocsClone.push(docAdded);
        setEncryptedDocs(encryptedDocsClone);
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
                            <Form.File onClick={(e) => _handleResetImg(e)} onChange={ (e) => _handleNewImg(e, "profile_main_image")} id="exampleFormControlFile1" label="NFT Image" />
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


        if (activeStep === 2) {

            
            return (
                <div>
                <h5 className={styles.mainTitleOfSection}>Insert documents about this NFT (Max 4)</h5>
                <Form>

                    <Form.Group controlId="formDoc1">
                        <Form.File onClick={(e) => console.log(e)} onChange={ (e) => _handleAddEncryptedDocs(e)} id="nftDocumentsForm1" label="NFT Encrypted Document 1" />
                    </Form.Group>

                    <Form.Group controlId="formDoc2">
                        <Form.File onClick={(e) => console.log(e)} onChange={ (e) => _handleAddEncryptedDocs(e)} id="nftDocumentsForm2" label="NFT Encrypted Document 2" />
                    </Form.Group>

                    <Form.Group controlId="formDoc3">
                        <Form.File onClick={(e) => console.log(e)} onChange={ (e) => _handleAddEncryptedDocs(e)} id="nftDocumentsForm3" label="NFT Encrypted Document 3" />
                    </Form.Group>

                    <Form.Group controlId="formDoc2">
                        <Form.File onClick={(e) => console.log(e)} onChange={ (e) => _handleAddEncryptedDocs(e)} id="nftDocumentsForm4" label="NFT Encrypted Document 4" />
                    </Form.Group>


                </Form>


                <h5 className={styles.mainTitleOfSection}>Insert an additional image</h5>
                <Form>

                    <Form.Group controlId="formDoc1">
                        <Form.File onClick={(e) => _handleResetImg(e)} onChange={ (e) => _handleNewImg(e, "additional_image")} id="nftDocumentsForm1" label="NFT Additional Image" />
                    </Form.Group>

                    <Form.Group controlId="formPrice">
                        <Form.Label>Image Title</Form.Label>
                        <Form.Control onChange={(e) => setAdditionalImageTitle(e.target.value)} as="input" placeholder="" />
                    </Form.Group>

                    <Form.Group controlId="formDescription">
                        <Form.Label>Image Description</Form.Label>
                        <Form.Control onChange={(e) => setAdditionalImageDesc(e.target.value)} as="textarea" placeholder="Write your image description here...." />
                    </Form.Group>
                    {
                        additionalImage ? (<Image src={additionalImage} id={styles.mainImgThumbnailPreview} />) : ""
                    }
                </Form>

                <h5 className={styles.mainTitleOfSection}>Insert video</h5>
                <Form>

                    <Form.Group controlId="formDoc1">
                        <Form.File onClick={(e) => _handleResetImg(e)} onChange={ (e) => _handleNewImg(e, "main_video")} id="nftDocumentsForm1" label="NFT Main Video" />
                    </Form.Group>

                    <Form.Group controlId="formPrice">
                        <Form.Label>Video Title</Form.Label>
                        <Form.Control onChange={(e) => setNewNftVideoTitle(e.target.value)} as="input" placeholder="" />
                    </Form.Group>

                    <Form.Group controlId="formDescription">
                        <Form.Label>Video Description</Form.Label>
                        <Form.Control onChange={(e) => setNewNftVideoDesc(e.target.value)} as="textarea" placeholder="Write your image description here...." />
                    </Form.Group>
                    
                    {
                        newNftVideo ? (<video controls id={styles.mainImgModalPreview} ><source src={newNftVideo} type="video/mp4" />Sorry, your browser doesn't support embedded videos.</video>) : ("")
                    }
                    
                </Form>

            </div>
                )
        }

        if (activeStep === 3) {
            return (
                <div>
                    <h5 className={styles.mainTitleOfSection}>Insert documents about this NFT (Max 4)</h5>
                </div>
            )
        }



        return (
            <p>Diocane!!!</p>
        )
    }

    const renderMainImgModalBody = () => {

        console.log(imgToUploadPreview, imgDestination)

        if (imgDestination === "main_video" ) {

            const videoFormat = imgToUpload

            return (
                <div id={styles.mainImgModalBodyContainer}>
                    <video controls id={styles.mainImgModalPreview} >
                        <source src={imgToUploadPreview} type={videoFormat ? videoFormat.type : "video/mp4"} />
                    </video>
                </div>
            )
        }

        return (
            <div id={styles.mainImgModalBodyContainer}>
                <Image id={styles.mainImgModalPreview} src={imgToUploadPreview} />
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
                show={imgModalOpen}
                onHide={() => _handleCloseImgPreviewModal()}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
            >
                
                <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">
                        Do you want to upload this file?
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    { renderMainImgModalBody() }
                </Modal.Body>
                <Modal.Footer>
                    { <Button onClick={() => _handleFinalizeImgUpload()} variant="success">Yes</Button> }
                    <Button onClick={() => _handleCloseImgPreviewModal()} variant="danger" >No</Button>
                </Modal.Footer>
            </Modal>

        </Layout>
    );
}

export default NewNftPage;