// src/pages/_document.tsx

import {Head, Html, Main, NextScript} from 'next/document';
import theme from '../theme';
import {ColorModeScript} from "@chakra-ui/react";

export default function Document() {

    return (
        <Html lang="en">
            <Head/>
            <body>
            {/* Add ColorModeScript to apply the initial color mode */}
            <ColorModeScript initialColorMode={theme.config.initialColorMode}/>
            <Main/>
            <NextScript/>
            </body>
        </Html>
    );
}
