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
import {Paper, Card, CardActionArea, CardMedia, CardContent, CardActions, Typography, AccordionDetails} from '@material-ui/core';


//assets and icons
import styles from '../../styles/NewNftPage.module.css';

//variables

// COMPONENT STARTS HERE
function NewNftPage(props) {
    const { authToken } = useAuth();
    // console.log("PROPPI", props)

    const { activate, account } = useEthers();

    //state


    useEffect( async () => {

        console.log("PAGE LOADED! LETS MAKE NFTs")

    }, []);


    //functions ---

    //render functions

    //render
    return (

        <Layout title="Profilo">
            <div id={styles.profilePageContainer}>

            </div>
        </Layout>
    );
}

export default NewNftPage;