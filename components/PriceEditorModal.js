import { useState } from "react";
import { utils } from "ethers";
import {Modal, Row, Col, Button, Form } from 'react-bootstrap';

import styles from '../styles/PriceEditorModal.module.css';

const PriceEditorModal = (props) => {
    console.log("PROPPI>>", props)
    const {setEditPriceModalOpen, editPriceModalOpen, productDataForModal, contract} = props;

    const [newPrice, setNewPrice] = useState(null)

    //functions
    const _handleChangePrice = async () => {

		const transaction = await contract.modifyOperaPrice(productDataForModal.mappingContractId, newPrice);
		await transaction.wait();

        // console.log("TX", transaction)
	};



    return (
        <Modal
            show={editPriceModalOpen}
            onHide={() => setEditPriceModalOpen(false)}
            backdrop="static"
            keyboard={false}
        >
            <Modal.Header closeButton>
                <Modal.Title>Change NFT Price</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <p className={styles.currentPriceTitle}><strong>Current Price:</strong></p>
                <p className={styles.currentPriceText}>23</p>
                <p><strong>New Price:</strong></p>
                <Form>
                    <Form.Group >
                        <Form.Control onChange={(e) => setNewPrice(e.target.value)} type="email" placeholder="" />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
            <Button variant="secondary" onClick={() => setEditPriceModalOpen(false)}>
                Close
            </Button>
            <Button onClick={() => _handleChangePrice()} variant="primary">Save New Price</Button>
            </Modal.Footer>
        </Modal>
    )
}

export default PriceEditorModal;