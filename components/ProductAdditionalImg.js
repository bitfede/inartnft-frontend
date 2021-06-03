import { useState, useEffect } from "react";
import {Modal, Row, Col, Button, Form, Image, Spinner } from 'react-bootstrap';
import settings from "../settings";
import httpClient from '../utilities/http-client';

import Loader from './loader/loader';
import MultimediaUploader from './MultimediaUploader';

import styles from '../styles/ProductAdditionalImg.module.css';

const ProductAdditonalImg = (props) => {
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

    const _handleSubmitImage = async () => {

        console.log("I dati da inviare:", productObj.imagesProduct);

        const {id, descriptionImage, tag, titleImage, url} = productObj.imagesProduct;

        const payload = {
            productsId: productObj.id,
            titleImage: titleImage,
            descriptionImage: descriptionImage,
            url: url,
            tag: tag
        }

        try {
            const resImageUpl = await httpClient.post("/InsertProducts/InsertUpdateImage", payload)
            console.log("RES IMGO UPPL", resImageUpl);
		} catch (error) {
            console.error("ERROR", error.response.status)
            setErrors({ apiCall: `Error ${error.response.status}: ${error.response.data.error}` })
            setIsLoading(false);
            return
		}

    }

    const _handleDeleteImage = async () => {

        const currentUrl = productObj.imagesProduct.url;
        let choice = confirm("Are you sure you want to delete this image?")

        if (choice === false) return;

        let productObjClone = {...productObj};
        productObjClone.imagesProduct = {
            descriptionImage: "",
            tag: "",
            titleImage: "",
            url: ""
        }

        const {id, descriptionImage, tag, titleImage, url} = productObj.imagesProduct;

        const payload = {
            productsId: productObj.id,
            titleImage: titleImage,
            descriptionImage: descriptionImage,
            url: url,
            tag: tag
        }

        try {
            const res = await httpClient.post("/InsertProducts/RemoveImage", payload)
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
    if (!productObj.imagesProduct) {
        productObj.imagesProduct = {
            descriptionImage: "",
            tag: "",
            titleImage: "",
            url: ""
        }
    }

    return (
        <div className={styles.inputCard}>
            <h2 className={styles.sectionTitle}>Image</h2>
            <Loader show={isLoading}>
            <Form>

                <Form.Group controlId="formPrice">
                    <Form.Label>Image Title</Form.Label>
                    <Form.Control value={productObj ? productObj.imagesProduct.titleImage : ""} onChange={e => setProductObj( {...productObj, imagesProduct: {...productObj.imagesProduct, titleImage: e.target.value }})  } as="input" placeholder="" />
                    <Form.Control.Feedback type="invalid">{isTouched && errors?.imgDescription}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group controlId="formDescription">
                    <Form.Label>Image Description</Form.Label>
                    <Form.Control value={productObj ? productObj.imagesProduct.descriptionImage : ""} onChange={e => setProductObj( {...productObj, imagesProduct: {...productObj.imagesProduct, descriptionImage: e.target.value}} ) } as="textarea" placeholder="Write your image description here...." />
                    <Form.Control.Feedback type="invalid">{isTouched && errors?.description}</Form.Control.Feedback>
                </Form.Group>
                
                <MultimediaUploader 
                    mediaLabel={"imagesProduct.url"} 
                    mediaType="image" 
                    mediaUrl={productObj.imagesProduct ? productObj.imagesProduct.url : ""} 
                    productObj={productObj ? productObj : ""}        
                    setProductObj={setProductObj}
                />

            </Form>
            </Loader>
            {!isLoading ? (<Button variant="success" onClick={() => _handleSubmitImage()}>Save Data</Button>) : (<Button variant="success" disabled><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />Loading...</Button>)}
            <Button className={styles.deleteMediaBtn} disabled={productObj.imagesProduct.url === ""} variant="danger" onClick={() => _handleDeleteImage()}>Delete Photo</Button>
        </div>
    )
}

export default ProductAdditonalImg;