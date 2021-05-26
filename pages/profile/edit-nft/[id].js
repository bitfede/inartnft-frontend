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
import MultimediaUploader from "../../../components/MultimediaUploader";

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

	const [errors, setErrors] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isTouched, setIsTouched] = useState(false);
	const [productObj, setProductObj] = useState(null);
	const [mainNftImageUrl, setMainNftImageUrl] = useState(null);


	useEffect(async () => {
		console.log("@ PAGE LOAD!");
		console.log("ACCOUNT", account);
		console.log("PRODUCT", product);

		setProductObj(product);
		
	}, []);


	//functions ---
	const _handleSubmitBasicInfo = () => {


	}

	//render functions

	//render
	return (
		<Layout title="Profile">
			<Container id={styles.editArtPageContainer}>
				<div className={styles.inputCards}>

					{/* Title & basic info */}
					<div className={styles.inputCard}>
						<h5 className={styles.sectionh5Title}>Edit the basic info about the NFT</h5>
						<Form>

							<Form.Group controlId="formTitle">
								<Form.Label>Title of the NFT</Form.Label>
								<Form.Control
									name="title"
									type="text"
									placeholder="Enter the title"
									value={productObj ? productObj.title : ""}                                                         
									onChange={e => setProductObj({...productObj, title: e.target.value})}
									required
								/>
								<Form.Control.Feedback type="invalid">{isTouched && errors?.title}</Form.Control.Feedback>
								<Form.Text className="text-muted">(This will be the main title of the NFT)</Form.Text>
							</Form.Group>

							<Form.Group controlId="formAuthor">
								<Form.Label>Author</Form.Label>
								<Form.Control value={productObj ? productObj.author : ""} onChange={e => setProductObj({...productObj, author: e.target.value})} placeholder="Enter the author" />
								<Form.Control.Feedback type="invalid">{isTouched && errors?.author}</Form.Control.Feedback>
								<Form.Text className="text-muted">(The author of the art piece)</Form.Text>
							</Form.Group>

							<Form.Group controlId="formPrice">
								<Form.Label>Price</Form.Label>
								<Form.Control value={productObj ? productObj.price : ""} onChange={e => setProductObj({...productObj, price: e.target.value})} as="input" placeholder="110" />
								<Form.Control.Feedback type="invalid">{isTouched && errors?.price}</Form.Control.Feedback>
								<Form.Text className="text-muted">(The price of the art piece in ETH)</Form.Text>
							</Form.Group>

							<Form.Group controlId="formDescription">
								<Form.Label>Description</Form.Label>
								<Form.Control value={productObj ? productObj.describtion : ""} onChange={e => setProductObj({...productObj, describtion: e.target.value})} as="textarea" placeholder="Write your description here...." />
								<Form.Control.Feedback type="invalid">{isTouched && errors?.description}</Form.Control.Feedback>
								<Form.Text className="text-muted">(The description of the art piece)</Form.Text>
							</Form.Group>

							<Form.Group controlId="formHistory">
								<Form.Label>History</Form.Label>
								<Form.Control value={productObj ? productObj.history : ""} onChange={e => setProductObj({...productObj, history: e.target.value})} as="textarea" placeholder="Write the history of the NFT here...." />
								<Form.Control.Feedback type="invalid">{isTouched && errors?.history}</Form.Control.Feedback>
								<Form.Text className="text-muted">(The history of the art piece)</Form.Text>
							</Form.Group>

							<MultimediaUploader
								mediaLabel={"urlImageVideoPresentation"}
								mediaType={"image"}
								mediaUrl={productObj ? productObj.urlImageVideoPresentation : ""}
								productObj={productObj ? productObj : ""}
								setProductObj={setProductObj}
								nftTitle={productObj ? productObj.title : ""}
							/>

						</Form>
						<Button variant="success" onClick={() => _handleSubmitBasicInfo()}>Save Data</Button>
					</div>

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
