import { useState, useEffect } from "react";
import {Modal, Row, Col, Button, Form, Image } from 'react-bootstrap';

import httpClient from '../utilities/http-client';

import Loader from '../components/loader/loader';

import styles from '../styles/MultimediaUploader.module.css';

const MultimediaUploader = (props) => {
    const { mediaLabel, mediaType, mediaUrl, productObj, setProductObj, nftTitle } = props;

    // state
    const [isLoading, setIsLoading] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const [errors, setErrors] = useState(null);
    const [mediaModalOpen, setMediaModalOpen] = useState(false);
    const [mediaToUpload, setMediaToUpload] = useState(null);
    const [mediaToUploadPreview, setMediaToUploadPreview] = useState(null);

    useEffect(async () => {
		if (!mediaToUpload) return;

		const fileSrc = URL.createObjectURL(mediaToUpload);
        setMediaToUploadPreview(fileSrc);

		// free memory when ever this component is unmounted
		return () => URL.revokeObjectURL(fileSrc);
	}, [mediaToUpload]);

    //functions
    const _handleResetImg = e => {
		//empty the FileList every time you click on choose file
		e.target.value = "";
	};

    const _handleNewImg = (e, mediaType) => {
        
		const fileUploaded = e.target.files[0];

		setMediaToUpload(fileUploaded);
		setMediaModalOpen(true);
	};

    const _handleCloseMediaPreviewModal = () => {
        setMediaToUpload(null);
		setMediaToUploadPreview(null);
		setMediaModalOpen(false);
    }

    const _handleFinalizeImgUpload = async () => {

		setIsLoading(true);

        //fix logic here, the fact that is a video does not mean it will go into uploadvideo but could go into encrypted docs
		let apiMediaPath = mediaToUpload.type.split("/")[0] === "video" ? "UploadVideo" : "UploadImage";

		const formData = new FormData();
		formData.append("image", mediaToUpload);
		formData.append("tag", `${nftTitle}-${mediaLabel}`);
		const config = {
			headers: {
				"content-type": "multipart/form-data",
			},
		};

		const responseUpload = await httpClient.post(`/Upload/${apiMediaPath}`, formData, config);
		//CHECK HTTP STATUSES!!!!! TO-DO

		console.log("UPLOAD MEDIA", responseUpload);

		const uploadedMediaUrl = responseUpload.data.url;

        let productObjClone = {...productObj};
        productObjClone[mediaLabel] = uploadedMediaUrl;
		setProductObj(productObjClone);

		setIsLoading(false);
		setMediaModalOpen(false);
		setMediaToUploadPreview(null);
	};

    //render functions
    const renderMainMediaModalBody = () => {

		if (mediaType === "video") {
			const videoFormat = mediaToUpload.type;

			return (
				<div id={styles.mainMediaModalBodyContainer}>
					<video controls id={styles.mainMediaModalPreview}>
						<source src={mediaToUploadPreview} type={videoFormat ? videoFormat.type : "video/mp4"} />
					</video>
				</div>
			);
		}

		return (
			<div id={styles.mainMediaModalBodyContainer}>
				<Image id={styles.mainMediaModalPreview} src={mediaToUploadPreview} />
			</div>
		);
	};  

    
    //TODO add prop that differentiates between video and img upl
    return (
        <>

        <Form>
            <Form.Group controlId="multimediaForm">
                <Form.File accept={"image/*"} onClick={e => _handleResetImg(e)} onChange={e => _handleNewImg(e, mediaType)} id="formControlFile" label="NFT Multimedia" />
                <Form.Control.Feedback type="invalid">{isTouched && errors?.media}</Form.Control.Feedback>
                <Form.Text className="text-muted">(The main image of the art piece)</Form.Text>
                <Loader show={isLoading}>{mediaUrl ? <Image src={mediaUrl} className={styles.multimediaThumbnailPreview} /> : ""}</Loader>
            </Form.Group>
        </Form>
        
        <Modal show={mediaModalOpen} onHide={() => _handleCloseMediaPreviewModal()} size="lg" aria-labelledby="contained-modal-title-vcenter" centered>
				<Modal.Header closeButton>
					<Modal.Title id="contained-modal-title-vcenter">Do you want to upload this file?</Modal.Title>
				</Modal.Header>
				<Modal.Body>
					<Loader show={isLoading}>{renderMainMediaModalBody()}</Loader>
				</Modal.Body>
				<Modal.Footer>
					<Button onClick={() => _handleFinalizeImgUpload()} variant="success">
						Yes
					</Button>
					<Button onClick={() => _handleCloseMediaPreviewModal()} variant="danger">
						No
					</Button>
				</Modal.Footer>
        </Modal>

        </>
    )
}

export default MultimediaUploader;