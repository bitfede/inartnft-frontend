import React from "react";
import Head from "next/head";
import Header from "./Header";
import Footer from "./Footer";
import settings from "../settings";

export default function Layout({ pageTitle = "", children }) {
	const siteTitle = settings.title || "InArt NFT";
	const title = pageTitle ? `${pageTitle} | ${siteTitle}` : siteTitle;

	return (
		<div>
			<Head>
				<title>{title}</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Header />

			{children}

			<Footer />
		</div>
	);
}
