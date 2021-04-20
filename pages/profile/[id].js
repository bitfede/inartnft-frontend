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
import { Edit } from '@material-ui/icons';


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
    const [modalEditOpen, setModalEditOpen] = useState(false);
    const [valueToEdit, setValueToEdit] = useState(null);

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


    //functions ---
    const _handleEditProfileInfo = (info, setter) => {

        // USE SETTER FUNCTION 
        console.log("Editing", info)
        setModalEditOpen(true);
        setValueToEdit(info);
    }

    // const _handleEditModalClose = () => {

    // }

    //render functions
    const renderEditModal = () => {
        
        console.log("value to edit:", )
        
        return (
            <Modal
                show={modalEditOpen}
                onHide={() => setModalEditOpen(false)}
                backdrop="static"
                keyboard={false}
                centered
            >
                <Modal.Header closeButton>
                <Modal.Title>Modal title</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                I will not close if you click outside me. Don't even try to press
                escape key.
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={() => setModalEditOpen(false)}>
                    Close
                </Button>
                <Button variant="primary">Understood</Button>
                </Modal.Footer>
            </Modal>
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
                                    </div>
                                    <div id={styles.userDataContainer}>
                                        <div>
                                            <h5>Email</h5>
                                            <p>{userEmail ? userEmail : (<i>No info</i>)} <a href="#" onClick={() => _handleEditProfileInfo("userEmail", setUserEmail)}><Edit fontSize="small" /></a> </p>
                                        </div>
                                        <div>
                                            <h5>Phone Number</h5>
                                            <p>{phoneNumber ? phoneNumber : (<i>No info</i>)} <a href="#"><Edit fontSize="small" /></a> </p>
                                        </div>
                                        <div>
                                            <Form.Group controlId="formBasicCheckbox">
                                                <Form.Check value={mailIsVisible} onChange={() => setMailIsVisible(!mailIsVisible)} type="checkbox" label="Show email" />
                                            </Form.Group>
                                        </div>
                                        <div>
                                            <Form.Group controlId="formBasicCheckbox">
                                                <Form.Check value={telephoneIsVisible} onChange={() => setTelephoneIsVisible(!telephoneIsVisible)} type="checkbox" label="Show phone number" />
                                            </Form.Group>
                                        </div>
                                    </div>
                                </Col>
                                <Col xs={12} md={12} lg={6}>
                                    <div id={styles.galleryDataContainer}>
                                        <div>
                                            <h5>Name</h5>
                                            <p>{nomeIstitutoProprietario ? nomeIstitutoProprietario : (<i>No info</i>)} <a href="#"><Edit fontSize="small" /></a> </p>
                                        </div>
                                        <div>
                                            <h5>Istituto</h5>
                                            <p>{titoloIstitutoProprietario ? titoloIstitutoProprietario : (<i>No info</i>)} <a href="#"><Edit fontSize="small" /></a> </p>
                                        </div>
                                        <div>
                                            <h5>Descrizione</h5>
                                            <p>{descrizioneIstitutoProprietario ? descrizioneIstitutoProprietario : (<i>No info</i>)} <a href="#"><Edit fontSize="small" /></a> </p>
                                        </div>
                                    </div>
                                </Col>
                                <Col id={styles.saveButtonContainer} xs={12}>
                                    <Button disabled={profileModified ? false : true}>Save profile</Button>
                                </Col>
                                </Row>

                            </Paper>
                        </Col>
                    </Row>
                </Container>
                
                {renderEditModal()}

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