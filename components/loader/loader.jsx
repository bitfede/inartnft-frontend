import styles from "./loader.module.scss";
import React from "react";
import Loaders from "react-loaders";

export default function Loader({ show = false, children }) {
	return (
		<div className={styles.Loader}>
			<div className={styles.Loader__content}>{children}</div>
			{show && (
				<div className={styles.Loader__background}>
					<div className={styles.Loader__foreground}>
						<div className={styles.Loader__message}>
							<Loaders type="ball-pulse" active />
						</div>
					</div>
				</div>
			)}
		</div>
	);
}
