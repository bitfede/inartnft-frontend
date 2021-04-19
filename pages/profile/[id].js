/*
 AUTHOR: Federico G. De Faveri
 DATE: April 14th, 2021
 PURPOSE: This is the Profile page of the InArt NFT platform.
*/


//dependencies
import React, {useState} from 'react';
// import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

//hooks
import { useEffect } from 'react';
import { useEthers, account } from '@usedapp/core';

// library components
import {Container, Row, Col, Image, Button, Form} from 'react-bootstrap';
import {Paper, Avatar, Accordion, AccordionSummary, Typography, AccordionDetails} from '@material-ui/core';

//assets and icons
import styles from '../../styles/ProfilePage.module.css'
import { useAuth } from '../../hooks/auth';
import httpClient from '../../utilities/http-client';
import Layout from '../../components/Layout';

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

    //render functions

    //render
    return (

        <Layout title="Profilo">
            <div id={styles.profilePageContainer}>
                <Container>
                    <Row>
                        <Col>
                            <Typography id={styles.profileInfoTitle} variant="h4">Profile Info</Typography>
                            <Paper id={styles.profileInfoCard} elevation={3}>
                                <div id={styles.avatarContainer}>
                                    <Image src={urlImageVideoProfile} />
                                </div>
                                <div class={styles.formContainer}>
                                    <Form>
                                        <Form.Group controlId="userEmail">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control as={"input"} type="string" placeholder=""
                                            value={userEmail}
                                            onChange={(e => setUserEmail(e.target.value))} />
                                        </Form.Group>
                                        <Form.Group controlId="nomeIstitutoProprietario">
                                            <Form.Label>Name</Form.Label>
                                            <Form.Control as={"input"} type="string" placeholder=""
                                            value={nomeIstitutoProprietario}
                                            onChange={(e => setNomeIstitutoProprietario(e.target.value))} />
                                        </Form.Group>
                                        <Form.Group controlId="titoloIstitutoProprietario">
                                            <Form.Label>Institution</Form.Label>
                                            <Form.Control as={"input"} type="string" placeholder=""
                                            value={titoloIstitutoProprietario}
                                            onChange={(e => setTitoloIstitutoProprietario(e.target.value))} />
                                        </Form.Group>
                                        <Form.Group controlId="descrizioneIstitutoProprietario">
                                            <Form.Label>Description</Form.Label>
                                            <Form.Control as={'textarea'} type="string" placeholder=""
                                            value={descrizioneIstitutoProprietario}
                                            onChange={(e => setDescrizioneIstitutoProprietario(e.target.value))} />
                                        </Form.Group>
                                        <Form.Group controlId="phoneNumber">
                                            <Form.Label>Phone Number</Form.Label>
                                            <Form.Control as={'input'} type="string" placeholder=""
                                            value={phoneNumber}
                                            onChange={(e => setPhoneNumber(e.target.value))} />
                                        </Form.Group>
                                    </Form>
                                </div>
                            </Paper>
                        </Col>
                    </Row>
                </Container>
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