import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {Modal, Row, Col, Button, Form, Image, Spinner } from 'react-bootstrap';
import httpClient from '../utilities/http-client';
import { convertToRaw, EditorState, ContentState } from "draft-js";
import draftToHtml from "draftjs-to-html";
const Editor = dynamic(() => import("react-draft-wysiwyg").then(mod => mod.Editor), { ssr: false });
import Loader from './loader/loader';

import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import styles from '../styles/ProductRichDescription.module.css';

let htmlToDraft = null;
if (typeof window === 'object') {
  htmlToDraft = require('html-to-draftjs').default;
}

const ProductRichDescription = (props) => {
    const { productObj, setProductObj } = props;

    // state
    const [isLoading, setIsLoading] = useState(false);
    const [isTouched, setIsTouched] = useState(false);
    const [errors, setErrors] = useState(null);
    const [editorState, setEditorState] = useState(null);

    console.log(editorState)

    useEffect( () => {
        if (!productObj) return
        if (!productObj.documentsProduct) {
            productObj.documentsProduct = {
                descriptionDocument: "",
                titleDocument: ""
            }
        }

        const htmlText = productObj.documentsProduct.descriptionDocument;

        const blocksFromHtml = htmlToDraft(htmlText);
        const { contentBlocks, entityMap } = blocksFromHtml;
        const contentState = ContentState.createFromBlockArray(contentBlocks, entityMap);
        const editorState = EditorState.createWithContent(contentState);

        setEditorState(editorState);


    }, [productObj])

    //functions
    const _handleSubmitRichDescription = async () => {
        
        setIsLoading(true);

        const hashConfig = {
            trigger: "#",
            separator: " ",
        };

        const contentBlocksRaw = convertToRaw(editorState.getCurrentContent());
        const markupHtml = draftToHtml(contentBlocksRaw, hashConfig);
        console.log("MARKUP", markupHtml);

        const payload = {
            productsId: productObj.id,
            titleDocument: productObj.title,
            descriptionDocument: markupHtml,
        };

        try {
            const res = await httpClient.post("/InsertProducts/InsertUpdateDocument", payload);
            console.log("POST DESCR LONG INFO", res);
            setIsLoading(false);
		} catch (error) {
            console.error("ERROR", error.response.status)
            setErrors({ apiCall: `Error ${error.response.status}: ${error.response.data.error}` })
            setIsLoading(false);
            return
		}


    }


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

        try {
            const response = await httpClient.post(`/Upload/UploadImage`, formData, config);
            const retVal = new Promise((resolve, reject) => {
                resolve({ data: { link: response.data.url } });
            });
            setIsLoading(false);
            return retVal;
		} catch (error) {
            console.error("ERROR", error.response.status)
            setErrors({ apiCall: `Error ${error.response.status}: ${error.response.data.error}` })
            setIsLoading(false);
            return
        }

	};

    //render functions


    //main render
    return (
        <div className={styles.inputCard}>
            <h2 className={styles.sectionTitle}>Additional Description</h2>
            <Loader show={isLoading}>
                <Form>
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
                </Form>
            </Loader>
            {!isLoading ? (<Button variant="success" onClick={() => _handleSubmitRichDescription()}>Save Data</Button>) : (<Button variant="success" disabled><Spinner as="span" animation="grow" size="sm" role="status" aria-hidden="true" />Loading...</Button>)}
        </div>
    )
}

export default ProductRichDescription;