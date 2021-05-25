/*
 AUTHOR: Federico G. De Faveri
 DATE: April 14th, 2021
 PURPOSE: This is the Profile page of the InArt NFT platform.
*/

//dependencies
import React, { useState } from "react";
import httpClient from "../../../utilities/http-client";
import { useEthers } from "@usedapp/core";

//hooks
import { useEffect } from "react";

//my components
import Layout from "../../../components/Layout";

//library components
import Link from "next/link";
import { Container, Row, Col, Image, Button, Form, Modal, Spinner } from "react-bootstrap";
// import {  } from "@material-ui/core";

//assets and icons
import styles from "../../../styles/ArtProductEditor.module.css";
import { useAuth } from "../../../hooks/auth";

// COMPONENT STARTS HERE
function ProfilePage(props) {

	const { authToken } = useAuth();
	const {account} = useEthers();

	// const [account, setAccount] = useState("");
	// const [userId, setUserId] = useState(null);


	useEffect(async () => {
		console.log("@ PAGE LOAD!");
		console.log("ACCOUNT", account)
	}, []);


	//functions ---

	//render functions

	//render
	return (
		<Layout title="Profile">
			<div id={styles.editArtPageContainer}>
				<Container>
                    input form
                    input form 
                    etc etc
				</Container>
			</div>
		</Layout>
	);
}

export async function getStaticProps(context) {
	console.log("CONTEXT", context);

	return {
		props: { loading: true }, // will be passed to the page component as props
	};
}

export const getStaticPaths = async slug => {
	return {
		paths: [], //indicates that no page needs be created at build time
		fallback: "blocking", //indicates the type of fallback
	};
};

export default ProfilePage;
