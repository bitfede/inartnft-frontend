import { useState, useEffect } from "react";
import {Modal, Row, Col, Button, Form, Image, Spinner } from 'react-bootstrap';
import settings from "../settings";


import httpClient from '../utilities/http-client';

import Loader from './loader/loader';

import styles from '../styles/ProductElementsEncrypt.module.css';

const ProductElementsEncrypt = (props) => {
    const { productObj, setProductObj } = props;

    // state
    const [isLoading, setIsLoading] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const [errors, setErrors] = useState(null);
    const [tempDocsArr, setTempDocsArr] = useState([]);
    const [existingDocs, setExistingDocs] = useState(null);
    const [docsCleared, setDocsCleared] = useState(false);

    useEffect( () => {

        if (!productObj) return ("");
        if (!productObj.documentsEncrypted) return ("");
        if (!productObj.documentsEncrypted[0]) return "";
        if (docsCleared === true) return("");

        const {documentsEncrypted} = productObj;
        const filesEncryptedObj = documentsEncrypted[0];
        const filesEncryptedArr = filesEncryptedObj.files;
    
        setExistingDocs(filesEncryptedArr);
        
	}, [productObj]);

    //functions
    const _handleAddEncryptedDocs = (e, index) => {

        //add new doc to temp files array
        const docAdded = e.target.files[0];
        let tempDocsArrClone = tempDocsArr;
        tempDocsArrClone[index] = docAdded;
        setTempDocsArr(tempDocsArrClone);
    }

    const _handleClearDocs = () => {
        setDocsCleared(true);
    }

    const _handleSubmitEncryptDocs = async () => {

        setIsLoading(true);
        console.log('submittin encrypt doc', tempDocsArr)

        //delete current docs on DB -- TODO
        const payload1 = JSON.stringify(productObj.documentsEncrypted.encryptionId); //test

        console.log(payload1)

        const deleteDocsRes = await httpClient.post("/Remove/EncryptedFiles", payload1);

        console.log("DELETE DOCS RES", deleteDocsRes);

        //POST new docs to server
        const formData = new FormData();

        tempDocsArr.map((doc, i) => {
            console.log("Append>>",i, doc);
            formData.append("documentsImagesVideosMusic", doc);
        });

        formData.append("productsId", productObj.id);
        const config = {
            headers: {
                "content-type": "multipart/form-data",
            },
        };


        const docsUplRes = await httpClient.post(`/InsertProducts/InsertElementsForEncypt`, formData, config);
        //CHECK HTTP STATUSES!!!!! TO-DO

        console.log("UPL DOCS", docsUplRes);
        setIsLoading(false);
	}

    //render functions

    return (
        <div className={styles.inputCard}>
            <h2 className={styles.sectionTitle}>Encrypted documents</h2>
            <Loader show={isLoading}>
            <Form>
                <Form.Group controlId="formDoc1">
                    <Form.File
                        accept={"application/pdf,image/*,video/*"}
                        onClick={e => console.log(e)}
                        onChange={e => _handleAddEncryptedDocs(e, 0)}
                        id="nftDocumentsForm1"
                        label="NFT Encrypted Document 1"
                        disabled={!docsCleared}
                    />
                    {existingDocs && !docsCleared ? (<Form.Text className="text-muted">File: <a href={"#"} target="_blank">{existingDocs[0]}</a></Form.Text>) : ""}
                </Form.Group>

                <Form.Group controlId="formDoc2">
                    <Form.File
                        accept={"application/pdf,image/*,video/*"}
                        onClick={e => console.log(e)}
                        onChange={e => _handleAddEncryptedDocs(e, 1)}
                        id="nftDocumentsForm2"
                        label="NFT Encrypted Document 2"
                        disabled={!docsCleared}
                    />
                    {existingDocs && !docsCleared  ? (<Form.Text className="text-muted">File: <a href={"#"} target="_blank">{existingDocs[1]}</a></Form.Text>) : ""}
                </Form.Group>

                <Form.Group controlId="formDoc3">
                    <Form.File
                        accept={"application/pdf,image/*,video/*"}
                        onClick={e => console.log(e)}
                        onChange={e => _handleAddEncryptedDocs(e, 2)}
                        id="nftDocumentsForm3"
                        label="NFT Encrypted Document 3"
                        disabled={!docsCleared}
                    />
                    {existingDocs && !docsCleared  ? (<Form.Text className="text-muted">File: <a href={"#"} target="_blank">{existingDocs[2]}</a></Form.Text>) : ""}
                </Form.Group>

                <Form.Group controlId="formDoc2">
                    <Form.File
                        accept={"application/pdf,image/*,video/*"}
                        onClick={e => console.log(e)}
                        onChange={e => _handleAddEncryptedDocs(e, 3)}
                        id="nftDocumentsForm4"
                        label="NFT Encrypted Document 4"
                        disabled={!docsCleared}
                    />
                    {existingDocs && !docsCleared  ? (<Form.Text className="text-muted">File: <a href={"#"} target="_blank">{existingDocs[3]}</a></Form.Text>) : ""}
                </Form.Group>
            </Form>
            </Loader>
            {!isLoading ? (<Button disabled={!docsCleared} variant="success" onClick={() => _handleSubmitEncryptDocs()}>Save Data</Button>) : (<Button variant="success" disabled><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />Loading...</Button>)}
            <Button onClick={() => _handleClearDocs()}id={styles.clearDocsBtn} variant="danger">Clear Documents</Button>
        </div>
    )
}

export default ProductElementsEncrypt;