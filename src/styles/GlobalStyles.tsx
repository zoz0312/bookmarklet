import {css, Global} from "@emotion/react";
import {CONTAINER_ID} from "../constants.ts";
import {theme} from "./theme.ts";

const GlobalStyles = () => (
	<Global
		styles={css`
      #${CONTAINER_ID} {
        all: initial;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
          'Helvetica Neue', Arial, sans-serif;
        font-size: 1rem;
        line-height: 1.5;
        color: ${theme.colors.textPrimary};
      }

      #${CONTAINER_ID} * {
        box-sizing: border-box;
      }
    `}
	/>
)

export default GlobalStyles;