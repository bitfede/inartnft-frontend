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

	console.log("PROPS", props)
	const {product} = props;

	const { authToken } = useAuth();
	const {account} = useEthers();

	const [productObj, setProductObj] = useState(null)


	useEffect(async () => {
		console.log("@ PAGE LOAD!");
		console.log("ACCOUNT", account);
		console.log("PRODUCT", product);

		setProductObj(product);
		
	}, []);


	//functions ---

	//render functions

	//render
	return (
		<Layout title="Profile">
			<Container id={styles.editArtPageContainer}>
				<div className={"inputsCard"}>
					
				</div>
			</Container>
		</Layout>
	);
}

export async function getStaticProps(context) {
	console.log("CONTEXT", context.params.id)
	const productId = context.params.id;
	const payload = JSON.stringify(productId);
	const productRes = await httpClient.post("/PublicProduct", payload);
	//  TODO Gestire gli status HTTP
	const product = productRes.data;
	  if (!product) {
	    return {
	      notFound: true,
	    }
	  }
	  console.log(product)
	return {
		props: { product: product }, // will be passed to the page component as props
	};
}

export const getStaticPaths = async slug => {

	return {
		paths: [], //indicates that no page needs be created at build time
		fallback: "blocking", //indicates the type of fallback
	};
};

export default ProfilePage;
