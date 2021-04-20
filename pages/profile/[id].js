/*
 AUTHOR: Federico G. De Faveri
 DATE: April 14th, 2021
 PURPOSE: This is the Profile page of the InArt NFT platform.
*/


//dependencies
import React, {useState} from 'react';

//hooks
import { useEffect } from 'react';
import { useEthers, account } from '@usedapp/core';

//my components
import Layout from '../../components/Layout';


//library components
import {Container, Row, Col, Image, Button, Form, Modal} from 'react-bootstrap';
import {Paper, Avatar, Accordion, AccordionSummary, Typography, AccordionDetails} from '@material-ui/core';


//assets and icons
import styles from '../../styles/ProfilePage.module.css'
import { useAuth } from '../../hooks/auth';
import httpClient from '../../utilities/http-client';
import { Publish, Edit } from '@material-ui/icons';

//variables

// COMPONENT STARTS HERE
function ProfilePage(props) {
    const { authToken } = useAuth();
    console.log("PROPPI", props)

    const { activate, account } = useEthers();

    //state
    const [userId, setUserId] = useState(null);
    const [nomeIstitutoProprietario, setNomeIstitutoProprietario] = useState(null);
    const [titoloIstitutoProprietario, setTitoloIstitutoProprietario] = useState(null);
    const [descrizioneIstitutoProprietario, setDescrizioneIstitutoProprietario] = useState(null);
    const [urlImageVideoProfile, setUrlImageVideoProfile] = useState(null);
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [userEmail, setUserEmail] = useState(null);
    const [mailIsVisible, setMailIsVisible] = useState(false);
    const [telephoneIsVisible, setTelephoneIsVisible] = useState(false);
    const [profileModified, setProfileModified] = useState(false);
    const [valueToEdit, setValueToEdit] = useState(null);
    const [avatarImages, setAvatarImages] = useState(null);
    const [avatarImgModal, setAvatarImgModal] = useState(false);

    useEffect( async () => {
        if (!authToken) { return }

        let profileRawData;
        
        try {
            profileRawData = await httpClient.get("/UserInfo/me")
        } catch (e) {
            return console.error("[E]", e)
        }

        const profileData = profileRawData.data;

        console.log("DATA", profileData);

        const {id, nomeIstitutoProprietario, titoloIstitutoProprietario, descrizioneIstitutoProprietario, urlImageVideoProfile, phoneNumber, email, mailIsVisible, telephoneIsVisible} = profileData;

        setUserId(id)
        setNomeIstitutoProprietario(nomeIstitutoProprietario);
        setTitoloIstitutoProprietario(titoloIstitutoProprietario);
        setDescrizioneIstitutoProprietario(descrizioneIstitutoProprietario);
        setUrlImageVideoProfile(urlImageVideoProfile);
        setPhoneNumber(phoneNumber);
        setUserEmail(email);
        setMailIsVisible(mailIsVisible)
        setTelephoneIsVisible(telephoneIsVisible)

    }, [authToken]);

    useEffect( async () => {
        if (avatarImgModal === false) {
            return
        }

        console.log("FETCHING IMAGES")
        const payload = {
            userid: userId
        }
        let userImgDataRaw
        
        try {
            userImgDataRaw = await httpClient.post("/UserListImages", payload);
        } catch (error) {
            return console.error("[E]", error)
        }

        console.log("REPLY", userImgDataRaw)
        const userImgData = userImgDataRaw.data
        setAvatarImages(userImgData)

    }, [avatarImgModal])


    //functions ---
    const _handleEditInfo = (e, info, setter) => {
        e.preventDefault();

        console.log("Editing", info)
        setValueToEdit(info)        
    }

    const _handleDoneEditInfo = () => {
        console.log("Done editing")
        setValueToEdit(null)
    }

    const _handleShowHideInfo = (info, setter) => {
        setProfileModified(true)
        setter(!info)
    }

    const _handleChangeInfoValue = (e, setter) => {
        setProfileModified(true)
        setter(e.target.value)
    }

    const _handleSaveNewProfileInfo = async () => {
        //build the payload
        const payload = {
            nomeIstitutoProprietario: nomeIstitutoProprietario,
            titoloIstitutoProprietario: titoloIstitutoProprietario,
            descrizioneIstitutoProprietario: descrizioneIstitutoProprietario,
            phoneNumber: phoneNumber,
            email: userEmail,
            mailIsVisible: mailIsVisible,
            telephoneIsVisible: telephoneIsVisible
        }

        let postNewInfoAnswer;
        
        try {
            postNewInfoAnswer = await httpClient.post("/UserInfo/Update", payload);
        } catch (error) {
            return console.error("[E]", error)
        }

        // TODO handle all statuses here
        console.log("STATUS", postNewInfoAnswer.status)

        console.log(postNewInfoAnswer, postNewInfoAnswer.data)

        setProfileModified(false);
    }

    const _handleChangeAvatar = (e) => {
        e.preventDefault()
        setAvatarImgModal(true)

    }

    const _handleNewImgUpload = async (e) => {
        const fileUploaded = e.target.files[0];

        console.log("let's go, upload img")

        const formData = new FormData();
        formData.append('image',fileUploaded)
        formData.append('tag',"Uploaded Profile Image")
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        }
        
        const responseUpload = await httpClient.post("/Upload/UploadImage", formData, config); 

        //CHECK STATUSES!!!! TODO

        console.log(4, responseUpload)
    }


    //render functions
    const renderInfo = (attributeName, info, setter) => {

        if (valueToEdit === attributeName) {

            return (
                <Form>
                    <Form.Group>
                        <div className={styles.infoInputsContainer}>
                            <Form.Control as={ attributeName === "descrizioneIstitutoProprietario" ? "textarea" : "input" } type="text" value={info} onChange={(e) => _handleChangeInfoValue(e, setter)} />
                            <Button onClick={() => {_handleDoneEditInfo()}}>Done</Button>
                        </div>
                    </Form.Group>
                </Form>
            )
        }


        return (
            <p>{info ? info : (<i>No info</i>)} <a href="#" onClick={(e) => _handleEditInfo(e, attributeName, setter)}><Edit fontSize="small" /></a> </p>
        )
    }

    const renderModalBody = () => {

        let allTheImages;

        console.log("AVAA", avatarImages)

        if (!avatarImages) {
            return (
                <p>Loading..</p>
            )
        }
        
        
        if (avatarImages.length <= 0) {
            allTheImages = (
                <p>No images</p>
            )
        } else {
            allTheImages = avatarImages.map( (imgData, i) => {
                console.log(imgData, 5)
                return (
                    <a href="#">
                        <Image className={styles.avatarImageGridItem} key={i} src={imgData.url} />
                    </a>
                )
            })
        }
        



        return (
            <div>
                <div >
                    {allTheImages}
                </div>
                <hr />
                <Form.File id="formcheck-api-regular">
                    <Form.File.Label>File input</Form.File.Label>
                    <Form.File.Input onChange={ (e) => _handleNewImgUpload(e)} />
                </Form.File>
            </div>
        )
    }

    //render
    return (

        <Layout title="Profilo">
            <div id={styles.profilePageContainer}>
                <Container>
                    <Row>
                        <Col>
                            <Typography id={styles.profileInfoTitle} variant="h4">Profile Info</Typography>
                            <Paper id={styles.profileInfoCard} elevation={3}>
                                <Row id={styles.cardRowFirst}>
                                    <Col xs={12} md={12} lg={6}>
                                        <div id={styles.avatarContainer}>
                                            <Image src={urlImageVideoProfile} />
                                            <a href="#" onClick={(e) => _handleChangeAvatar(e)} className={styles.imageOverlay}>
                                                   <Publish id={styles.imageOverlayIcon} /> 
                                            </a>
                                        </div>
                                        <div id={styles.userDataContainer}>
                                            <div>
                                                <h5>Email</h5>
                                                <p>{ userEmail }</p>
                                            </div>
                                            <div>
                                                <h5>Phone Number</h5>
                                                { renderInfo("phoneNumber", phoneNumber, setPhoneNumber) }
                                            </div>
                                            <div>
                                                <Form.Group controlId="formBasicCheckbox">
                                                    <Form.Check checked={mailIsVisible} onChange={() => _handleShowHideInfo(mailIsVisible, setMailIsVisible)} type="checkbox" label="Show email" />
                                                </Form.Group>
                                            </div>
                                            <div>
                                                <Form.Group controlId="formBasicCheckbox">
                                                    <Form.Check checked={telephoneIsVisible} onChange={() => _handleShowHideInfo(telephoneIsVisible, setTelephoneIsVisible)} type="checkbox" label="Show phone number" />
                                                </Form.Group>
                                            </div>
                                        </div>
                                    </Col>
                                    <Col xs={12} md={12} lg={6}>
                                        <div id={styles.galleryDataContainer}>
                                            <div>
                                                <h5>Metamask Address</h5>
                                                <p id={styles.metamaskAddressString}>{ account }</p>
                                            </div>
                                            <div>
                                                <h5>Name</h5>
                                                { renderInfo("nomeIstitutoProprietario", nomeIstitutoProprietario, setNomeIstitutoProprietario) }
                                            </div>
                                            <div>
                                                <h5>Istituto</h5>
                                                { renderInfo("titoloIstitutoProprietario", titoloIstitutoProprietario, setTitoloIstitutoProprietario) }
                                            </div>
                                            <div>
                                                <h5>Descrizione</h5>
                                                { renderInfo("descrizioneIstitutoProprietario", descrizioneIstitutoProprietario, setDescrizioneIstitutoProprietario) }
                                            </div>
                                        </div>
                                    </Col>
                                    <Col id={styles.saveButtonContainer} xs={12}>
                                        <Button className={profileModified ? styles["pulse"] : ""} disabled={profileModified ? false : true} onClick={() => _handleSaveNewProfileInfo()} variant="success">Save new profile info  </Button>
                                    </Col>
                                </Row>

                            </Paper>
                        </Col>
                    </Row>
                </Container>

                <Modal
                show={avatarImgModal}
                onHide={() => setAvatarImgModal(false)}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title-vcenter">
                        Change Profile Image    
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        { renderModalBody() }
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={() => setAvatarImgModal(false)}>Close</Button>
                    </Modal.Footer>
                </Modal>


            </div>
        </Layout>
    );
}


export async function getStaticProps(context) {

    console.log("CONTEXT", context)

    return {
        props: { loading: true } // will be passed to the page component as props
    }
}

export const getStaticPaths = async (slug) => {

    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: 'blocking' //indicates the type of fallback
    }
}


export default ProfilePage;