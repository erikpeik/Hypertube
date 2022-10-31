import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store";
import App from "./App";
import { I18nextProvider } from "react-i18next";
import i18next from "i18next";
import common_ro from "./translations/ro/common.json";
import common_en from "./translations/en/common.json";
import common_fi from "./translations/fi/common.json";

i18next.init({
	interpolation: { escapeValue: false },
	lng: "en",
	resources: {
		en: {
			common: common_en,
		},
		ro: {
			common: common_ro,
		},
		fi: {
			common: common_fi,
		},
	},
});

ReactDOM.createRoot(document.getElementById("root")).render(
	<Provider store={store}>
		<I18nextProvider i18n={i18next}>
			<App />
		</I18nextProvider>
	</Provider>
);
