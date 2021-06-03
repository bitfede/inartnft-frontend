import { useState, useEffect } from "react";
import {Modal, Row, Col, Button, Form, Image, Spinner } from 'react-bootstrap';
import settings from "../settings";
import httpClient from '../utilities/http-client';

import Loader from './loader/loader';
import MultimediaUploader from './MultimediaUploader';

import styles from '../styles/ProductVideo.module.css';

const ProductVideo = (props) => {
    const { productObj, setProductObj } = props;

    // state
    const [isLoading, setIsLoading] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const [errors, setErrors] = useState(null);

    useEffect( () => {

	}, []);

    //functions
    const _handleResetImg = e => {
		//empty the FileList every time you click on choose file
		e.target.value = "";
	};

    const _handleSubmitVideo = async () => {

        console.log("I dati da inviare:", productObj.videosProduct);

        const {id, descriptionVideo, tag, titleVideo, url} = productObj.videosProduct;

        const payload = {
            productsId: productObj.id,
            titleVideo: titleVideo,
            descriptionVideo: descriptionVideo,
            url: url,
            tag: tag
        }

        try {
            const resVideoUpl = await httpClient.post("/InsertProducts/InsertUpdateVideo", payload)
            console.log("RES VIDEO UPLOAD: ", resVideoUpl);
		} catch (error) {
            console.error("ERROR", error.response.status)
            setErrors({ apiCall: `Error ${error.response.status}: ${error.response.data.error}` })
            setIsLoading(false);
            return
		}


    }

    const _handleDeleteVideo = async () => {
        
        const currentUrl = productObj.videosProduct.url;
        let choice = confirm("Are you sure you want to delete this video?")

        if (choice === false) return;

        let productObjClone = {...productObj};
        productObjClone.videoProduct = {
            descriptionVideo: "",
            tag: "",
            titleVideo: "",
            url: ""
        }

        const {id, descriptionVideo, tag, titleVideo, url} = productObj.videosProduct;

        const payload = {
            productsId: productObj.id,
            titleVideo: titleVideo,
            descriptionVideo: descriptionVideo,
            url: url,
            tag: tag
        }

        try {
            const res = await httpClient.post("/InsertProducts/RemoveVideo", payload)
            console.log("VIDEO DELETION: ", res)
            setProductObj(productObjClone)
		} catch (error) {
            console.error("ERROR", error.response.status)
            setErrors({ apiCall: `Error ${error.response.status}: ${error.response.data.error}` })
            setIsLoading(false);
            return
		}

    }

    //render functions

    if (!productObj) return "";
    if (!productObj.videosProduct) {
        productObj.videosProduct = {
            tag: "",
            titleVideo: "",
            url: "",
        }
    }

    return (
        <div className={styles.inputCard}>
            <h2 className={styles.sectionTitle}>Video</h2>
            <Loader show={isLoading}>
            <Form>

                <Form.Group controlId="formPrice">
                    <Form.Label>Video Title</Form.Label>
                    <Form.Control value={productObj ? productObj.videosProduct.titleVideo : ""} onChange={e => setProductObj( {...productObj, videosProduct: {...productObj.videosProduct, titleVideo: e.target.value }})  } as="input" placeholder="" />
                    <Form.Control.Feedback type="invalid">{isTouched && errors?.imgDescription}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formDescription">
                    <Form.Label>Video Description</Form.Label>
                    <Form.Control value={productObj ? productObj.videosProduct.descriptionVideo : ""} onChange={e => setProductObj( {...productObj, videosProduct: {...productObj.videosProduct, descriptionVideo: e.target.value}} ) } as="textarea" placeholder="Write your image description here...." />
                    <Form.Control.Feedback type="invalid">{isTouched && errors?.description}</Form.Control.Feedback>
                </Form.Group>
                
                <MultimediaUploader 
                    mediaLabel={"videosProduct.url"} 
                    mediaType="video" 
                    mediaUrl={productObj.videosProduct ? productObj.videosProduct.url : ""} 
                    productObj={productObj ? productObj : ""}        
                    setProductObj={setProductObj}
                    nftTitle={productObj ? productObj.title : ""}
                />

            </Form>
            </Loader>
            {!isLoading ? (<Button variant="success" onClick={() => _handleSubmitVideo()}>Save Data</Button>) : (<Button variant="success" disabled><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />Loading...</Button>)}
            <Button className={styles.deleteMediaBtn} disabled={productObj.videosProduct.url === ""} variant="danger" onClick={() => _handleDeleteVideo()}>Delete Video</Button>
        </div>
    )
}

export default ProductVideo;