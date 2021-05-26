/*
 AUTHOR: Federico G. De Faveri
 DATE: April 26th, 2021
 PURPOSE: This is the page where users can create NFTs.
*/

import { Step, StepLabel, Stepper, Typography } from "@material-ui/core";
import { convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import dynamic from "next/dynamic";
import Router from "next/router";
import React, { useEffect, useState } from "react";
import { Button, Col, Container, Form, Image, Modal, Row } from "react-bootstrap";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import Layout from "../../components/Layout";
import Loader from "../../components/loader/loader";
import { useAuth } from "../../hooks/auth";
import { useContract } from "../../hooks/contract";
import styles from "../../styles/NewNftPage.module.css";
import httpClient from "../../utilities/http-client";
const Editor = dynamic(() => import("react-draft-wysiwyg").then(mod => mod.Editor), { ssr: false });

// COMPONENT STARTS HERE
function NewNftPage(props) {
	const { authToken } = useAuth();
	const { contract } = useContract();

	const editorStateNew = EditorState.createEmpty();

	//state
	const [isTouched, setIsTouched] = useState(false);
	const [isLoading, setIsLoading] = useState(false);
	const [errors, setErrors] = useState(null);

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
	const [additionalImageDesc, setAdditionalImageDesc] = useState(null);
	const [newNftVideo, setNewNftVideo] = useState(null);
	const [newNftVideoTitle, setNewNftVideoTitle] = useState(null);
	const [newNftVideoDesc, setNewNftVideoDesc] = useState(null);

	//step 4
	const [editorState, setEditorState] = useState(editorStateNew);

	useEffect(async () => {
		console.log("PAGE LOADED! LETS MAKE NFTs");
		_handleValidate();
	}, []);

	useEffect(async () => {
		setIsTouched(false);
		_handleValidate();
	}, [
		newNftAuthor,
		newNftDescription,
		newNftHistory,
		newNftMainImage,
		newNftPrice,
		newNftTitle,
		encryptedDocs,
		additionalImage,
		additionalImageTitle,
		additionalImageDesc,
		newNftVideo,
		newNftVideoDesc,
		newNftVideoTitle,
	]);

	useEffect(async () => {
		if (!imgToUpload) return;

		console.log(1111, imgToUpload.type);

		const fileSrc = URL.createObjectURL(imgToUpload);

		console.log(2222, fileSrc);

		setImgToUploadPreview(fileSrc);

		// free memory when ever this component is unmounted
		return () => URL.revokeObjectURL(imgToUpload);
	}, [imgToUpload]);

	const progressSteps = ["NFT Title", "Add info", "Upload multimedia", "Add long description"];

	//functions ---
	const _handleValidate = () => {
		if (activeStep === 0) {
			if (!newNftTitle?.trim()) {
				setErrors({ title: "Missing title" });
				return false;
			}
		}

		if (activeStep === 1) {
			if (!newNftAuthor?.trim()) {
				setErrors({ author: "Missing author" });
				return false;
			}
			if (!newNftPrice?.trim()) {
				setErrors({ price: "Missing price" });
				return false;
			}
			if (!newNftDescription?.trim()) {
				setErrors({ description: "Missing description" });
				return false;
			}
			if (!newNftHistory?.trim()) {
				setErrors({ history: "Missing history" });
				return false;
			}
			if (!newNftMainImage?.trim()) {
				setErrors({ image: "Missing main image" });
				return false;
			}
		}

		if (activeStep === 2) {
			if (!encryptedDocs?.length) {
				setErrors({ encryptedDocs: "Missing documents" });
				return false;
			}
		}

		if (activeStep === 3) {
			// TODO: Set errors here
			if (!additionalImage?.trim()) {
				setErrors({ additionalImage: "Missing additional image" });
				return false;
			}
			if (!additionalImageTitle?.trim()) {
				setErrors({ additionalImage: "Missing additional image's title" });
				return false;
			}
			if (!additionalImageDesc?.trim()) {
				setErrors({ additionalImage: "Missing additional image's description" });
				return false;
			}
		}

		setErrors(null);
		return true;
	};

	const _handleNextStep = async () => {
		try {
			setIsTouched(true);
			const isValid = _handleValidate();
			if (!isValid) {
				return;
			}

			if (activeStep === 0) {
				const payload = JSON.stringify(newNftTitle);

				setIsLoading(true);
				const res = await httpClient.post("/InsertProducts/InsertNewProduct", payload);

				console.log("res", res);

				const { id } = res.data;

				setNewNftId(id);
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
					history: newNftHistory,
				};

				setIsLoading(true);
				const res = await httpClient.post("/InsertProducts/Update", payload);
				//TODO Handle all statuses, 200, 400 etc

				console.log("POST PROD INFO", res);
			}

			if (activeStep === 2) {
				//upload docs

				const formData = new FormData();

				encryptedDocs.map((doc, i) => {
					console.log(i, doc);
					formData.append("documentsImagesVideosMusic", doc);
				});

				formData.append("productsId", newNftId);
				const config = {
					headers: {
						"content-type": "multipart/form-data",
					},
				};

				setIsLoading(true);
				const step3DocsRes = await httpClient.post(`/InsertProducts/InsertElementsForEncypt`, formData, config);
				//CHECK HTTP STATUSES!!!!! TO-DO

				console.log("UPL DOCS", step3DocsRes);
			}

			if (activeStep === 3) {
				console.log(editorState);

				const hashConfig = {
					trigger: "#",
					separator: " ",
				};

				const contentBlocksRaw = convertToRaw(editorState.getCurrentContent());
				const markup = draftToHtml(contentBlocksRaw, hashConfig);
				console.log("MARKUP", markup);

				const payload = {
					productsId: newNftId,
					titleDocuments: newNftTitle,
					descriptionDocuments: markup,
				};

				setIsLoading(true);
				const res = await httpClient.post("/InsertProducts/InsertUpdateDocument", payload);
				//TODO Handle all statuses, 200, 400 etc

				console.log("POST DESCR LONG INFO", res);

				// ---

				//upload img
				console.log(additionalImage, "ready");

				const payloadImg = {
					productsId: newNftId,
					titleImage: additionalImageTitle,
					descriptionImage: additionalImageDesc,
					url: additionalImage,
					tag: newNftTitle,
				};

				const step3ImgRes = await httpClient.post("/InsertProducts/InsertUpdateImage", payloadImg);
				//TODO Handle all statuses, 200, 400 etc

				console.log("UPL IMG", step3ImgRes);

				//upload video
				console.log(newNftVideo, "video ready");

				const payloadVideo = {
					productsId: newNftId,
					titleVideo: newNftVideoTitle,
					descriptionVideo: newNftVideoDesc,
					url: newNftVideo,
					tag: newNftTitle,
				};

				const step3VideoRes = await httpClient.post("/InsertProducts/InsertUpdateVideo", payloadVideo);
				//TODO Handle all statuses, 200, 400 etc

				console.log("UPL VID", step3VideoRes);

				// do not continue, return here if there were problems
				
			}

			if (activeStep === 4) {
				Router.push("/profile/me");
			}

			setIsTouched(false);
			setActiveStep(activeStep + 1);
		} catch (e) {
			console.error(e);
			setErrors({ global: "There was an error performing this operation" });
		} finally {
			setIsLoading(false);
		}
	};

	const _handleNewImg = (e, imageType) => {
		const fileUploaded = e.target.files[0];

		setImgToUpload(fileUploaded);
		setImgDestination(imageType);

		setImgModalOpen(true);

		return;
	};

	const _handleCloseImgPreviewModal = () => {
		setImgToUpload(null);
		setImgToUploadPreview(null);
		setImgModalOpen(false);
	};

	const _handleResetImg = e => {
		//empty the FileList every time you click on choose file
		e.target.value = "";
	};

	const _handleFinalizeImgUpload = async () => {

		setIsImgUploading(true);

		let apiPath = "UploadImage";
		console.log("TESTIN", imgToUpload.type.split("/")[0], "=", "video");
		if (imgToUpload.type.split("/")[0] === "video") {
			apiPath = "UploadVideo";
		}

		const formData = new FormData();
		formData.append("image", imgToUpload);
		formData.append("tag", newNftTitle);
		const config = {
			headers: {
				"content-type": "multipart/form-data",
			},
		};

		const responseUpload = await httpClient.post(`/Upload/${apiPath}`, formData, config);
		//CHECK HTTP STATUSES!!!!! TO-DO

		console.log("UPL IMG", responseUpload);

		const uploadedImgUrl = responseUpload.data.url;

		if (imgDestination === "profile_main_image") {
			setNewNftMainImage(uploadedImgUrl);
		}

		if (imgDestination === "additional_image") {
			setAdditionalImage(uploadedImgUrl);
		}

		if (imgDestination === "main_video") {
			setNewNftVideo(uploadedImgUrl);
			console.log("VIDEO UPL:", uploadedImgUrl);
		}

		setIsImgUploading(false);
		setImgModalOpen(false);
		setImgToUploadPreview(null);
	};

	const _handleAddEncryptedDocs = e => {
		const docAdded = e.target.files[0];
		const encryptedDocsClone = encryptedDocs;
		encryptedDocsClone.push(docAdded);
		setEncryptedDocs(encryptedDocsClone);
	};

	const _handleTextEditorImgUpload = async e => {
		const fileToUpload = e;

		const formData = new FormData();
		formData.append("image", fileToUpload);
		formData.append("tag", fileToUpload.name);
		const config = {
			headers: {
				"content-type": "multipart/form-data",
			},
		};

		const response = await httpClient.post(`/Upload/UploadImage`, formData, config);
		console.log(response);

		const retVal = new Promise((resolve, reject) => {
			resolve({ data: { link: response.data.url } });
		});

		return retVal;
	};

	//render functions
	const renderMainImgModalBody = () => {
		if (imgDestination === "main_video") {
			const videoFormat = imgToUpload;

			return (
				<div id={styles.mainImgModalBodyContainer}>
					<video controls id={styles.mainImgModalPreview}>
						<source src={imgToUploadPreview} type={videoFormat ? videoFormat.type : "video/mp4"} />
					</video>
				</div>
			);
		}

		return (
			<div id={styles.mainImgModalBodyContainer}>
				<Image id={styles.mainImgModalPreview} src={imgToUploadPreview} />
			</div>
		);
	};

	//render
	return (
		<Layout title="Create New NFT">
			<Container id={styles.createNftPageContainer}>
				<Typography id={styles.profileInfoTitle} variant="h4">
					Create a new NFT
				</Typography>

				<Row>
					<Col>
						<div className={styles.stepperContainer}>
							<Stepper activeStep={activeStep} alternativeLabel>
								{progressSteps.map(label => (
									<Step key={label}>
										<StepLabel>{label}</StepLabel>
									</Step>
								))}
							</Stepper>
						</div>
					</Col>
				</Row>

				<Loader show={isLoading}>
					<Row className>
						<Col xs={12} md={6} className={styles.inputAreaRow}>
							{/* Step 0 */}
							{activeStep === 0 && (
								<div>
									<h5>Insert the title of the art piece</h5>
									<Form>
										<Form.Group controlId="formTitle">
											<Form.Label>Title of the NFT</Form.Label>
											<Form.Control
												name="title"
												type="email"
												placeholder="Enter the title"
												value={newNftTitle || ""}
												isInvalid={isTouched && errors?.title}
												onChange={e => setNewNftTitle(e.target.value)}
												required
											/>
											<Form.Control.Feedback type="invalid">{isTouched && errors?.title}</Form.Control.Feedback>
											<Form.Text className="text-muted">(This will be the main title of the NFT)</Form.Text>
										</Form.Group>
									</Form>
								</div>
							)}

							{/* Step 1 */}
							{activeStep === 1 && (
								<div>
									<h5>Insert additional data about the art piece</h5>
									<Form>
										<Form.Group controlId="formAuthor">
											<Form.Label>Author</Form.Label>
											<Form.Control value={newNftAuthor ? newNftAuthor : ""} onChange={e => setNewNftAuthor(e.target.value)} placeholder="Enter the author" />
											<Form.Control.Feedback type="invalid">{isTouched && errors?.author}</Form.Control.Feedback>
											<Form.Text className="text-muted">(The author of the art piece)</Form.Text>
										</Form.Group>

										<Form.Group controlId="formPrice">
											<Form.Label>Price</Form.Label>
											<Form.Control onChange={e => setNewNftPrice(e.target.value)} as="input" placeholder="110" />
											<Form.Control.Feedback type="invalid">{isTouched && errors?.price}</Form.Control.Feedback>
											<Form.Text className="text-muted">(The price of the art piece in ETH)</Form.Text>
										</Form.Group>

										<Form.Group controlId="formDescription">
											<Form.Label>Description</Form.Label>
											<Form.Control onChange={e => setNewNftDescription(e.target.value)} as="textarea" placeholder="Write your description here...." />
											<Form.Control.Feedback type="invalid">{isTouched && errors?.description}</Form.Control.Feedback>
											<Form.Text className="text-muted">(The description of the art piece)</Form.Text>
										</Form.Group>

										<Form.Group controlId="formHistory">
											<Form.Label>History</Form.Label>
											<Form.Control onChange={e => setNewNftHistory(e.target.value)} as="textarea" placeholder="Write the history of the NFT here...." />
											<Form.Control.Feedback type="invalid">{isTouched && errors?.history}</Form.Control.Feedback>
											<Form.Text className="text-muted">(The history of the art piece)</Form.Text>
										</Form.Group>

										<Form.Group controlId="mainNftImg">
											<Form.File accept={"image/*"} onClick={e => _handleResetImg(e)} onChange={e => _handleNewImg(e, "profile_main_image")} id="exampleFormControlFile1" label="NFT Image" />
											<Form.Control.Feedback type="invalid">{isTouched && errors?.image}</Form.Control.Feedback>
											<Form.Text className="text-muted">(The main image of the art piece)</Form.Text>
											{newNftMainImage ? <Image src={newNftMainImage} id={styles.mainImgThumbnailPreview} /> : ""}
										</Form.Group>
									</Form>
								</div>
							)}

							{/* Step 2 */}
							{activeStep === 2 && (
								<div>
									<h5 className={styles.mainTitleOfSection}>Insert documents about this NFT (Max 4)</h5>
									<Form>
										<Form.Group controlId="formDoc1">
											<Form.File
												accept={"application/pdf,image/*,video/*"}
												onClick={e => console.log(e)}
												onChange={e => _handleAddEncryptedDocs(e)}
												id="nftDocumentsForm1"
												label="NFT Encrypted Document 1"
											/>
										</Form.Group>

										<Form.Group controlId="formDoc2">
											<Form.File
												accept={"application/pdf,image/*,video/*"}
												onClick={e => console.log(e)}
												onChange={e => _handleAddEncryptedDocs(e)}
												id="nftDocumentsForm2"
												label="NFT Encrypted Document 2"
											/>
										</Form.Group>

										<Form.Group controlId="formDoc3">
											<Form.File
												accept={"application/pdf,image/*,video/*"}
												onClick={e => console.log(e)}
												onChange={e => _handleAddEncryptedDocs(e)}
												id="nftDocumentsForm3"
												label="NFT Encrypted Document 3"
											/>
										</Form.Group>

										<Form.Group controlId="formDoc2">
											<Form.File
												accept={"application/pdf,image/*,video/*"}
												onClick={e => console.log(e)}
												onChange={e => _handleAddEncryptedDocs(e)}
												id="nftDocumentsForm4"
												label="NFT Encrypted Document 4"
											/>
										</Form.Group>
									</Form>
								</div>
							)}

							{/* Step 3 */}
							{activeStep === 3 && (
								<div>
									<h5 className={styles.mainTitleOfSection}>Insert a detailed description about this NFT</h5>
									<Editor
										editorState={editorState}
										toolbarClassName={styles.rdwToolbarMain}
										wrapperClassName="wrapperClassName"
										editorClassName={styles.rdwEditorMain}
										onEditorStateChange={newState => setEditorState(newState)}
										uploadEnabled={true}
										uploadCallback={e => _handleTextEditorImgUpload(e)}
										previewImage={true}
									/>

									<h5 className={styles.mainTitleOfSection}>Insert an additional image</h5>
									<Form>
										<Form.Group controlId="formDoc1">
											<Form.File accept={"image/*"} onClick={e => _handleResetImg(e)} onChange={e => _handleNewImg(e, "additional_image")} id="nftDocumentsForm1" label="NFT Additional Image" />
										</Form.Group>

										<Form.Group controlId="formPrice">
											<Form.Label>Image Title</Form.Label>
											<Form.Control onChange={e => setAdditionalImageTitle(e.target.value)} as="input" placeholder="" />
										</Form.Group>

										<Form.Group controlId="formDescription">
											<Form.Label>Image Description</Form.Label>
											<Form.Control onChange={e => setAdditionalImageDesc(e.target.value)} as="textarea" placeholder="Write your image description here...." />
										</Form.Group>
										{additionalImage ? <Image src={additionalImage} id={styles.mainImgThumbnailPreview} /> : ""}
									</Form>

									<h5 className={styles.mainTitleOfSection}>Insert video</h5>
									<Form>
										<Form.Group controlId="formVideoMain">
											<Form.File accept={"video/*"} onClick={e => _handleResetImg(e)} onChange={e => _handleNewImg(e, "main_video")} id="nftDocumentsForm1" label="NFT Main Video" />
										</Form.Group>

										<Form.Group controlId="formPrice">
											<Form.Label>Video Title</Form.Label>
											<Form.Control onChange={e => setNewNftVideoTitle(e.target.value)} as="input" placeholder="" />
										</Form.Group>

										<Form.Group controlId="formDescription">
											<Form.Label>Video Description</Form.Label>
											<Form.Control onChange={e => setNewNftVideoDesc(e.target.value)} as="textarea" placeholder="Write your image description here...." />
										</Form.Group>

										{newNftVideo ? (
											<video controls id={styles.mainImgModalPreview}>
												<source src={newNftVideo} type="video/mp4" />
												Sorry, your browser doesn't support embedded videos.
											</video>
										) : (
											""
										)}
									</Form>

								</div>
							)}

							{/* Step 4 */}
							{activeStep === 4 && (
								<p>
									Congratulations!{" "}
									<b>
										<i>"{`${newNftTitle}`}"</i>
									</b>{" "}
									was succesfully created
								</p>
							)}

							{/* Global error */}
							<Form.Group controlId="formTitle">
								<Form.Control.Feedback type="invalid" className="d-block">
									{errors?.global}
								</Form.Control.Feedback>
							</Form.Group>

							{/* Next button */}
							<Button disabled={Object.keys(errors || {}).length} onClick={() => _handleNextStep()}>
								{activeStep <= 3 ? "Next" : "Go Back To Profile Page"}
							</Button>
						</Col>
					</Row>
				</Loader>
			</Container>

			<Modal show={imgModalOpen} onHide={() => _handleCloseImgPreviewModal()} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">Do you want to upload this file?</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Loader show={isImgUploading}>{renderMainImgModalBody()}</Loader>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={() => _handleFinalizeImgUpload()} variant="success">
						Yes
					</Button>
					<Button onClick={() => _handleCloseImgPreviewModal()} variant="danger">
						No
					</Button>
				</Modal.Footer>
			</Modal>
		</Layout>
	);
}

export default NewNftPage;
