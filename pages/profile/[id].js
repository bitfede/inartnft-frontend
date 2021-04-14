/*
 AUTHOR: Federico G. De Faveri
 DATE: April 14th, 2021
 PURPOSE: This is the Profile page of the InArt NFT platform.
*/


//dependencies
import {useState} from 'react';
import {Container, Row, Col, Card, Button, Modal} from 'react-bootstrap';
import {Grid, TextField} from '@material-ui/core';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';
import DateFnsUtils from '@date-io/date-fns';

//hooks
import { useEffect } from 'react';
import { useEthers, account } from '@usedapp/core';

// library components
import Head from 'next/head'
import Link from 'next/link'
import {Avatar, Accordion, AccordionSummary, Typography, AccordionDetails} from '@material-ui/core';

// custom components
import Header from '../../components/Header';
import Footer from '../../components/Footer';

//assets and icons
import styles from '../../styles/ProfilePage.module.css'

//variables

// COMPONENT STARTS HERE
function ArtProductDetailPage(props) {

  const { product } = props;
  console.log("PROPPI", props)

  const { activate, account } = useEthers();

  const [calendarModalOpen, setCalendarModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const handleDateChange = (date) => {
      setSelectedDate(date);
  };



  //functions ---

  //render functions

  //render
  return (

    <div>

        <Head>
            <title>InArt NFT</title>
            <link rel="icon" href="/favicon.ico" />
        </Head>

        <Header />

        <div id={styles.profilePageContainer}>
            PROFILE

        </div>

        <Footer />
    
    </div>
  )
}


export async function getStaticProps(context) {

    console.log("CONTEXT", context)

    return {
        props: { product: "YAAA" } // will be passed to the page component as props
    }
}

export const getStaticPaths = async (slug) => {

    return {
        paths: [], //indicates that no page needs be created at build time
        fallback: 'blocking' //indicates the type of fallback
    }
}


export default ArtProductDetailPage;