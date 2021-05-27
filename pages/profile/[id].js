/*
 AUTHOR: Federico G. De Faveri
 DATE: April 14th, 2021
 PURPOSE: This is the Profile page of the InArt NFT platform.
*/

//dependencies
import React, { useState } from "react";
import httpClient from "../../utilities/http-client";
import { useEthers } from "@usedapp/core";

//hooks
import { useEffect } from "react";

//my components
import Layout from "../../components/Layout";
import PriceEditorModal from '../../components/PriceEditorModal';

//library components
import Link from "next/link";
import { Container, Row, Col, Image, Button, Form, Modal, Spinner } from "react-bootstrap";
import { Paper, Card, CardActionArea, CardMedia, CardContent, CardActions, Typography, AccordionDetails } from "@material-ui/core";

//assets and icons
import styles from "../../styles/ProfilePage.module.css";
import { useAuth } from "../../hooks/auth";
import { useContract } from "../../hooks/contract";
import { Publish, Edit } from "@material-ui/icons";

// COMPONENT STARTS HERE
function ProfilePage(props) {

	const { authToken } = useAuth();
	const { contract, getAccountAsync } = useContract();
	const {account} = useEthers();

	// const [account, setAccount] = useState("");
	const [userId, setUserId] = useState(null);
	const [nomeIstitutoProprietario, setNomeIstitutoProprietario] = useState(null);
	const [titoloIstitutoProprietario, setTitoloIstitutoProprietario] = useState(null);
	const [descrizioneIstitutoProprietario, setDescrizioneIstitutoProprietario] = useState(null);
	const [urlImageVideoProfile, setUrlImageVideoProfile] = useState(null);
	const [phoneNumber, setPhoneNumber] = useState(null);
	const [userEmail, setUserEmail] = useState(null);
	const [mailIsVisible, setMailIsVisible] = useState(false);
	const [telephoneIsVisible, setTelephoneIsVisible] = useState(false);
	const [userProducts, setUserProducts] = useState(null);
	const [profileModified, setProfileModified] = useState(false);
	const [valueToEdit, setValueToEdit] = useState(null);
	const [avatarImages, setAvatarImages] = useState(null);
	const [avatarImgModal, setAvatarImgModal] = useState(false);
	const [imageToUpload, setImageToUpload] = useState(null);
	const [isUploading, setIsUploading] = useState(false);
	const [selectedImage, setSelectedImage] = useState(null);
	const [isChangingProfilePic, setIsChangingProfilePic] = useState(false);
	const [editPriceModalOpen, setEditPriceModalOpen ] = useState(false);
	const [productDataForModal, setProductDataForModal] = useState(null)

	useEffect(async () => {
		console.log("@ PAGE LOAD!");
		console.log("ACCOUNT", account)
	}, []);

	useEffect(async () => {
		if (!authToken) {
			return;
		}
		if (isChangingProfilePic) {
			return;
		}

		fetchProfileData();
	}, [authToken, isChangingProfilePic]);

	useEffect(async () => {
		if (avatarImgModal === false) {
			return;
		}
		if (isUploading === true) {
			return;
		}

		fetchProfileImages();
	}, [avatarImgModal, isUploading]);

	//functions ---
	const fetchProfileData = async () => {
		let profileRawData;

		try {
			profileRawData = await httpClient.get("/UserInfo/me");
		} catch (e) {
			return console.error("[E]", e);
		}

		const profileData = profileRawData.data;

		console.log("DATA", profileData);

		const {
			id,
			nomeIstitutoProprietario,
			titoloIstitutoProprietario,
			descrizioneIstitutoProprietario,
			urlImageVideoProfile,
			phoneNumber,
			email,
			mailIsVisible,
			telephoneIsVisible,
			userProducts,
		} = profileData;

		setUserId(id);
		setNomeIstitutoProprietario(nomeIstitutoProprietario);
		setTitoloIstitutoProprietario(titoloIstitutoProprietario);
		setDescrizioneIstitutoProprietario(descrizioneIstitutoProprietario);
		setUrlImageVideoProfile(urlImageVideoProfile);
		setPhoneNumber(phoneNumber);
		setUserEmail(email);
		setMailIsVisible(mailIsVisible);
		setTelephoneIsVisible(telephoneIsVisible);
		setUserProducts(userProducts);
	};

	const _handleEditInfo = (e, info, setter) => {
		e.preventDefault();

		// console.log("Editing", info)
		setValueToEdit(info);
	};

	const _handleDoneEditInfo = () => {
		// console.log("Done editing")
		setValueToEdit(null);
	};

	const _handleShowHideInfo = (info, setter) => {
		setProfileModified(true);
		setter(!info);
	};

	const _handleChangeInfoValue = (e, setter) => {
		setProfileModified(true);
		setter(e.target.value);
	};

	const _handleSaveNewProfileInfo = async () => {
		//build the payload
		const payload = {
			nomeIstitutoProprietario: nomeIstitutoProprietario,
			titoloIstitutoProprietario: titoloIstitutoProprietario,
			descrizioneIstitutoProprietario: descrizioneIstitutoProprietario,
			phoneNumber: phoneNumber,
			email: userEmail,
			mailIsVisible: mailIsVisible,
			telephoneIsVisible: telephoneIsVisible,
		};

		let postNewInfoAnswer;

		try {
			postNewInfoAnswer = await httpClient.post("/UserInfo/Update", payload);
		} catch (error) {
			return console.error("[E]", error);
		}

		// TODO handle all statuses here
		// console.log("STATUS", postNewInfoAnswer.status)

		// console.log(postNewInfoAnswer, postNewInfoAnswer.data)

		setProfileModified(false);
	};

	const _handleChangeAvatar = e => {
		e.preventDefault();
		setAvatarImgModal(true);
	};

	const fetchProfileImages = async () => {
		// console.log("FETCHING IMAGES")
		// const payload = {
		//     userid: userId
		// }
		let userImgDataRaw;

		try {
			userImgDataRaw = await httpClient.get("/UserListFiles  ");
		} catch (error) {
			return console.error("[E]", error);
		}

		// console.log("REPLY", userImgDataRaw)
		const userImgData = userImgDataRaw.data;
		setAvatarImages(userImgData);
	};

	const _handleNewImgUpload = e => {
		const fileUploaded = e.target.files[0];

		// console.log("let's go, upload img")

		setImageToUpload(fileUploaded);
	};

	const _finalizeImageUpload = async () => {
		setIsUploading(true);
		const formData = new FormData();
		formData.append("image", imageToUpload);
		formData.append("tag", "Uploaded Profile Image");
		const config = {
			headers: {
				"content-type": "multipart/form-data",
			},
		};

		const responseUpload = await httpClient.post("/Upload/UploadImage", formData, config);
		//CHECK HTTP STATUSES!!!!! TO-DO

		console.log(4, responseUpload);
		setIsUploading(false);
		setSelectedImage(avatarImages.length - 1);
	};

	const selectImageFromGrid = e => {
		const imgIdSelected = e.target.attributes.imgid.nodeValue;

		setSelectedImage(imgIdSelected);
	};

	const saveSelectedProfileInfo = async () => {
		setIsChangingProfilePic(true);
		const newProfileImg = avatarImages[selectedImage];

		const payload = {
			urlImageVideoProfile: newProfileImg.url,
		};

		const changeProfileImgResponse = await httpClient.post("/UserInfo/UpdateProfileImage", payload);

		// console.log("THE REPLY FOR CHANGING PROFILE PIC", changeProfileImgResponse)

		setSelectedImage(null);
		setIsChangingProfilePic(false);
		setImageToUpload(null);
		setAvatarImgModal(false);
	};

	const _handlePublishNft = async prodId => {
		const payload = JSON.stringify(prodId);

		const res = await httpClient.post("/InsertProducts/Publish", payload);
		const { address: sellerAddress, price, title, tokenUri } = res.data;

		const transaction = await contract.addNewOpera(price.toString(), sellerAddress, title, tokenUri);
		await transaction.wait();
	};

	const _handleChangePriceModalOpen = (productIndex) => {

		const productSelected = userProducts[productIndex]
		setProductDataForModal(productSelected)
		setEditPriceModalOpen(true)

	}

	const _handleDeleteNFT = async (productIndex) => {

		const productSelected = userProducts[productIndex];

		const payload = JSON.stringify(productSelected.id);

		const resDel = await httpClient.post("/Remove/Product", payload);

		console.log("DELETE RES", resDel)

	}

	//render functions
	const renderInfo = (attributeName, info, setter) => {
		if (valueToEdit === attributeName) {
			return (
				<Form>
					<Form.Group>
						<div className={styles.infoInputsContainer}>
							<Form.Control
								as={attributeName === "descrizioneIstitutoProprietario" ? "textarea" : "input"}
								type="text"
								value={info}
								onChange={e => _handleChangeInfoValue(e, setter)}
							/>
							<Button
								onClick={() => {
									_handleDoneEditInfo();
								}}>
								Done
							</Button>
						</div>
					</Form.Group>
				</Form>
			);
		}

		return (
			<p>
				{info ? info : <i>No info</i>}{" "}
				<a href="#" onClick={e => _handleEditInfo(e, attributeName, setter)}>
					<Edit fontSize="small" />
				</a>{" "}
			</p>
		);
	};

	const renderModalBody = () => {
		let allTheImages;

		if (!avatarImages) {
			return <p>Loading..</p>;
		}

		if (avatarImages.length <= 0) {
			allTheImages = <p>No images</p>;
		} else {
			allTheImages = avatarImages.map((imgData, i) => {
				const currentImgId = i.toString();
				let selectedClass = "";

				if (currentImgId === selectedImage) {
					selectedClass = styles.selectedImage;
				}

				return (
					<a key={i} href="#1">
						<Image imgid={i} onClick={e => selectImageFromGrid(e)} className={`${styles.avatarImageGridItem} ${selectedClass}`} key={i} src={imgData.url} />
					</a>
				);
			});
		}

		return (
			<div>
				{isUploading ? (
					<Spinner className={styles.loadingSpinner} animation="grow" />
				) : (
					<Form.File id="formcheck-api-regular">
						<Form.File.Label>File input</Form.File.Label>
						<Form.File.Input onChange={e => _handleNewImgUpload(e)} />
						<Button id={styles.uploadSelectedImgBtn} disabled={!imageToUpload ? true : false} onClick={() => _finalizeImageUpload()} size="sm" variant="success">
							Upload
						</Button>
					</Form.File>
				)}
				<hr />
				<div>{allTheImages}</div>
			</div>
		);
	};

	const renderUserProductsGrid = () => {
		if (!userProducts) {
			return <p>Loading..</p>;
		}

		if (userProducts.length === 0) {
			return;
		}

		const theProducts = userProducts.map((product, i) => {
            console.log(product, "PROD");
			return (
				<Card key={i} className={styles.theProductCard}>
					<CardActionArea>
						<CardMedia component={"img"} image={product.urlImageVideoPresentation} title={product.title} />
						<CardContent>
							<Typography gutterBottom variant="h5" component="h2">
								{product.title}
							</Typography>
							<Typography variant="body2" color="textSecondary" component="p">
								{product.author}
							</Typography>
						</CardContent>
					</CardActionArea>
					<CardActions>
						<Button size="small" onClick={() => _handlePublishNft(product.id)} variant="success">
							Publish
						</Button>
						<Button href={`/profile/edit-nft/${product.id}`} size="small" variant="primary">
							Edit
						</Button>
					</CardActions>
					<CardActions>
						<Button size="small" onClick={() => _handleChangePriceModalOpen(i)} variant="info">
							Change Price
						</Button>
						<Button size="small" onClick={() => _handleDeleteNFT(i)} variant="danger">
							Delete
						</Button>
					</CardActions>
				</Card>
			);
		});

		return <>{theProducts}</>;
	};

	//render
	return (
		<Layout title="Profile">
			<div id={styles.profilePageContainer}>
				<Container>
					<Row>
						<Col>
							<Typography id={styles.profileInfoTitle} variant="h4">
								Profile Info
							</Typography>
							<Paper id={styles.profileInfoCard} elevation={3}>
								<Row id={styles.cardRowFirst}>
									<Col xs={12} md={12} lg={6}>
										<div id={styles.avatarContainer}>
											<Image src={urlImageVideoProfile} />
											<a href="#" onClick={e => _handleChangeAvatar(e)} className={styles.imageOverlay}>
												<Publish id={styles.imageOverlayIcon} />
											</a>
										</div>
										<div id={styles.userDataContainer}>
											<div>
												<h5>Email</h5>
												<p>{userEmail}</p>
											</div>
											<div>
												<h5>Phone Number</h5>
												{renderInfo("phoneNumber", phoneNumber, setPhoneNumber)}
											</div>
											<div>
												<Form.Group controlId="formBasicCheckbox">
													<Form.Check checked={mailIsVisible} onChange={() => _handleShowHideInfo(mailIsVisible, setMailIsVisible)} type="checkbox" label="Show email" />
												</Form.Group>
											</div>
											<div>
												<Form.Group controlId="formBasicCheckbox">
													<Form.Check
														checked={telephoneIsVisible}
														onChange={() => _handleShowHideInfo(telephoneIsVisible, setTelephoneIsVisible)}
														type="checkbox"
														label="Show phone number"
													/>
												</Form.Group>
											</div>
										</div>
									</Col>
									<Col xs={12} md={12} lg={6}>
										<div id={styles.galleryDataContainer}>
											<div>
												<h5>Metamask Address</h5>
												<p id={styles.metamaskAddressString}>{account}</p>
											</div>
											<div>
												<h5>Name</h5>
												{renderInfo("nomeIstitutoProprietario", nomeIstitutoProprietario, setNomeIstitutoProprietario)}
											</div>
											<div>
												<h5>Istituto</h5>
												{renderInfo("titoloIstitutoProprietario", titoloIstitutoProprietario, setTitoloIstitutoProprietario)}
											</div>
											<div>
												<h5>Descrizione</h5>
												{renderInfo("descrizioneIstitutoProprietario", descrizioneIstitutoProprietario, setDescrizioneIstitutoProprietario)}
											</div>
										</div>
									</Col>
									<Col id={styles.saveButtonContainer} xs={12}>
										<Button
											className={profileModified ? styles["pulse"] : ""}
											disabled={profileModified ? false : true}
											onClick={() => _handleSaveNewProfileInfo()}
											variant="success">
											Save new profile info{" "}
										</Button>
									</Col>
								</Row>
							</Paper>

							{/* user products section below */}

							<Typography id={styles.NftProductsTitle} variant="h4">
								NFT Products
							</Typography>
							<Paper id={styles.profileInfoCard} elevation={3}>
								<Row id={styles.userProductsRow}>
									<Col id={styles.userProductsContainer}>
										{renderUserProductsGrid()}

										<Card className={styles.theProductCard}>
											<CardActionArea>
												<CardMedia component={"img"} image="https://picsum.photos/250" title="Sell your Art" />
												<CardContent>
													<Typography gutterBottom variant="h5" component="h2">
														Sell Art
													</Typography>
													<Typography variant="body2" color="textSecondary" component="p">
														Sell your art now!
													</Typography>
												</CardContent>
											</CardActionArea>
											<CardActions>
												<Link href="/profile/new-nft">
													<Button size="small" color="primary">
														Create New NFT Art
													</Button>
												</Link>
											</CardActions>
										</Card>
									</Col>
								</Row>
							</Paper>
						</Col>
					</Row>
				</Container>

				<Modal show={avatarImgModal} onHide={() => setAvatarImgModal(false)} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
					<Modal.Header closeButton>
						<Modal.Title id="contained-modal-title-vcenter">Change Profile Image</Modal.Title>
					</Modal.Header>
					<Modal.Body>{renderModalBody()}</Modal.Body>
					<Modal.Footer>
						{isChangingProfilePic ? (
							<Button variant="primary" disabled>
								<Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />
								Loading...
							</Button>
						) : (
							<Button disabled={!selectedImage ? true : false} onClick={() => saveSelectedProfileInfo()} variant="success">
								Select Profile Image
							</Button>
						)}
						<Button onClick={() => setAvatarImgModal(false)}>Close</Button>
					</Modal.Footer>
				</Modal>

				<PriceEditorModal contract={contract} productDataForModal={productDataForModal} editPriceModalOpen={editPriceModalOpen} setEditPriceModalOpen={setEditPriceModalOpen} />
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
