//dependencies
import React, { useEffect, useState } from "react";
import { InjectedConnector } from "@web3-react/injected-connector";
import { Nav, NavDropdown, Navbar, Modal, Button, ListGroup, Image, Spinner, Form } from "react-bootstrap";

//hooks
import { useAuth } from "../hooks/auth";
import { useLogin } from "../hooks/login";

//assets
import styles from "../styles/Header.module.css";

const Header = () => {
	//hooks
	const { authToken, userId, logout } = useAuth();
	const { startLogin } = useLogin();

	return (
		<div>
			<Navbar className={"main-app-navbar"} collapseOnSelect expand="lg">
				<Navbar.Brand id="logoNavContainer" href="/">
					<img src="/img/InArtNFT-logo.png" id="navbarLogo" />
				</Navbar.Brand>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse id="responsive-navbar-nav">
					<Nav className="mr-auto"></Nav>
					<Nav>
						<Nav.Item>
							<Nav.Link className={"nav-link hvr-underline-from-left"} href="/">
								Browse
							</Nav.Link>
						</Nav.Item>
						<NavDropdown title="More" id="nav-dropdown">
							<NavDropdown.Item eventKey="4.1">
								<Nav.Link href="/faq">What is an NFT?</Nav.Link>
							</NavDropdown.Item>
							<NavDropdown.Item eventKey="4.2">
								<Nav.Link href="/faq">FAQ</Nav.Link>
							</NavDropdown.Item>
							<NavDropdown.Item eventKey="4.3">
								<Nav.Link href="/careers">Careers</Nav.Link>
							</NavDropdown.Item>
							<NavDropdown.Divider />
							<NavDropdown.Item eventKey="4.4">
								<Nav.Link href="/contacts">Contacts</Nav.Link>
							</NavDropdown.Item>
						</NavDropdown>
						<Nav.Item>
							<Nav.Link className={"nav-link hvr-underline-from-left"} href="/profile/new-nft">
								Create
							</Nav.Link>
						</Nav.Item>
						<Nav.Item>
							{authToken && userId ? (
								<Nav.Link className={"nav-link hvr-underline-from-left"} href={`/profile/${userId}`}>
									Profile
								</Nav.Link>
							) : (
								<Nav.Link eventKey="disabled" disabled>
									Profile
								</Nav.Link>
							)}
						</Nav.Item>
						{authToken ? (
							<Nav.Item>
								<Nav.Link className={"hvr-underline-from-left btn"} onClick={() => logout()} href="#" eventKey="logout">
									Logout
								</Nav.Link>
							</Nav.Item>
						) : (
							<Nav.Item>
								<Nav.Link className={"hvr-underline-from-left btn"} onClick={() => startLogin()} eventKey="login">
									Login
								</Nav.Link>
							</Nav.Item>
						)}
					</Nav>
				</Navbar.Collapse>
			</Navbar>
		</div>
	);
};

export default Header;
