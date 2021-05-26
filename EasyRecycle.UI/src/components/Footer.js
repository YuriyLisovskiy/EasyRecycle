import React from "react";
import "../styles/footer.css";

const Footer = () => <footer className="footer p-1 px-2 w-100 text-center">
		<small className="text-muted">
			{process.env.REACT_APP_VERSION ? ('v' + process.env.REACT_APP_VERSION) : "Development Version"} (c) Olena Shipka, Yuriy Lisovskiy, 2021
		</small>
	</footer>;

export default Footer;
